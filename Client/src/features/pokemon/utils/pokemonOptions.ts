import { getAvailablePokemon } from '@/features/pokemon/data/pokemonRegistry';

export interface PokemonOption {
    id: string;
    name: string;
    number: number;
}

/**
 * Get all available Pokemon formatted for dropdown/selection UI
 */
export function getAvailablePokemonOptions(): PokemonOption[] {
    return getAvailablePokemon().map(entry => ({
        id: entry.pokedexEntry.toString(),
        name: entry.pokemonName,
        number: entry.pokedexEntry
    }));
}

/**
 * Get a specific Pokemon option by ID
 */
export function getPokemonOptionById(id: string): PokemonOption | undefined {
    const num = parseInt(id, 10);
    const entry = getAvailablePokemon().find(p => p.pokedexEntry === num);
    
    if (!entry) return undefined;
    
    return {
        id: entry.pokedexEntry.toString(),
        name: entry.pokemonName,
        number: entry.pokedexEntry
    };
}
