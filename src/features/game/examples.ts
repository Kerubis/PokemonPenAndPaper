/**
 * Game Storage API Usage Examples
 * 
 * This demonstrates how to use the game storage system to save/load games
 */

import { saveGame, updateGame, loadGame, loadPokemon, exportGameAsJson, importGameFromJson, deleteGame, hasGameSaved } from './index';
import { createPokemonById } from '../pokemon/data/pokemonRegistry';

// Example: Create a new game with Pokemon
export function createNewGame() {
  const gameGuid = crypto.randomUUID();
  const gameName = "My Pokemon Adventure";
  
  // Create some Pokemon instances
  const bulbasaur = createPokemonById(1, { name: "Bulby", level: 5, isPlayerCharacter: true });
  const charmander = createPokemonById(4, { name: "Charlie", level: 5 });
  const squirtle = createPokemonById(7, { name: "Squirty", level: 5 });
  
  const pokemon = [bulbasaur, charmander, squirtle].filter((p): p is NonNullable<typeof p> => p !== null);
  
  // Save the game
  const gameState = saveGame(gameGuid, gameName, pokemon);
  console.log('Game saved:', gameState);
  
  return gameState;
}

// Example: Load existing game
export function continueGame() {
  if (!hasGameSaved()) {
    console.log('No saved game found');
    return null;
  }
  
  const gameState = loadGame();
  if (!gameState) {
    console.log('Failed to load game');
    return null;
  }
  
  console.log(`Loaded game: ${gameState.gameName} (${gameState.guid})`);
  console.log(`Created: ${gameState.createdAt}`);
  console.log(`Last updated: ${gameState.updatedAt}`);
  console.log(`Pokemon count: ${gameState.pokemon.length}`);
  
  // Load Pokemon as class instances
  const pokemon = loadPokemon();
  console.log('Pokemon instances:', pokemon);
  
  return { gameState, pokemon };
}

// Example: Update game with new Pokemon
export function addPokemonToGame(newPokemon: NonNullable<ReturnType<typeof createPokemonById>>) {
  const existingGame = loadGame();
  if (!existingGame) {
    console.log('No game to update');
    return null;
  }
  
  const pokemon = loadPokemon();
  pokemon.push(newPokemon);
  
  const updatedState = updateGame(existingGame.guid, existingGame.gameName, pokemon);
  console.log('Game updated with new Pokemon:', updatedState);
  
  return updatedState;
}

// Example: Export game to JSON file
export function exportGame() {
  const json = exportGameAsJson();
  if (!json) {
    console.log('No game to export');
    return null;
  }
  
  // Create a download link
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

// Example: Import game from JSON
export function importGame(jsonString: string) {
  try {
    const gameState = importGameFromJson(jsonString);
    console.log('Game imported successfully:', gameState);
    return gameState;
  } catch (error) {
    console.error('Failed to import game:', error);
    return null;
  }
}

// Example: Delete current game
export function clearGame() {
  if (!hasGameSaved()) {
    console.log('No game to delete');
    return;
  }
  
  deleteGame();
  console.log('Game deleted');
}
