import { PokemonType } from '../types';

/**
 * Get all available Pokemon types
 */
export function getAllPokemonTypes(): PokemonType[] {
  return [
    PokemonType.Normal,
    PokemonType.Fire,
    PokemonType.Water,
    PokemonType.Electric,
    PokemonType.Grass,
    PokemonType.Ice,
    PokemonType.Fighting,
    PokemonType.Poison,
    PokemonType.Ground,
    PokemonType.Flying,
    PokemonType.Psychic,
    PokemonType.Bug,
    PokemonType.Rock,
    PokemonType.Ghost,
    PokemonType.Dragon,
    PokemonType.Dark,
    PokemonType.Steel,
    PokemonType.Fairy,
  ];
}

/**
 * Get Pokemon type by name
 */
export function getPokemonTypeByName(name: string): PokemonType | undefined {
  const types = getAllPokemonTypes();
  return types.find(type => type.name.toLowerCase() === name.toLowerCase());
}

export interface DefensiveEffectiveness {
  weaknesses: PokemonType[];
  doubleWeaknesses: PokemonType[];
  resistances: PokemonType[];
  doubleResistances: PokemonType[];
  immunities: PokemonType[];
}

/**
 * Calculate defensive effectiveness for a Pokemon with one or two types
 * Returns what types this Pokemon is weak/resistant to
 */
export function calculateDefensiveEffectiveness(
  type1: PokemonType,
  type2?: PokemonType
): DefensiveEffectiveness {
  const weaknesses: PokemonType[] = [];
  const doubleWeaknesses: PokemonType[] = [];
  const resistances: PokemonType[] = [];
  const doubleResistances: PokemonType[] = [];
  const immunities: PokemonType[] = [];

  const allTypes = getAllPokemonTypes();

  allTypes.forEach(attackingType => {
    let modifier = attackingType.getOffensiveModifier(type1.name);
    if (type2) {
      modifier *= attackingType.getOffensiveModifier(type2.name);
    }
    if (modifier === 0) {
      immunities.push(attackingType);
      console.log(immunities);
    } else if (modifier >= 4) {
      doubleWeaknesses.push(attackingType);
    } else if (modifier > 1) {
      weaknesses.push(attackingType);
    } else if (modifier <= 0.25) {
      doubleResistances.push(attackingType);
    } else if (modifier < 1) {
      resistances.push(attackingType);
    }
  });

  return { weaknesses, doubleWeaknesses, resistances, doubleResistances, immunities };
}
