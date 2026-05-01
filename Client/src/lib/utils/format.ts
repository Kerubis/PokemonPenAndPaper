/**
 * Format a Pokedex number as a 3-digit string with leading zeros
 * @param num - The Pokedex number
 * @returns Formatted string (e.g., "#001", "#025", "#150")
 */
export function formatPokedexNumber(num: number): string {
  return `#${num.toString().padStart(3, '0')}`;
}

/**
 * Format HP display showing current and max HP
 * @param current - Current HP value
 * @param max - Maximum HP value
 * @returns Formatted string (e.g., "25 / 50")
 */
export function formatHpDisplay(current: number, max: number): string {
  return `${current} / ${max}`;
}

/**
 * Convert ability accuracy rating to D20 target number
 * @param accuracy - The accuracy rating (higher is better)
 * @returns D20 target number needed to hit (lower is better)
 */
export function formatAbilityAccuracy(accuracy: number): number {
  return 20 - accuracy / 5;
}
