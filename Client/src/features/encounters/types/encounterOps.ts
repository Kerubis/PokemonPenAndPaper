/**
 * Pure functions for creating and updating Encounter data.
 *
 * All update functions return a new immutable Encounter object — they never
 * mutate the original.
 */

import type { Encounter, MusicLink } from "./Encounter";
import type { TurnOrder } from "./TurnOrder";

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export interface EncounterCreateOptions {
    guid?: string;
    name?: string;
    musicLinks?: MusicLink[];
    pokemonGuids?: string[];
    story?: string;
    index?: number;
    finished?: boolean;
    mapDrawing?: string;
    turnOrder?: TurnOrder | null;
}

export function createEncounter(opts: EncounterCreateOptions = {}): Encounter {
    return {
        guid: opts.guid ?? crypto.randomUUID(),
        name: opts.name ?? "",
        musicLinks: opts.musicLinks ?? [],
        pokemonGuids: opts.pokemonGuids ?? [],
        story: opts.story ?? "",
        index: opts.index ?? 0,
        finished: opts.finished ?? false,
        mapDrawing: opts.mapDrawing ?? "",
        turnOrder: opts.turnOrder ?? null,
    };
}

// ---------------------------------------------------------------------------
// Update functions
// ---------------------------------------------------------------------------

export function setEncounterName(e: Encounter, name: string): Encounter {
    return { ...e, name };
}

export function setEncounterFinished(e: Encounter, finished: boolean): Encounter {
    return { ...e, finished };
}

export function setEncounterStory(e: Encounter, story: string): Encounter {
    return { ...e, story };
}

export function setEncounterIndex(e: Encounter, index: number): Encounter {
    return { ...e, index };
}

export function setEncounterMapDrawing(e: Encounter, mapDrawing: string): Encounter {
    return { ...e, mapDrawing };
}

export function setEncounterTurnOrder(e: Encounter, turnOrder: TurnOrder | null): Encounter {
    return { ...e, turnOrder };
}

export function setEncounterMusicLinks(e: Encounter, musicLinks: MusicLink[]): Encounter {
    return { ...e, musicLinks };
}

export function addEncounterMusicLink(e: Encounter, link: MusicLink): Encounter {
    return { ...e, musicLinks: [...e.musicLinks, link] };
}

export function updateEncounterMusicLink(e: Encounter, index: number, link: MusicLink): Encounter {
    if (index < 0 || index >= e.musicLinks.length) return e;
    const updated = [...e.musicLinks];
    updated[index] = link;
    return { ...e, musicLinks: updated };
}

export function removeEncounterMusicLink(e: Encounter, index: number): Encounter {
    return { ...e, musicLinks: e.musicLinks.filter((_, i) => i !== index) };
}

export function addEncounterPokemon(e: Encounter, pokemonGuid: string): Encounter {
    if (e.pokemonGuids.includes(pokemonGuid)) return e;
    return { ...e, pokemonGuids: [...e.pokemonGuids, pokemonGuid] };
}

export function removeEncounterPokemon(e: Encounter, pokemonGuid: string): Encounter {
    return { ...e, pokemonGuids: e.pokemonGuids.filter(g => g !== pokemonGuid) };
}

export function clearEncounterPokemon(e: Encounter): Encounter {
    return { ...e, pokemonGuids: [] };
}

export function hasEncounterPokemon(e: Encounter, pokemonGuid: string): boolean {
    return e.pokemonGuids.includes(pokemonGuid);
}
