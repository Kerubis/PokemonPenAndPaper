import { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const GROWL_DATA = new Ability(
  "Growl",
  PokemonType.Normal,
  70,
  "Status",
  "Lowers Attack by 1"
);

export const registration = {
  ability: GROWL_DATA
};
