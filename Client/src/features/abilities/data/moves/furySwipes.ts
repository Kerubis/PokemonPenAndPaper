import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const FURY_SWIPES_DATA: Ability = {
  name: "Fury Swipes",
  type: PokemonType.Normal,
  accuracy: 95,
  damageType: "Physical",
  damage: "1d4, hits 2-5 times, accuracy is rolled separately for each hit, and reduced by 10% for each hit after the first",
};

export const registration = {
  ability: FURY_SWIPES_DATA
};
