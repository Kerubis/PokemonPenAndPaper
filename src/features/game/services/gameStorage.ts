import type { GameState } from "../types/GameState";
import type { Pokemon } from "../../pokemon/types/Pokemon";
import type { Encounter } from "../../encounters/types/Encounter";
import { serializePokemon, deserializePokemon } from "../utils/serialization";
import { serializeEncounter, deserializeEncounter } from "../../encounters/utils/serialization";

const STORAGE_KEY = 'pokemon_pen_and_paper_game';

/**
 * Save game state to localStorage
 * @param guid - Game unique identifier
 * @param gameName - Name of the game
 * @param pokemon - Array of Pokemon instances to save
 * @param encounters - Array of Encounter instances to save
 * @returns The saved game state
 */
export function saveGame(
  guid: string,
  gameName: string,
  pokemon: Pokemon[],
  encounters: Encounter[] = []
): GameState {
  const now = new Date().toISOString();
  
  const gameState: GameState = {
    guid,
    gameName,
    pokemon: pokemon.map(serializePokemon),
    encounters: encounters.map(serializeEncounter),
    createdAt: now,
    updatedAt: now
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    return gameState;
  } catch (error) {
    console.error('Failed to save game to localStorage:', error);
    throw new Error('Failed to save game');
  }
}

/**
 * Update existing game state in localStorage
 * @param guid - Game unique identifier
 * @param gameName - Name of the game
 * @param pokemon - Array of Pokemon instances to save
 * @param encounters - Array of Encounter instances to save
 * @returns The updated game state
 */
export function updateGame(
  guid: string,
  gameName: string,
  pokemon: Pokemon[],
  encounters: Encounter[] = []
): GameState {
  const existingGame = loadGame();
  const now = new Date().toISOString();
  
  const gameState: GameState = {
    guid,
    gameName,
    pokemon: pokemon.map(serializePokemon),
    encounters: encounters.map(serializeEncounter),
    createdAt: existingGame?.createdAt ?? now,
    updatedAt: now
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    return gameState;
  } catch (error) {
    console.error('Failed to update game in localStorage:', error);
    throw new Error('Failed to update game');
  }
}

/**
 * Load game state from localStorage
 * @returns The loaded game state or null if not found
 */
export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as GameState;
  } catch (error) {
    console.error('Failed to load game from localStorage:', error);
    return null;
  }
}

/**
 * Load Pokemon instances from saved game
 * @returns Array of Pokemon instances or empty array if no game found
 */
export function loadPokemon(): Pokemon[] {
  const gameState = loadGame();
  if (!gameState) {
    return [];
  }

  try {
    return gameState.pokemon.map(deserializePokemon);
  } catch (error) {
    console.error('Failed to deserialize Pokemon:', error);
    return [];
  }
}

/**
 * Load Encounter instances from saved game
 * @returns Array of Encounter instances or empty array if no game found
 */
export function loadEncounters(): Encounter[] {
  const gameState = loadGame();
  if (!gameState) {
    return [];
  }

  try {
    return (gameState.encounters || []).map(deserializeEncounter);
  } catch (error) {
    console.error('Failed to deserialize Encounters:', error);
    return [];
  }
}

/**
 * Export game state as JSON string
 * @returns JSON string of the game state or null if no game found
 */
export function exportGameAsJson(): string | null {
  const gameState = loadGame();
  if (!gameState) {
    return null;
  }
  return JSON.stringify(gameState, null, 2);
}

/**
 * Import game state from JSON string
 * @param jsonString - JSON string containing game state
 * @returns The imported game state
 */
export function importGameFromJson(jsonString: string): GameState {
  try {
    const gameState = JSON.parse(jsonString) as GameState;
    localStorage.setItem(STORAGE_KEY, jsonString);
    return gameState;
  } catch (error) {
    console.error('Failed to import game from JSON:', error);
    throw new Error('Invalid game data');
  }
}

/**
 * Delete saved game from localStorage
 */
export function deleteGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to delete game from localStorage:', error);
    throw new Error('Failed to delete game');
  }
}

/**
 * Check if a saved game exists
 * @returns true if a game exists in localStorage
 */
export function hasGameSaved(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
