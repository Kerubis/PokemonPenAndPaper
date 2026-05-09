import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const SLEEP_POWDER_DATA: Ability = {
  name: "Sleep Powder",
  type: PokemonType.Grass,
  accuracy: 60,
  damageType: "Status",
  damage: "Inflicts Sleep",
};

export const registration = {
  ability: SLEEP_POWDER_DATA
};
