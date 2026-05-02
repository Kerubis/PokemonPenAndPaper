import type WebSocket from 'ws';
import { listGames, loadGame, saveGame, updateEncounterDrawing, applyGameUpdate } from '../services/gameService';
import type { WsMessage, GameUpdatePayload } from './wsTypes';
import type { GameState } from '../types/GameState';

function send(ws: WebSocket, msg: object) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function sendError(ws: WebSocket, id: string, message: string) {
  send(ws, { id, type: 'ERROR', message });
}

export async function handleMessage(ws: WebSocket, raw: string) {
  let msg: WsMessage;
  try {
    msg = JSON.parse(raw);
  } catch {
    sendError(ws, 'unknown', 'Invalid JSON');
    return;
  }

  const { id, type, payload } = msg;

  switch (type) {
    case 'PING':
      send(ws, { id, type: 'PONG' });
      break;

    case 'LIST_GAMES': {
      try {
        const games = await listGames();
        send(ws, { id, type: 'GAMES_LISTED', payload: games });
      } catch (err: any) {
        console.error('LIST_GAMES error:', err);
        sendError(ws, id, err?.message ?? 'Failed to list games');
      }
      break;
    }

    case 'LOAD_GAME': {
      try {
        const gameId = (payload as { gameId?: string } | undefined)?.gameId;
        const game = await loadGame(gameId);
        send(ws, { id, type: 'GAME_LOADED', payload: game });
      } catch (err: any) {
        console.error('LOAD_GAME error:', err);
        sendError(ws, id, err?.message ?? 'Failed to load game');
      }
      break;
    }

    case 'SAVE_GAME': {
      if (!payload) {
        sendError(ws, id, 'Missing payload for SAVE_GAME');
        return;
      }
      try {
        const saved = await saveGame(payload as GameState);
        send(ws, { id, type: 'GAME_SAVED', payload: saved });
      } catch (err: any) {
        console.error('SAVE_GAME error:', err);
        sendError(ws, id, err?.message ?? 'Failed to save game');
      }
      break;
    }

    case 'GAME_UPDATE': {
      if (!payload) {
        sendError(ws, id, 'Missing payload for GAME_UPDATE');
        return;
      }
      try {
        await applyGameUpdate(payload as GameUpdatePayload);
        send(ws, { id, type: 'GAME_UPDATED', payload: { op: (payload as GameUpdatePayload).op } });
      } catch (err: any) {
        console.error('GAME_UPDATE error:', err);
        sendError(ws, id, err?.message ?? 'Failed to apply game update');
      }
      break;
    }

    case 'UPDATE_ENCOUNTER_DRAWING': {
      const { encounterGuid, mapDrawing } = payload as { encounterGuid: string; mapDrawing: string };
      if (!encounterGuid) {
        sendError(ws, id, 'Missing encounterGuid for UPDATE_ENCOUNTER_DRAWING');
        return;
      }
      try {
        await updateEncounterDrawing(encounterGuid, mapDrawing ?? '');
        send(ws, { id, type: 'ENCOUNTER_DRAWING_UPDATED', payload: { encounterGuid } });
      } catch (err: any) {
        console.error('UPDATE_ENCOUNTER_DRAWING error:', err);
        sendError(ws, id, err?.message ?? 'Failed to update drawing');
      }
      break;
    }

    default:
      sendError(ws, id ?? 'unknown', `Unknown message type: ${type}`);
  }
}
