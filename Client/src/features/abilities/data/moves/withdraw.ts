import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const WITHDRAW_DATA: Ability = {
  name: "Withdraw",
  type: PokemonType.Water,
  accuracy: 95,
  damageType: "Status",
  damage: "Raises Defense and Special Defense by 1",
};

export const registration = {
  ability: WITHDRAW_DATA
};
