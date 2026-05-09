import type { Ability } from "../../types/Ability";
import { PokemonType } from "../../../pokemon/types/Type";

export const BITE_DATA: Ability = {
  name: "Bite",
  type: PokemonType.Dark,
  accuracy: 80,
  damageType: "Physical",
  damage: "1d8, may cause Flinch",
};

export const registration = {
  ability: BITE_DATA
};
