import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const GROWTH_DATA: Ability = {
  name: "Growth",
  type: PokemonType.Normal,
  accuracy: 95,
  damageType: "Status",
  damage: "Raises Attack and Sp. Atk by 1",
};

export const registration = {
  ability: GROWTH_DATA
};
