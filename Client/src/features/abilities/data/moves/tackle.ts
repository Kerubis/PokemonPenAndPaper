import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const TACKLE_DATA: Ability = {
  name: "Tackle",
  type: PokemonType.Normal,
  accuracy: 70,
  damageType: "Physical",
  damage: "1d4",
};

export const registration = {
  ability: TACKLE_DATA
};
