/**
 * A single effect/condition that is active during an encounter.
 * If `pokemonId` is set, the effect belongs to that Pokémon.
 * If `pokemonId` is undefined, the effect is global (weather, terrain, etc.).
 * `remainingRounds === -1` means the effect persists for the whole battle.
 */
export interface TurnEffect {
    id: string;
    name: string;
    description?: string;
    remainingRounds: number; // -1 = persistent whole-battle effect
    pokemonId?: string;      // undefined → global effect
}

/**
 * One slot in the turn order for a single Pokémon.
 */
export interface TurnOrderEntry {
    pokemonId: string;
    baseInitiative: number;          // auto-computed: speed + level / 10
    initiativeOverride: number | null; // set manually; null = use base
}

/**
 * Returns the effective initiative used for ordering.
 */
export const getEffectiveInitiative = (entry: TurnOrderEntry): number =>
    entry.initiativeOverride ?? entry.baseInitiative;

/**
 * Computes the base initiative for a Pokémon from its stats.
 */
export const getBaseInitiative = (pokemon: { speed: number; level: number }): number =>
    pokemon.speed + pokemon.level / 100;

/**
 * The full turn order state for a running encounter.
 * Not persisted — lives only in React state.
 */
export interface TurnOrder {
    entries: TurnOrderEntry[];  // sorted descending by effective initiative
    currentRound: number;
    currentIndex: number;       // index into entries[]
    effects: TurnEffect[];      // all effects (global + per-pokémon)
}
