import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const SCRATCH_DATA: Ability = {
  name: "Scratch",
  type: PokemonType.Normal,
  accuracy: 70,
  damageType: "Physical",
  damage: "1d4",
};

export const registration = {
  ability: SCRATCH_DATA
};
