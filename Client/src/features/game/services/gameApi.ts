// ============================================================
// Promise-based API calls over the WebSocket connection.
// Replaces the old localStorage-based gameStorage functions.
// ============================================================

import { sendMessage } from './gameWebSocket';
import type { GameState } from '../types/GameState';
import type { Pokemon } from '../../pokemon/types/Pokemon';
import type { Encounter } from '../../encounters/types/Encounter';
import type {
  SerializedEncounter,
  SerializedMusicLink,
  SerializedPokemon,
  SerializedTurnOrder,
} from '../types/GameState';
import { serializePokemon, deserializePokemon } from '../utils/serialization';
import { serializeEncounter, deserializeEncounter } from '../../encounters/utils/serialization';

// ---- GAME_UPDATE operation payload ----------------------------------------

export type GameUpdatePayload =
  | { gameGuid: string; op: 'set_game_name';            gameName: string }
  | { gameGuid: string; op: 'upsert_encounter';         encounter: SerializedEncounter }
  | { gameGuid: string; op: 'delete_encounter';         encounterGuid: string }
  | { gameGuid: string; op: 'set_encounter_name';       encounterGuid: string; name: string }
  | { gameGuid: string; op: 'set_encounter_finished';   encounterGuid: string; finished: boolean }
  | { gameGuid: string; op: 'set_encounter_story';      encounterGuid: string; story: string }
  | { gameGuid: string; op: 'set_encounter_index';      encounterGuid: string; index: number }
  | { gameGuid: string; op: 'set_encounter_music';      encounterGuid: string; links: SerializedMusicLink[] }
  | { gameGuid: string; op: 'set_encounter_pokemon';    encounterGuid: string; pokemonGuids: string[] }
  | { gameGuid: string; op: 'set_encounter_turn_order'; encounterGuid: string; turnOrder: SerializedTurnOrder | null }
  | { gameGuid: string; op: 'upsert_pokemon';           pokemon: SerializedPokemon }
  | { gameGuid: string; op: 'delete_pokemon';           pokemonId: string };

// ---- List ----------------------------------------------------------------

export interface GameSummary {
  guid: string;
  gameName: string;
  updatedAt: string;
}

export async function listGamesFromServer(): Promise<GameSummary[]> {
  const res = await sendMessage<undefined, GameSummary[]>('LIST_GAMES');
  return res.payload ?? [];
}

// ---- Load ----------------------------------------------------------------

export async function loadGameFromServer(gameId?: string): Promise<GameState | null> {
  const res = await sendMessage<{ gameId?: string } | undefined, GameState | null>('LOAD_GAME', gameId ? { gameId } : undefined);
  return res.payload ?? null;
}

export async function loadPokemonFromServer(gameId?: string): Promise<Pokemon[]> {
  const gameState = await loadGameFromServer(gameId);
  if (!gameState) return [];
  return gameState.pokemon.map(deserializePokemon);
}

export async function loadEncountersFromServer(gameId?: string): Promise<Encounter[]> {
  const gameState = await loadGameFromServer(gameId);
  if (!gameState) return [];
  return (gameState.encounters ?? []).map(deserializeEncounter);
}

// ---- Save ----------------------------------------------------------------

export async function saveGameToServer(
  guid: string,
  gameName: string,
  pokemon: Pokemon[],
  encounters: Encounter[] = [],
): Promise<GameState> {
  const now = new Date().toISOString();
  const state: GameState = {
    guid,
    gameName,
    pokemon: pokemon.map(serializePokemon),
    encounters: encounters.map(serializeEncounter),
    createdAt: now,
    updatedAt: now,
  };
  const res = await sendMessage<GameState, GameState>('SAVE_GAME', state);
  return res.payload!;
}

// ---- Import / Export JSON ------------------------------------------------

export async function importGameFromServer(jsonString: string): Promise<GameState> {
  const state = JSON.parse(jsonString) as GameState;
  const res = await sendMessage<GameState, GameState>('SAVE_GAME', state);
  return res.payload!;
}

export function exportGameAsJson(state: GameState): string {
  return JSON.stringify(state, null, 2);
}

// ---- Targeted game updates -----------------------------------------------

/**
 * Send a targeted incremental update to the server.
 * Use this for all normal mutations instead of saveGameToServer,
 * which is now reserved for full import/export syncs.
 */
export async function sendGameUpdate(payload: GameUpdatePayload): Promise<void> {
  await sendMessage<GameUpdatePayload, { op: string }>('GAME_UPDATE', payload);
}

// ---- Drawing (large payload — separate channel) --------------------------

/**
 * Send only the drawing data for a single encounter.
 * Bypasses GAME_UPDATE to avoid mixing large binary data with small state ops.
 */
export async function updateEncounterDrawing(
  encounterGuid: string,
  mapDrawing: string,
): Promise<void> {
  await sendMessage<{ encounterGuid: string; mapDrawing: string }, { encounterGuid: string }>(
    'UPDATE_ENCOUNTER_DRAWING',
    { encounterGuid, mapDrawing },
  );
}
