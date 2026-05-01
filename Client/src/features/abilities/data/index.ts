import type { Ability } from "../types/Ability";

/**
 * Auto-discover all abilities from the moves folder
 * Each move file must export a 'registration' object with ability property
 */
const moveModules = import.meta.glob('./moves/*.ts', { eager: true });

/**
 * Registry of all available abilities
 * Automatically populated from move files - no manual maintenance needed!
 */
const ABILITY_LIST: Ability[] = Object.values(moveModules)
  .map((module: any) => module.registration?.ability)
  .filter(Boolean);

/**
 * Abilities object for easy access by name
 * Access abilities like: Abilities.Tackle, Abilities.Ember, etc.
 */
export const Abilities = ABILITY_LIST.reduce((acc, ability) => {
  // Convert name to camelCase key (e.g., "Tail Whip" -> "TailWhip")
  const key = ability.name.replace(/\s+/g, '');
  acc[key] = ability;
  return acc;
}, {} as Record<string, Ability>);

/**
 * Get all available abilities
 */
export function getAvailableAbilities(): Ability[] {
  return ABILITY_LIST;
}

/**
 * Get ability by name
 */
export function getAbilityByName(name: string): Ability | undefined {
  return ABILITY_LIST.find(ability => ability.name === name);
}
