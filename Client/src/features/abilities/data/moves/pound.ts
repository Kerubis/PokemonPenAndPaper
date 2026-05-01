import { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const POUND_DATA = new Ability(
  "Pound",
  PokemonType.Normal,
  70,
  "Physical",
  "1d4"
);

export const registration = {
  ability: POUND_DATA
};
