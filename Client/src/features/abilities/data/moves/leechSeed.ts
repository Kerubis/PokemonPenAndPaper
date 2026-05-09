import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const LEECH_SEED_DATA: Ability = {
  name: "Leech Seed",
  type: PokemonType.Grass,
  accuracy: 90,
  damageType: "Status",
  damage: "Drains 1/8 max HP from target each turn",
};

export const registration = {
  ability: LEECH_SEED_DATA
};
