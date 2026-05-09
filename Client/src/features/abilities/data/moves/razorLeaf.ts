import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const RAZOR_LEAF_DATA: Ability = {
  name: "Razor Leaf",
  type: PokemonType.Grass,
  accuracy: 80,
  damageType: "Physical",
  damage: "1d8, high critical-hit ratio",
};

export const registration = {
  ability: RAZOR_LEAF_DATA
};
