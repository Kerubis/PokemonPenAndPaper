import type { Pokemon } from "../types/Pokemon";
import { createPokemonFromJson, type PokemonSpeciesJson } from "./pokemonFactory";

export interface PokemonEntry {
    pokedexEntry: number;
    pokemonName: string;
    createFn: (overrides?: Record<string, unknown>) => Pokemon;
}

/**
 * Auto-discover all Pokemon species from JSON files in the species folder.
 * To add a new species, simply drop a new JSON file there — no code changes needed.
 */
const speciesModules = import.meta.glob('./species/*.json', { eager: true });

/**
 * Registry of all available Pokemon species.
 * Automatically populated from species JSON files.
 */
export const POKEMON_REGISTRY: PokemonEntry[] = Object.values(speciesModules)
  .map((module: unknown) => {
    const data = (module as { default: PokemonSpeciesJson }).default;
    return {
      pokedexEntry: data.pokedexEntry,
      pokemonName: data.pokemonName,
      createFn: (overrides: Record<string, unknown> = {}) => createPokemonFromJson(data, overrides)
    };
  })
  .sort((a, b) => a.pokedexEntry - b.pokedexEntry);

/**
 * Get all available Pokemon species
 */
export function getAvailablePokemon(): PokemonEntry[] {
    return POKEMON_REGISTRY;
}

/**
 * Create a Pokemon instance by species ID
 * @param pokedexEntry - The species ID (e.g., 1 for Bulbasaur, 4 for Charmander, 7 for Squirtle)
 * @returns Pokemon instance or null if ID not found
 */
export function createPokemonById(pokedexEntry: number, overrides: Record<string, unknown> = {}): Pokemon | null {
    const entry = POKEMON_REGISTRY.find(p => p.pokedexEntry === pokedexEntry);
    return entry ? entry.createFn(overrides) : null;
}

/**
 * Get Pokemon species data by ID
 * @param pokedexEntry - The species ID
 * @returns Pokemon entry or undefined if not found
 */
export function getPokemonEntryById(pokedexEntry: number): PokemonEntry | undefined {
    return POKEMON_REGISTRY.find(p => p.pokedexEntry === pokedexEntry);
}

