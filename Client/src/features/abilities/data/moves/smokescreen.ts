import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const SMOKESCREEN_DATA: Ability = {
  name: "Smokescreen",
  type: PokemonType.Normal,
  accuracy: 95,
  damageType: "Status",
  damage: "Lowers Accuracy by 1",
};

export const registration = {
  ability: SMOKESCREEN_DATA
};
