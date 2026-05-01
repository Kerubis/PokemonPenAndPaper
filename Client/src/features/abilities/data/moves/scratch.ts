import { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const SCRATCH_DATA = new Ability(
  "Scratch",
  PokemonType.Normal,
  70,
  "Physical",
  "1d4"
);

export const registration = {
  ability: SCRATCH_DATA
};
