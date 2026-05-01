export class PokemonType {
  readonly name: string;
  readonly color: string;
  readonly noEffect: readonly string[];
  readonly notVeryEffective: readonly string[];
  readonly superEffective: readonly string[];

  private constructor(
    name: string,
    color: string,
    noEffect: readonly string[] = [],
    notVeryEffective: readonly string[] = [],
    superEffective: readonly string[] = [],
  ) {
    this.name = name;
    this.color = color;
    this.noEffect = noEffect;
    this.notVeryEffective = notVeryEffective;
    this.superEffective = superEffective;
  }

  /**
   * Calculate offensive damage modifier against a defending type
   * @param defendingType - The defending type name or PokemonType instance
   * @returns Damage multiplier (0 = no effect, 0.5 = not very effective, 1 = normal, 2 = super effective)
   */
  getOffensiveModifier(defendingType: string | PokemonType): number {
    const typeName = typeof defendingType === 'string' ? defendingType : defendingType.name;
    
    if (this.noEffect.includes(typeName)) {
      return 0;
    }
    if (this.notVeryEffective.includes(typeName)) {
      return 0.5;
    }
    if (this.superEffective.includes(typeName)) {
      return 2;
    }
    return 1;
  }

  /**
   * Calculate defensive damage modifier when attacked by an attacking type
   * @param attackingType - The attacking type name or PokemonType instance
   * @returns Damage multiplier (0 = immune, 0.5 = resists, 1 = normal, 2 = weak)
   */
  getDefensiveModifier(attackingType: PokemonType): number {
    const typeName = typeof attackingType === 'string' ? attackingType : attackingType.name;
    
    if (attackingType.noEffect.includes(typeName)) {
      return 0;
    }
    if (attackingType.notVeryEffective.includes(typeName)) {
      return 0.5;
    }
    if (attackingType.superEffective.includes(typeName)) {
      return 2;
    }
    return 1;
  }

  // Static type instances - immutable and accessible via PokemonType.Grass, etc.
  static readonly Normal = new PokemonType(
    "Normal",
    "#aa9",
    ["Ghost"],
    ["Rock", "Steel"],
    [],
  );

  static readonly Fire = new PokemonType(
    "Fire",
    "#f42",
    [],
    ["Fire", "Water", "Rock", "Dragon"],
    ["Grass", "Ice", "Bug", "Steel"],
  );

  static readonly Water = new PokemonType(
    "Water",
    "#39f",
    [],
    ["Water", "Grass", "Dragon"],
    ["Fire", "Ground", "Rock"],
  );

  static readonly Electric = new PokemonType(
    "Electric",
    "#fc3",
    ["Ground"],
    ["Electric", "Grass", "Dragon"],
    ["Water", "Flying"],
  );

  static readonly Grass = new PokemonType(
    "Grass",
    "#7c5",
    [],
    ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"],
    ["Water", "Ground", "Rock"],
  );

  static readonly Ice = new PokemonType(
    "Ice",
    "#6cf",
    [],
    ["Fire", "Water", "Ice", "Steel"],
    ["Grass", "Ground", "Flying", "Dragon"],
  );

  static readonly Fighting = new PokemonType(
    "Fighting",
    "#b54",
    ["Ghost"],
    ["Poison", "Flying", "Psychic", "Bug", "Fairy"],
    ["Normal", "Ice", "Rock", "Dark", "Steel"],
  );

  static readonly Poison = new PokemonType(
    "Poison",
    "#a59",
    ["Steel"],
    ["Poison", "Ground", "Rock", "Ghost"],
    ["Grass", "Fairy"],
  );

  static readonly Ground = new PokemonType(
    "Ground",
    "#db5",
    ["Flying"],
    ["Grass", "Bug"],
    ["Fire", "Electric", "Poison", "Rock", "Steel"],
  );

  static readonly Flying = new PokemonType(
    "Flying",
    "#89f",
    [],
    ["Electric", "Rock", "Steel"],
    ["Grass", "Fighting", "Bug"],
  );

  static readonly Psychic = new PokemonType(
    "Psychic",
    "#f59",
    ["Dark"],
    ["Psychic", "Steel"],
    ["Fighting", "Poison"],
  );

  static readonly Bug = new PokemonType(
    "Bug",
    "#ab2",
    [],
    ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"],
    ["Grass", "Psychic", "Dark"],
  );

  static readonly Rock = new PokemonType(
    "Rock",
    "#ba6",
    [],
    ["Fighting", "Ground", "Steel"],
    ["Fire", "Ice", "Flying", "Bug"],
  );

  static readonly Ghost = new PokemonType(
    "Ghost",
    "#66b",
    ["Normal"],
    ["Dark"],
    ["Psychic", "Ghost"],
  );

  static readonly Dragon = new PokemonType(
    "Dragon",
    "#76e",
    ["Fairy"],
    ["Steel"],
    ["Dragon"],
  );

  static readonly Dark = new PokemonType(
    "Dark",
    "#754",
    [],
    ["Fighting", "Dark", "Fairy"],
    ["Psychic", "Ghost"],
  );

  static readonly Steel = new PokemonType(
    "Steel",
    "#aab",
    [],
    ["Fire", "Water", "Electric", "Steel"],
    ["Ice", "Rock", "Fairy"],
  );

  static readonly Fairy = new PokemonType(
    "Fairy",
    "#e9e",
    [],
    ["Fire", "Poison", "Steel"],
    ["Fighting", "Dragon", "Dark"],
  );
}