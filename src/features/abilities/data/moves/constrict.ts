import { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const CONSTRICT_DATA = new Ability(
  "Constrict",
  PokemonType.Normal,
  90,
  "Status",
  "Lowers Speed by 1"
);

export const registration = {
  ability: CONSTRICT_DATA
};
