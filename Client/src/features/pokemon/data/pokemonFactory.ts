import type { Pokemon } from "../types/Pokemon";
import { createPokemon, registerAbilityUnlock } from "../types/pokemonOps";
import { PokemonType } from "../types/Type";
import { Abilities } from "../../abilities";

/**
 * JSON-serializable schema for a Pokemon species.
 * Types and abilities are referenced by their string key names
 * (e.g. "Grass", "Poison", "Tackle") and resolved at runtime.
 */
export interface PokemonSpeciesJson {
  pokedexEntry: number;
  pokemonName: string;
  /** Must match a static property of PokemonType, e.g. "Grass", "Fire" */
  type1: string;
  /** Must match a static property of PokemonType, or null for single-typed species */
  type2: string | null;
  flaw: string;
  strength: string;
  abilityUnlocks: {
    /** Must match an Abilities key, e.g. "Tackle", "TailWhip" */
    ability: string;
    level: number;
  }[];
}

/**
 * Resolve a type string to a PokemonType instance.
 * PokemonType exposes all types as static properties (e.g. PokemonType.Grass).
 */
function resolveType(typeName: string): PokemonType {
  const type = (PokemonType as unknown as Record<string, unknown>)[typeName];
  if (!(type instanceof PokemonType)) {
    throw new Error(`Unknown PokemonType: "${typeName}". Check that it matches a static PokemonType property.`);
  }
  return type;
}

/**
 * Create a Pokemon instance from a JSON species definition.
 * Resolves type and ability string keys to their runtime instances.
 */
export function createPokemonFromJson(data: PokemonSpeciesJson, overrides: Record<string, unknown> = {}): Pokemon {
  const type1 = resolveType(data.type1);
  const type2 = data.type2 ? resolveType(data.type2) : null;

  let pokemon = createPokemon(
    data.pokedexEntry,
    data.pokemonName,
    type1,
    type2,
    { flaw: data.flaw, strength: data.strength, ...overrides } as Parameters<typeof createPokemon>[4],
  );

  for (const { ability: abilityKey, level } of data.abilityUnlocks) {
    const resolvedAbility = Abilities[abilityKey];
    if (!resolvedAbility) {
      throw new Error(`Unknown ability: "${abilityKey}". Check that it matches an Abilities key (spaces removed, e.g. "TailWhip").`);
    }
    pokemon = registerAbilityUnlock(pokemon, resolvedAbility, level);
  }

  return pokemon;
}
