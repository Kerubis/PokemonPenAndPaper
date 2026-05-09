import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const RAPID_SPIN_DATA: Ability = {
  name: "Rapid Spin",
  type: PokemonType.Normal,
  accuracy: 80,
  damageType: "Physical",
  damage: "1d6, removes entry hazards",
};

export const registration = {
  ability: RAPID_SPIN_DATA
};
