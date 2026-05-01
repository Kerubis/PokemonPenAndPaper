// Mirrors Client/src/features/game/types/GameState.ts
// Keep in sync when modifying the data model.

export interface SerializedAbility {
  name: string;
  type: string;
  accuracy: number;
  damageType: string;
  damage: string;
}

export interface SerializedPokemon {
  id: string;
  pokedexEntry: number;
  name: string;
  level: number;
  hp: number;
  currentHp: number;
  attack: number;
  specialAttack: number;
  defense: number;
  specialDefense: number;
  speed: number;
  walkSpeed: number;
  swimSpeed: number;
  climbSpeed: number;
  flySpeed: number;
  isPlayerCharacter: boolean;
  abilities: SerializedAbility[];
  index: number;
}

export interface SerializedMusicLink {
  url: string;
  description: string;
}

export interface SerializedTurnOrderEntry {
  pokemonId: string;
  baseInitiative: number;
  initiativeOverride: number | null;
}

export interface SerializedTurnEffect {
  id: string;
  name: string;
  description?: string;
  remainingRounds: number;
  pokemonId?: string;
}

export interface SerializedTurnOrder {
  entries: SerializedTurnOrderEntry[];
  currentRound: number;
  currentIndex: number;
  effects: SerializedTurnEffect[];
}

export interface SerializedEncounter {
  guid: string;
  name: string;
  musicLink?: string;
  musicLinks?: SerializedMusicLink[];
  pokemonGuids: string[];
  story?: string;
  index: number;
  finished: boolean;
  mapDrawing?: string;
  turnOrder?: SerializedTurnOrder;
}

export interface GameState {
  guid: string;
  gameName: string;
  pokemon: SerializedPokemon[];
  encounters: SerializedEncounter[];
  createdAt: string;
  updatedAt: string;
}
