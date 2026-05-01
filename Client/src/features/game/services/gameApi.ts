// ============================================================
// Promise-based API calls over the WebSocket connection.
// Replaces the old localStorage-based gameStorage functions.
// ============================================================

import { sendMessage } from './gameWebSocket';
import type { GameState } from '../types/GameState';
import type { Pokemon } from '../../pokemon/types/Pokemon';
import type { Encounter } from '../../encounters/types/Encounter';
import { serializePokemon, deserializePokemon } from '../utils/serialization';
import { serializeEncounter, deserializeEncounter } from '../../encounters/utils/serialization';

// ---- Load ----------------------------------------------------------------

export async function loadGameFromServer(): Promise<GameState | null> {
  const res = await sendMessage<undefined, GameState | null>('LOAD_GAME');
  return res.payload ?? null;
}

export async function loadPokemonFromServer(): Promise<Pokemon[]> {
  const gameState = await loadGameFromServer();
  if (!gameState) return [];
  return gameState.pokemon.map(deserializePokemon);
}

export async function loadEncountersFromServer(): Promise<Encounter[]> {
  const gameState = await loadGameFromServer();
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
