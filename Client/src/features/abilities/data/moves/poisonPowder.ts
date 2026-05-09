import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const POISON_POWDER_DATA: Ability = {
  name: "Poison Powder",
  type: PokemonType.Poison,
  accuracy: 60,
  damageType: "Status",
  damage: "Inflicts Poisoned",
};

export const registration = {
  ability: POISON_POWDER_DATA
};
