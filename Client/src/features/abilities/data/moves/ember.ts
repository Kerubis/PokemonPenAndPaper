import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const EMBER_DATA: Ability = {
  name: "Ember",
  type: PokemonType.Fire,
  accuracy: 70,
  damageType: "Special",
  damage: "1d6",
};

export const registration = {
  ability: EMBER_DATA
};
