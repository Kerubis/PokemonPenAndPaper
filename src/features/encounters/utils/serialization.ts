import { Encounter } from '../types/Encounter';
import type { SerializedEncounter } from '../../game/types/GameState';

/**
 * Serialize an Encounter instance to a plain object for storage
 */
export function serializeEncounter(encounter: Encounter): SerializedEncounter {
    return {
        guid: encounter.guid,
        name: encounter.name,
        musicLink: encounter.musicLink,
        pokemonGuids: encounter.pokemonGuids,
        story: encounter.story,
        index: encounter.index,
        finished: encounter.finished,
    };
}

/**
 * Deserialize a plain object to an Encounter instance
 */
export function deserializeEncounter(data: SerializedEncounter): Encounter {
    return new Encounter({
        guid: data.guid,
        name: data.name,
        musicLink: data.musicLink,
        pokemonGuids: data.pokemonGuids,
        story: data.story ?? '',
        index: data.index ?? 0,
        finished: data.finished ?? false,
    });
}
