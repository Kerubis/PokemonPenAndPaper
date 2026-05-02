import type { Ability } from "../../abilities/types/Ability";
import type { PokemonType } from "./Type";

export interface AbilityUnlock {
    ability: Ability;
    level: number;
}

export interface Pokemon {
    readonly id: string;
    readonly pokedexEntry: number;
    readonly pokemonName: string;
    readonly name: string;
    readonly level: number;
    readonly type1: PokemonType;
    readonly type2: PokemonType | null;
    readonly hp: number;
    readonly currentHp: number;
    readonly attack: number;
    readonly specialAttack: number;
    readonly defense: number;
    readonly specialDefense: number;
    readonly speed: number;
    readonly walkSpeed: number;
    readonly swimSpeed: number;
    readonly climbSpeed: number;
    readonly flySpeed: number;
    readonly flaw: string;
    readonly strength: string;
    readonly abilities: readonly Ability[];
    readonly abilityUnlocks: readonly AbilityUnlock[];
    readonly isPlayerCharacter: boolean;
    readonly index: number;
}

