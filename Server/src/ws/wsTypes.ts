// ============================================================
// WebSocket message types shared between server and client
// ============================================================

export type WsMessageType =
  | 'LIST_GAMES'
  | 'GAMES_LISTED'
  | 'LOAD_GAME'
  | 'GAME_LOADED'
  | 'SAVE_GAME'
  | 'GAME_SAVED'
  | 'GAME_UPDATE'
  | 'GAME_UPDATED'
  | 'UPDATE_ENCOUNTER_DRAWING'
  | 'ENCOUNTER_DRAWING_UPDATED'
  | 'PING'
  | 'PONG'
  | 'ERROR';

export interface WsMessage<T = unknown> {
  /** Correlation id – the server echoes back the same id when responding */
  id: string;
  type: WsMessageType;
  payload?: T;
}

// ---- GAME_UPDATE operation payload ----------------------------------------

import type {
  SerializedEncounter,
  SerializedMusicLink,
  SerializedPokemon,
  SerializedTurnOrder,
} from '../types/GameState';

export type GameUpdatePayload =
  | { gameGuid: string; op: 'set_game_name';            gameName: string }
  | { gameGuid: string; op: 'upsert_encounter';         encounter: SerializedEncounter }
  | { gameGuid: string; op: 'delete_encounter';         encounterGuid: string }
  | { gameGuid: string; op: 'set_encounter_name';       encounterGuid: string; name: string }
  | { gameGuid: string; op: 'set_encounter_finished';   encounterGuid: string; finished: boolean }
  | { gameGuid: string; op: 'set_encounter_story';      encounterGuid: string; story: string }
  | { gameGuid: string; op: 'set_encounter_index';      encounterGuid: string; index: number }
  | { gameGuid: string; op: 'set_encounter_music';      encounterGuid: string; links: SerializedMusicLink[] }
  | { gameGuid: string; op: 'set_encounter_pokemon';    encounterGuid: string; pokemonGuids: string[] }
  | { gameGuid: string; op: 'set_encounter_turn_order'; encounterGuid: string; turnOrder: SerializedTurnOrder | null }
  | { gameGuid: string; op: 'upsert_pokemon';           pokemon: SerializedPokemon }
  | { gameGuid: string; op: 'delete_pokemon';           pokemonId: string };

export interface WsErrorMessage {
  id: string;
  type: 'ERROR';
  message: string;
}
