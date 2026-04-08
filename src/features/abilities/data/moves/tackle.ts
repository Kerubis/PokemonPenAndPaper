import { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const TACKLE_DATA = new Ability(
  "Tackle",
  PokemonType.Normal,
  70,
  "Physical",
  "1d4"
);

export const registration = {
  ability: TACKLE_DATA
};
