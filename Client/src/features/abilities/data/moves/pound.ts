import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const POUND_DATA: Ability = {
  name: "Pound",
  type: PokemonType.Normal,
  accuracy: 70,
  damageType: "Physical",
  damage: "1d4",
};

export const registration = {
  ability: POUND_DATA
};
