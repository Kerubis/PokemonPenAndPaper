import type WebSocket from 'ws';
import { loadGame, saveGame } from '../services/gameService';
import type { WsMessage } from './wsTypes';
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

    case 'LOAD_GAME': {
      try {
        const game = await loadGame();
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

    default:
      sendError(ws, id ?? 'unknown', `Unknown message type: ${type}`);
  }
}
