import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const QUICK_ATTACK_DATA: Ability = {
  name: "Quick Attack",
  type: PokemonType.Normal,
  accuracy: 80,
  damageType: "Physical",
  damage: "1d4, always goes first",
};

export const registration = {
  ability: QUICK_ATTACK_DATA
};
