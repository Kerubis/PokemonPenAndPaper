import type { PokemonType } from "../../pokemon/types/Type";
import type { DamageType } from "../../pokemon/types/DamageType";

export class Ability {
  readonly name: string;
  readonly type: PokemonType;
  readonly accuracy: number;
  readonly damageType: DamageType;
  readonly damage: string;

  constructor(
    name: string,
    type: PokemonType,
    accuracy: number,
    damageType: DamageType,
    damage: string
  ) {
    this.name = name;
    this.type = type;
    this.accuracy = accuracy;
    this.damageType = damageType;
    this.damage = damage;
  }
}
