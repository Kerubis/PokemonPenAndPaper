import type { PokemonType } from "../../pokemon/types/Type";
import type { DamageType } from "../../pokemon/types/DamageType";

export interface Ability {
  readonly name: string;
  readonly type: PokemonType;
  readonly accuracy: number;
  readonly damageType: DamageType;
  readonly damage: string;
}
