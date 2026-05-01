import { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const EMBER_DATA = new Ability(
  "Ember",
  PokemonType.Fire,
  70,
  "Special",
  "1d6"
);

export const registration = {
  ability: EMBER_DATA
};
