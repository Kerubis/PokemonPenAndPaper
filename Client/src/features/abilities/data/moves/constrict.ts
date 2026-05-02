import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const CONSTRICT_DATA: Ability = {
  name: "Constrict",
  type: PokemonType.Normal,
  accuracy: 90,
  damageType: "Status",
  damage: "Lowers Speed by 1",
};

export const registration = {
  ability: CONSTRICT_DATA
};
