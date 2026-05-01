/**
 * Game Storage API Usage Examples
 * 
 * These are reference examples for using the server-backed game API.
 * In the app, all state is managed through GameContext (src/contexts/GameContext.tsx).
 */

import { loadGameFromServer, saveGameToServer, exportGameAsJson } from './index';
import { createPokemonById } from '../pokemon/data/pokemonRegistry';

// Example: Create a new game with Pokemon
export async function createNewGame() {
  const gameGuid = crypto.randomUUID();
  const gameName = "My Pokemon Adventure";

  // Create some Pokemon instances
  const bulbasaur = createPokemonById(1, { name: "Bulby", level: 5, isPlayerCharacter: true });
  const charmander = createPokemonById(4, { name: "Charlie", level: 5 });
  const squirtle = createPokemonById(7, { name: "Squirty", level: 5 });

  const pokemon = [bulbasaur, charmander, squirtle].filter((p): p is NonNullable<typeof p> => p !== null);

  // Save the game
  const gameState = await saveGameToServer(gameGuid, gameName, pokemon);
  console.log('Game saved:', gameState);

  return gameState;
}

// Example: Load existing game
export async function continueGame() {
  const gameState = await loadGameFromServer();
  if (!gameState) {
    console.log('No saved game found on server');
    return null;
  }

  console.log(`Loaded game: ${gameState.gameName} (${gameState.guid})`);
  console.log(`Created: ${gameState.createdAt}`);
  console.log(`Last updated: ${gameState.updatedAt}`);
  console.log(`Pokemon count: ${gameState.pokemon.length}`);

  return gameState;
}

// Example: Add pokemon to game
export async function addPokemonToGame(newPokemon: NonNullable<ReturnType<typeof createPokemonById>>) {
  const gameState = await loadGameFromServer();
  if (!gameState) {
    console.log('No game to update');
    return null;
  }

  const { deserializePokemon } = await import('./utils/serialization');
  const existing = (gameState.pokemon ?? []).map(deserializePokemon);
  existing.push(newPokemon);

  const updated = await saveGameToServer(gameState.guid, gameState.gameName, existing);
  console.log('Game updated with new Pokemon:', updated);
  return updated;
}

// Example: Export game to JSON file
export async function exportGame() {
  const gameState = await loadGameFromServer();
  if (!gameState) {
    console.log('No game to export');
    return null;
  }

  const json = exportGameAsJson(gameState);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pokemon-game-save.json';
  a.click();
  URL.revokeObjectURL(url);

  console.log('Game exported');
  return json;
}
