import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const WATER_PULSE_DATA: Ability = {
  name: "Water Pulse",
  type: PokemonType.Water,
  accuracy: 90,
  damageType: "Special",
  damage: "1d8, may cause Confusion",
};

export const registration = {
  ability: WATER_PULSE_DATA
};
