import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const FLAME_CHARGE_DATA: Ability = {
  name: "Flame Charge",
  type: PokemonType.Fire,
  accuracy: 90,
  damageType: "Physical",
  damage: "1d6, raises Speed by 1",
};

export const registration = {
  ability: FLAME_CHARGE_DATA
};
