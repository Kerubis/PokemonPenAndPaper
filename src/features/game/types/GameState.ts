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
  isPlayerCharacter: boolean;
  abilities: SerializedAbility[];
}

export interface SerializedEncounter {
  guid: string;
  name: string;
  musicLink: string;
  pokemonGuids: string[];
  story?: string;
}

export interface GameState {
  guid: string;
  gameName: string;
  pokemon: SerializedPokemon[];
  encounters: SerializedEncounter[];
  createdAt: string;
  updatedAt: string;
}
