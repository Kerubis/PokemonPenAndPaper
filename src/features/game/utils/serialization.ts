import { Pokemon } from "../../pokemon/types/Pokemon";
import { Ability } from "../../abilities/types/Ability";
import { PokemonType } from "../../pokemon/types/Type";
import type { SerializedPokemon, SerializedAbility } from "../types/GameState";
import { getAbilityByName } from "../../abilities/data";
import { createPokemonById } from "../../pokemon/data/pokemonRegistry";

/**
 * Serialize an Ability instance to a plain object
 */
function serializeAbility(ability: Ability): SerializedAbility {
  return {
    name: ability.name,
    type: ability.type.name,
    accuracy: ability.accuracy,
    damageType: ability.damageType,
    damage: ability.damage
  };
}

/**
 * Deserialize a plain object to an Ability instance
 */
function deserializeAbility(data: SerializedAbility): Ability {
  // Try to find the ability from the registry first
  const registeredAbility = getAbilityByName(data.name);
  if (registeredAbility) {
    return registeredAbility;
  }

  // If not found, create a new instance (for custom abilities)
  const type = PokemonType[data.type as keyof typeof PokemonType];
  return new Ability(
    data.name,
    type,
    data.accuracy,
    data.damageType as any,
    data.damage
  );
}

/**
 * Serialize a Pokemon instance to a plain object for storage
 * Only stores instance-specific data - species data is retrieved from registry on load
 */
export function serializePokemon(pokemon: Pokemon): SerializedPokemon {
  return {
    id: pokemon.id,
    pokedexEntry: pokemon.pokedexEntry,
    name: pokemon.name,
    level: pokemon.level,
    hp: pokemon.hp,
    currentHp: pokemon.currentHp,
    attack: pokemon.attack,
    specialAttack: pokemon.specialAttack,
    defense: pokemon.defense,
    specialDefense: pokemon.specialDefense,
    speed: pokemon.speed,
    walkSpeed: pokemon.walkSpeed,
    swimSpeed: pokemon.swimSpeed,
    climbSpeed: pokemon.climbSpeed,
    flySpeed: pokemon.flySpeed,
    isPlayerCharacter: pokemon.isPlayerCharacter,
    abilities: pokemon.abilities.map(serializeAbility),
    index: pokemon.index
  };
}

/**
 * Deserialize a plain object to a Pokemon instance
 * Retrieves species data from registry and applies instance-specific state
 */
export function deserializePokemon(data: SerializedPokemon): Pokemon {
  // Create Pokemon from species registry with all base species data
  const pokemon = createPokemonById(data.pokedexEntry, {
    id: data.id,
    name: data.name,
    level: data.level,
    hp: data.hp,
    currentHp: data.currentHp,
    attack: data.attack,
    specialAttack: data.specialAttack,
    defense: data.defense,
    specialDefense: data.specialDefense,
    speed: data.speed,
    walkSpeed: data.walkSpeed ?? 0,
    swimSpeed: data.swimSpeed ?? 0,
    climbSpeed: data.climbSpeed ?? 0,
    flySpeed: data.flySpeed ?? 0,
    abilities: data.abilities.map(deserializeAbility),
    isPlayerCharacter: data.isPlayerCharacter,
    index: data.index ?? 0
  });

  if (!pokemon) {
    throw new Error(`Failed to deserialize Pokemon with pokedexEntry ${data.pokedexEntry}`);
  }

  return pokemon;
}
