import type { Ability } from "../../abilities/types/Ability";
import type { DamageType } from "./DamageType";
import { GAME_CONSTANTS } from "../../../lib/constants";
import type { PokemonType } from "./Type";

export interface AbilityUnlock {
    ability: Ability;
    level: number;
}

export class Pokemon {
    private _id: string;
    private _pokedexEntry: number;
    private _pokemonName: string;
    private _name: string;
    private _level: number;
    private _type1: PokemonType;
    private _type2: PokemonType | null;
    private _hp: number;
    private _currentHp: number;
    private _attack: number;
    private _specialAttack: number;
    private _defense: number;
    private _specialDefense: number;
    private _speed: number;
    private _flaw: string;
    private _strength: string;
    private _abilities: Ability[];
    private _abilityUnlocks: AbilityUnlock[];
    private _isPlayerCharacter: boolean;

    constructor(
        pokedexEntry: number,
        pokemonName: string,
        type1: PokemonType,
        type2: PokemonType | null = null,
        {
            id = crypto.randomUUID(),
            name: name = "",
            level = 1,
            hp = 0,
            currentHp = 0,
            attack = 0,
            specialAttack = 0,
            defense = 0,
            specialDefense = 0,
            speed = 0,
            flaw = "",
            strength = "",
            abilities = [],
            isPlayerCharacter = false,
        }: {
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
            flaw?: string;
            strength?: string;
            abilities?: Ability[];
            isPlayerCharacter?: boolean;
        } = {}
    ) {
        this._id = id;
        this._pokedexEntry = pokedexEntry;
        this._pokemonName = pokemonName;
        this._type1 = type1;
        this._type2 = type2;
        this._name = name;
        this._level = level;
        this._hp = hp;
        this._currentHp = currentHp;
        this._attack = attack;
        this._specialAttack = specialAttack;
        this._defense = defense;
        this._specialDefense = specialDefense;
        this._speed = speed;
        this._flaw = flaw;
        this._strength = strength;
        this._abilities = abilities;
        this._abilityUnlocks = [];
        this._isPlayerCharacter = isPlayerCharacter;

        // If currentHp is 0 or was not explicitly set to a positive value, set it to maxHp
        if (this._currentHp === 0) {
            this._currentHp = this.maxHp;
        }
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get pokedexEntry(): number {
        return this._pokedexEntry;
    }

    get pokemonName(): string {
        return this._pokemonName;
    }

    get name(): string {
        return this._name;
    }

    get level(): number {
        return this._level;
    }

    get type1(): PokemonType {
        return this._type1;
    }

    get type2(): PokemonType | null {
        return this._type2;
    }

    get hp(): number {
        return this._hp;
    }

    get currentHp(): number {
        return this._currentHp;
    }

    get attack(): number {
        return this._attack;
    }

    get specialAttack(): number {
        return this._specialAttack;
    }

    get defense(): number {
        return this._defense;
    }

    get specialDefense(): number {
        return this._specialDefense;
    }

    get speed(): number {
        return this._speed;
    }

    get flaw(): string {
        return this._flaw;
    }

    get strength(): string {
        return this._strength;
    }

    get isPlayerCharacter(): boolean {
        return this._isPlayerCharacter;
    }

    get maxHp(): number {
        return this._hp + this._level * GAME_CONSTANTS.HP_PER_LEVEL;
    }

    get abilities(): Ability[] {
        return this._abilities;
    }

    get abilitiesAvailable(): Ability[] {
        // Get all unlocked abilities based on current level
        const unlockedAbilities = this._abilityUnlocks
            .filter(unlock => unlock.level <= this._level)
            .map(unlock => unlock.ability);
        
        // Combine unlocked abilities with manually added abilities
        // Remove duplicates by ability name
        const allAbilities = [...unlockedAbilities];
        this._abilities.forEach(ability => {
            if (!allAbilities.some(a => a.name === ability.name)) {
                allAbilities.push(ability);
            }
        });
        return allAbilities;
    }

    private damagePokemon(type: PokemonType, damageType: Exclude<DamageType, "Status">, damage: number): void {
        // Calculate type effectiveness modifier
        let typeModifier = 1;
        typeModifier *= type.getOffensiveModifier(this._type1);
        if (this._type2) {
            typeModifier *= type.getOffensiveModifier(this._type2);
        }
        if (typeModifier === 0) {
            // No effect, skip damage
            return;
        }

        // Apply type modifier to damage
        let finalDamage = damage * typeModifier;

        // Subtract defense based on damage type
        if (damageType === "Physical") {
            finalDamage = finalDamage - this._defense;
        } else if (damageType === "Special") {
            finalDamage = finalDamage - this._specialDefense;
        }

        // Ensure damage is not below 0
        finalDamage = Math.max(0, finalDamage);

        // Apply damage to current HP
        this._currentHp = Math.max(0, this._currentHp - finalDamage);
    }

    dealDirectDamage(type: PokemonType, damageType: Exclude<DamageType, "Status">, amount: number): void {
        this.damagePokemon(type, damageType, amount);
    }

    incrementLevel(): void {
        if (this._level >= GAME_CONSTANTS.MAX_LEVEL) return;

        this.setLevel(this._level + 1);
    }
    decrementLevel(): void {
        if (this._level <= GAME_CONSTANTS.MIN_LEVEL) return;

        this.setLevel(this._level - 1);
    }

    setLevel(level: number): void {
        const oldLevel = this._level;
        this._level = level;

        // Recalculate Current HP based on new max HP
        const levelDifference = level - oldLevel;
        this._currentHp += levelDifference * GAME_CONSTANTS.HP_PER_LEVEL;
    }
    setHp(hp: number): void {
        const oldHp = this._hp;
        this._hp = hp;

        const hpDifference = hp - oldHp;
        this._currentHp += hpDifference;
    }

    setAttack(attack: number): void {
        this._attack = attack;
    }

    setSpecialAttack(specialAttack: number): void {
        this._specialAttack = specialAttack;
    }

    setDefense(defense: number): void {
        this._defense = defense;
    }

    setSpecialDefense(specialDefense: number): void {
        this._specialDefense = specialDefense;
    }

    setSpeed(speed: number): void {
        this._speed = speed;
    }
    setIsPlayerCharacter(isPlayerCharacter: boolean): void {
        this._isPlayerCharacter = isPlayerCharacter;
    }


    addAbility(ability: Ability): void {
        this._abilities.push(ability);
    }

    removeAbility(abilityName: string): void {
        this._abilities = this._abilities.filter(ability => ability.name !== abilityName);
    }

    registerAbilityUnlock(ability: Ability, level: number): void {
        this._abilityUnlocks.push({ ability, level });
    }
}
