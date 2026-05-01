import type { AbilityUnlock } from "./Pokemon";
import type { PokemonType } from "./Type";

export interface PokemonSpeciesData {
  pokedexEntry: number;
  pokemonName: string;
  type1: PokemonType;
  type2: PokemonType | null;
  flaw: string;
  strength: string;
  abilityUnlocks: AbilityUnlock[];
}
