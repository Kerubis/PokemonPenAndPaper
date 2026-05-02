/**
 * Pure functions for creating and updating Pokemon data.
 *
 * All update functions return a new immutable Pokemon object — they never
 * mutate the original.  Components should hold Pokemon values in React state
 * and replace the entry in the array with the returned value.
 */

import type { Ability } from "../../abilities/types/Ability";
import type { PokemonType } from "./Type";
import type { DamageType } from "./DamageType";
import type { Pokemon, AbilityUnlock } from "./Pokemon";
import { GAME_CONSTANTS } from "../../../lib/constants";

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export interface PokemonCreateOptions {
    id?: string;
    name?: string;
    level?: number;
    hp?: number;
    currentHp?: number;
    attack?: number;
    specialAttack?: number;
    defense?: number;
    specialDefense?: number;
    speed?: number;
    walkSpeed?: number;
    swimSpeed?: number;
    climbSpeed?: number;
    flySpeed?: number;
    flaw?: string;
    strength?: string;
    abilities?: Ability[];
    abilityUnlocks?: AbilityUnlock[];
    isPlayerCharacter?: boolean;
    index?: number;
}

export function createPokemon(
    pokedexEntry: number,
    pokemonName: string,
    type1: PokemonType,
    type2: PokemonType | null,
    opts: PokemonCreateOptions = {},
): Pokemon {
    const hp = opts.hp ?? 0;
    const level = opts.level ?? 1;
    const rawCurrentHp = opts.currentHp ?? 0;
    const maxHp = hp + level * GAME_CONSTANTS.HP_PER_LEVEL;

    return {
        id: opts.id ?? crypto.randomUUID(),
        pokedexEntry,
        pokemonName,
        name: opts.name ?? "",
        level,
        type1,
        type2,
        hp,
        currentHp: rawCurrentHp === 0 ? maxHp : rawCurrentHp,
        attack: opts.attack ?? 0,
        specialAttack: opts.specialAttack ?? 0,
        defense: opts.defense ?? 0,
        specialDefense: opts.specialDefense ?? 0,
        speed: opts.speed ?? 0,
        walkSpeed: opts.walkSpeed ?? 0,
        swimSpeed: opts.swimSpeed ?? 0,
        climbSpeed: opts.climbSpeed ?? 0,
        flySpeed: opts.flySpeed ?? 0,
        flaw: opts.flaw ?? "",
        strength: opts.strength ?? "",
        abilities: opts.abilities ?? [],
        abilityUnlocks: opts.abilityUnlocks ?? [],
        isPlayerCharacter: opts.isPlayerCharacter ?? false,
        index: opts.index ?? 0,
    };
}

// ---------------------------------------------------------------------------
// Computed getters (replaces class getter properties)
// ---------------------------------------------------------------------------

export function getMaxHp(p: Pokemon): number {
    return p.hp + p.level * GAME_CONSTANTS.HP_PER_LEVEL;
}

export function getTotalAllocatedStats(p: Pokemon): number {
    return p.hp + p.attack + p.specialAttack + p.defense + p.specialDefense + p.speed;
}

/** Returns all abilities available at the pokemon's current level, including manually added ones. */
export function getAbilitiesAvailable(p: Pokemon): readonly Ability[] {
    const unlocked = p.abilityUnlocks
        .filter(u => u.level <= p.level)
        .map(u => u.ability);

    const all = [...unlocked];
    for (const ability of p.abilities) {
        if (!all.some(a => a.name === ability.name)) {
            all.push(ability);
        }
    }
    return all;
}

// ---------------------------------------------------------------------------
// Level & stats
// ---------------------------------------------------------------------------

export function setLevel(p: Pokemon, level: number): Pokemon {
    const levelDifference = level - p.level;
    return {
        ...p,
        level,
        currentHp: p.currentHp + levelDifference * GAME_CONSTANTS.HP_PER_LEVEL,
    };
}

export function incrementLevel(p: Pokemon): Pokemon {
    if (p.level >= GAME_CONSTANTS.MAX_LEVEL) return p;
    return setLevel(p, p.level + 1);
}

export function decrementLevel(p: Pokemon): Pokemon {
    if (p.level <= GAME_CONSTANTS.MIN_LEVEL) return p;
    return setLevel(p, p.level - 1);
}

export function setHp(p: Pokemon, hp: number): Pokemon {
    const available = p.level - (getTotalAllocatedStats(p) - p.hp);
    const clamped = Math.min(hp, Math.max(0, available));
    const hpDifference = clamped - p.hp;
    return { ...p, hp: clamped, currentHp: p.currentHp + hpDifference };
}

export function setAttack(p: Pokemon, attack: number): Pokemon {
    const available = p.level - (getTotalAllocatedStats(p) - p.attack);
    return { ...p, attack: Math.min(attack, Math.max(0, available)) };
}

export function setSpecialAttack(p: Pokemon, specialAttack: number): Pokemon {
    const available = p.level - (getTotalAllocatedStats(p) - p.specialAttack);
    return { ...p, specialAttack: Math.min(specialAttack, Math.max(0, available)) };
}

export function setDefense(p: Pokemon, defense: number): Pokemon {
    const available = p.level - (getTotalAllocatedStats(p) - p.defense);
    return { ...p, defense: Math.min(defense, Math.max(0, available)) };
}

export function setSpecialDefense(p: Pokemon, specialDefense: number): Pokemon {
    const available = p.level - (getTotalAllocatedStats(p) - p.specialDefense);
    return { ...p, specialDefense: Math.min(specialDefense, Math.max(0, available)) };
}

export function setSpeed(p: Pokemon, speed: number): Pokemon {
    const available = p.level - (getTotalAllocatedStats(p) - p.speed);
    return { ...p, speed: Math.min(speed, Math.max(0, available)) };
}

// ---------------------------------------------------------------------------
// Movement speeds
// ---------------------------------------------------------------------------

export function setWalkSpeed(p: Pokemon, walkSpeed: number): Pokemon {
    return { ...p, walkSpeed: Math.max(0, walkSpeed) };
}

export function setSwimSpeed(p: Pokemon, swimSpeed: number): Pokemon {
    return { ...p, swimSpeed: Math.max(0, swimSpeed) };
}

export function setClimbSpeed(p: Pokemon, climbSpeed: number): Pokemon {
    return { ...p, climbSpeed: Math.max(0, climbSpeed) };
}

export function setFlySpeed(p: Pokemon, flySpeed: number): Pokemon {
    return { ...p, flySpeed: Math.max(0, flySpeed) };
}

// ---------------------------------------------------------------------------
// Identity & flags
// ---------------------------------------------------------------------------

export function setPokemonName(p: Pokemon, name: string): Pokemon {
    return { ...p, name };
}

export function setIsPlayerCharacter(p: Pokemon, isPlayerCharacter: boolean): Pokemon {
    return { ...p, isPlayerCharacter };
}

export function setIndex(p: Pokemon, index: number): Pokemon {
    return { ...p, index };
}

// ---------------------------------------------------------------------------
// Abilities
// ---------------------------------------------------------------------------

export function addAbility(p: Pokemon, ability: Ability): Pokemon {
    return { ...p, abilities: [...p.abilities, ability] };
}

export function removeAbility(p: Pokemon, abilityName: string): Pokemon {
    return { ...p, abilities: p.abilities.filter(a => a.name !== abilityName) };
}

export function registerAbilityUnlock(p: Pokemon, ability: Ability, level: number): Pokemon {
    return { ...p, abilityUnlocks: [...p.abilityUnlocks, { ability, level }] };
}

// ---------------------------------------------------------------------------
// Combat
// ---------------------------------------------------------------------------

export function dealDirectDamage(
    p: Pokemon,
    type: PokemonType,
    damageType: Exclude<DamageType, "Status">,
    amount: number,
): Pokemon {
    let typeModifier = type.getOffensiveModifier(p.type1);
    if (p.type2) typeModifier *= type.getOffensiveModifier(p.type2);
    if (typeModifier === 0) return p;

    let finalDamage = amount * typeModifier;
    if (damageType === "Physical") finalDamage -= p.defense;
    else if (damageType === "Special") finalDamage -= p.specialDefense;
    finalDamage = Math.max(0, finalDamage);

    return { ...p, currentHp: Math.max(0, p.currentHp - Math.ceil(finalDamage)) };
}

export function heal(p: Pokemon, amount: number): Pokemon {
    return { ...p, currentHp: Math.min(getMaxHp(p), p.currentHp + Math.floor(amount)) };
}
