import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const GROWL_DATA: Ability = {
  name: "Growl",
  type: PokemonType.Normal,
  accuracy: 70,
  damageType: "Status",
  damage: "Lowers Attack by 1",
};

export const registration = {
  ability: GROWL_DATA
};
