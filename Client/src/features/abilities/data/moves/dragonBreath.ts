import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const DRAGON_BREATH_DATA: Ability = {
  name: "Dragon Breath",
  type: PokemonType.Dragon,
  accuracy: 80,
  damageType: "Special",
  damage: "1d8, may cause Paralysis",
};

export const registration = {
  ability: DRAGON_BREATH_DATA
};
