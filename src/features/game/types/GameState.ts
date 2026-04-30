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

export interface SerializedEncounter {
  guid: string;
  name: string;
  musicLink?: string; // legacy, kept for backward compat
  musicLinks?: SerializedMusicLink[];
  pokemonGuids: string[];
  story?: string;
  index: number;
  finished: boolean;
}

export interface GameState {
  guid: string;
  gameName: string;
  pokemon: SerializedPokemon[];
  encounters: SerializedEncounter[];
  createdAt: string;
  updatedAt: string;
}
