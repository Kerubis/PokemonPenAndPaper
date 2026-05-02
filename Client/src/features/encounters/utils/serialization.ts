import type { Encounter } from '../types/Encounter';
import { createEncounter } from '../types/encounterOps';
import type { SerializedEncounter } from '../../game/types/GameState';
import type { TurnOrder } from '../types/TurnOrder';

/**
 * Serialize an Encounter instance to a plain object for storage
 */
export function serializeEncounter(encounter: Encounter): SerializedEncounter {
    return {
        guid: encounter.guid,
        name: encounter.name,
        musicLinks: encounter.musicLinks,
        pokemonGuids: encounter.pokemonGuids,
        story: encounter.story,
        index: encounter.index,
        finished: encounter.finished,
        mapDrawing: encounter.mapDrawing,
        turnOrder: encounter.turnOrder ?? undefined,
    };
}

/**
 * Deserialize a plain object to an Encounter instance
 */
export function deserializeEncounter(data: SerializedEncounter): Encounter {
    // Backward compat: migrate legacy single musicLink to array
    let musicLinks = data.musicLinks ?? [];
    if (musicLinks.length === 0 && data.musicLink) {
        musicLinks = [{ url: data.musicLink, description: 'Battle Music' }];
    }
    return createEncounter({
        guid: data.guid,
        name: data.name,
        musicLinks,
        pokemonGuids: data.pokemonGuids,
        story: data.story ?? '',
        index: data.index ?? 0,
        finished: data.finished ?? false,
        mapDrawing: data.mapDrawing ?? '',
        turnOrder: (data.turnOrder as TurnOrder | undefined) ?? null,
    });
}
