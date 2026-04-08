import { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const TAIL_WHIP_DATA = new Ability(
  "Tail Whip",
  PokemonType.Normal,
  90,
  "Status",
  "Lowers Defense by 1"
);

export const registration = {
  ability: TAIL_WHIP_DATA
};
