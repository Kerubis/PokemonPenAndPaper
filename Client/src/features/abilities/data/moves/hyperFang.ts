import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const HYPER_FANG_DATA: Ability = {
  name: "Hyper Fang",
  type: PokemonType.Normal,
  accuracy: 80,
  damageType: "Physical",
  damage: "1d10, may cause Flinch",
};

export const registration = {
  ability: HYPER_FANG_DATA
};
