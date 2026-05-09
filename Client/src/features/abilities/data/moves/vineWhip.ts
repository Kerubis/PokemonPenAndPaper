import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const VINE_WHIP_DATA: Ability = {
  name: "Vine Whip",
  type: PokemonType.Grass,
  accuracy: 70,
  damageType: "Physical",
  damage: "1d6",
};

export const registration = {
  ability: VINE_WHIP_DATA
};
