import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const WATER_GUN_DATA: Ability = {
  name: "Water Gun",
  type: PokemonType.Water,
  accuracy: 70,
  damageType: "Special",
  damage: "1d6",
};

export const registration = {
  ability: WATER_GUN_DATA
};
