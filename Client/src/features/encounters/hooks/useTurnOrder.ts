import { useCallback } from 'react';
import type { Pokemon } from '@/features/pokemon/types';
import type { TurnOrder, TurnOrderEntry, TurnEffect } from '../types/TurnOrder';
import { getEffectiveInitiative, getBaseInitiative } from '../types/TurnOrder';

type TurnOrderUpdater = TurnOrder | null | ((prev: TurnOrder | null) => TurnOrder | null);

function buildEntries(pokemon: Pokemon[]): TurnOrderEntry[] {
    return [...pokemon]
        .map(p => ({
            pokemonId: p.id,
            baseInitiative: getBaseInitiative(p),
            initiativeOverride: null,
        }))
        .sort((a, b) => getEffectiveInitiative(b) - getEffectiveInitiative(a));
}

/** Tick effects for a given predicate; remove those that reach 0. */
function tickMatching(
    effects: TurnEffect[],
    match: (e: TurnEffect) => boolean
): TurnEffect[] {
    return effects
        .map(e => (e.remainingRounds === -1 || !match(e)) ? e : { ...e, remainingRounds: e.remainingRounds - 1 })
        .filter(e => e.remainingRounds !== 0);
}

export function useTurnOrder(
    setTurnOrder: (updater: TurnOrderUpdater) => void,
) {
    /** Start a new battle, computing base initiatives from the pokemon list. */
    const initTurnOrder = useCallback((pokemon: Pokemon[]) => {
        setTurnOrder({
            entries: buildEntries(pokemon),
            currentRound: 1,
            currentIndex: 0,
            effects: [],
        });
    }, []);

    /** End the battle and clear all state. */
    const endTurnOrder = useCallback(() => {
        setTurnOrder(null);
    }, []);

    /** Advance to the next actor; increments round when wrapping.
     *  - On round start (wrap): global effects are ticked.
     *  - On every turn start: effects assigned to the incoming pokemon are ticked.
     */
    const nextTurn = useCallback(() => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            const nextIndex = prev.currentIndex + 1;
            const wraps = nextIndex >= prev.entries.length;
            const resolvedIndex = wraps ? 0 : nextIndex;
            const incomingPokemonId = prev.entries[resolvedIndex]?.pokemonId;

            let effects = prev.effects;
            // Tick global effects at the start of a new round
            if (wraps) {
                effects = tickMatching(effects, e => !e.pokemonId);
            }
            // Tick per-pokemon effects for the pokemon whose turn is starting
            if (incomingPokemonId) {
                effects = tickMatching(effects, e => e.pokemonId === incomingPokemonId);
            }

            return {
                ...prev,
                currentIndex: resolvedIndex,
                currentRound: wraps ? prev.currentRound + 1 : prev.currentRound,
                effects,
            };
        });
    }, []);

    /** Step back to the previous actor; decrements round when wrapping back. */
    const prevTurn = useCallback(() => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            const prevIndex = prev.currentIndex - 1;
            const wraps = prevIndex < 0;
            return {
                ...prev,
                currentIndex: wraps ? prev.entries.length - 1 : prevIndex,
                currentRound: wraps && prev.currentRound > 1
                    ? prev.currentRound - 1
                    : prev.currentRound,
            };
        });
    }, []);

    /** Manually override the initiative of one entry and re-sort. */
    const setInitiativeOverride = useCallback((pokemonId: string, value: number) => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            const currentPokemonId = prev.entries[prev.currentIndex]?.pokemonId;
            const updatedEntries = prev.entries.map(e =>
                e.pokemonId === pokemonId ? { ...e, initiativeOverride: value } : e
            ).sort((a, b) => getEffectiveInitiative(b) - getEffectiveInitiative(a));
            const newIndex = updatedEntries.findIndex(e => e.pokemonId === currentPokemonId);
            return {
                ...prev,
                entries: updatedEntries,
                currentIndex: newIndex >= 0 ? newIndex : prev.currentIndex,
            };
        });
    }, []);

    /** Remove a manual override, reverting to the base initiative, and re-sort. */
    const clearInitiativeOverride = useCallback((pokemonId: string) => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            const currentPokemonId = prev.entries[prev.currentIndex]?.pokemonId;
            const updatedEntries = prev.entries.map(e =>
                e.pokemonId === pokemonId ? { ...e, initiativeOverride: null } : e
            ).sort((a, b) => getEffectiveInitiative(b) - getEffectiveInitiative(a));
            const newIndex = updatedEntries.findIndex(e => e.pokemonId === currentPokemonId);
            return {
                ...prev,
                entries: updatedEntries,
                currentIndex: newIndex >= 0 ? newIndex : prev.currentIndex,
            };
        });
    }, []);

    /**
     * Add an effect to the encounter.
     * If `effect.pokemonId` is set, the effect is attached to that Pokémon.
     * Otherwise it is treated as a global effect.
     */
    const addEffect = useCallback((effect: Omit<TurnEffect, 'id'>) => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            const newEffect: TurnEffect = { ...effect, id: crypto.randomUUID() };
            return { ...prev, effects: [...prev.effects, newEffect] };
        });
    }, []);

    /** Remove an effect by id. */
    const removeEffect = useCallback((effectId: string) => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            return { ...prev, effects: prev.effects.filter(e => e.id !== effectId) };
        });
    }, []);

    /** Add a pokemon to the active turn order (inserted in initiative order). */
    const addPokemonToTurnOrder = useCallback((pokemon: Pokemon) => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            if (prev.entries.some(e => e.pokemonId === pokemon.id)) return prev;
            const newEntry: TurnOrderEntry = {
                pokemonId: pokemon.id,
                baseInitiative: pokemon.speed + pokemon.level / 10,
                initiativeOverride: null,
            };
            const updatedEntries = [...prev.entries, newEntry]
                .sort((a, b) => getEffectiveInitiative(b) - getEffectiveInitiative(a));
            const currentPokemonId = prev.entries[prev.currentIndex]?.pokemonId;
            const newIndex = updatedEntries.findIndex(e => e.pokemonId === currentPokemonId);
            return {
                ...prev,
                entries: updatedEntries,
                currentIndex: newIndex >= 0 ? newIndex : prev.currentIndex,
            };
        });
    }, []);

    /** Remove a pokemon from the active turn order by id. */
    const removePokemonFromTurnOrder = useCallback((pokemonId: string) => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            const currentPokemonId = prev.entries[prev.currentIndex]?.pokemonId;
            const updatedEntries = prev.entries.filter(e => e.pokemonId !== pokemonId);
            if (updatedEntries.length === 0) return prev;
            let newIndex = updatedEntries.findIndex(e => e.pokemonId === currentPokemonId);
            if (newIndex < 0) {
                // Current pokemon was removed; stay at same index (clamped)
                newIndex = Math.min(prev.currentIndex, updatedEntries.length - 1);
            }
            return {
                ...prev,
                entries: updatedEntries,
                currentIndex: newIndex,
                effects: prev.effects.filter(e => e.pokemonId !== pokemonId),
            };
        });
    }, []);

    /**
     * Decrement remainingRounds for all non-persistent effects.
     * Effects that reach 0 are removed automatically.
     * Persistent effects (remainingRounds === -1) are untouched.
     * Call this at the end of each round.
     */
    const tickEffects = useCallback(() => {
        setTurnOrder(prev => {
            if (!prev) return prev;
            const updated = prev.effects
                .map(e => e.remainingRounds === -1 ? e : { ...e, remainingRounds: e.remainingRounds - 1 })
                .filter(e => e.remainingRounds !== 0);
            return { ...prev, effects: updated };
        });
    }, []);

    return {
        initTurnOrder,
        endTurnOrder,
        nextTurn,
        prevTurn,
        setInitiativeOverride,
        clearInitiativeOverride,
        addEffect,
        removeEffect,
        tickEffects,
        addPokemonToTurnOrder,
        removePokemonFromTurnOrder,
    };
}
