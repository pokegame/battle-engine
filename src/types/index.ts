/**
 * Types are properties for Pokémon and their moves.
 */
export type Type = 'normal'
  | 'fire'
  | 'fighting'
  | 'water'
  | 'flying'
  | 'grass'
  | 'poison'
  | 'electric'
  | 'ground'
  | 'psychic'
  | 'rock'
  | 'ice'
  | 'bug'
  | 'dragon'
  | 'ghost'
  | 'dark'
  | 'steel'
  | 'fairy'
;

/**
 *  Stats refer to the numerical values of each field in regards to individual Pokémon.
 */
export type Stats = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

export interface Pokemon {
  // Pokemon's identifier. Usually an UUID.
  name: string;
  // Types of Pokémon species.
  species: string;
  // Is a measurement of how strong a Pokémon currently is.
  level: number;
  // The Pokémon sex.
  gender: 'male' | 'female' | 'unknown';
  // Attributes which give bonuses to an individual Pokémon's stats.
  evs: Stats;
  // Are the Pokémon equivalent of genes.
  ivs: Stats;
  // List of move's name that the Pokémon is able to use.
  moves: string[]
}

/**
 * Immutable values of a given species.
 */
export interface PokedexEntry {
  // A Pokémon may have either one or two types.
  types: Type[];
  // Base stats define the average strengths of a Pokémon.
  baseStats: Stats;
}

/**
 * Immutable values of a given move.
 */
export interface MovedexEntry {
  // Determine how much damage they deal.
  power: number;
  // Determines how reliable they can hit their target.
  accuracy: number;
  // Any move with a higher priority than another will always be performed first.
  priority: number;
  // Number of times that move can be used.
  basePowerPoint: number;
  // A move has exactly one type.
  type: Type;
  // Determines the kind of damage it deals.
  category: 'physical' | 'special' | 'status';
}

/**
 * The trainer with its team of Pokémon.
 */
export interface Actor {
  // Actor's identifier. Usually an UUID.
  name: string;
  partyMembers: Pokemon[];
}

/**
 * Represents the Pokémon state in the battle.
 */
export interface BattlingPokemon extends Pokemon {
  dex: PokedexEntry;
  stats: {
    // Partly determines how much damage a Pokémon deals when using a physical move.
    attack: number;
    // Partly determines how much damage a Pokémon receives when it is hit with a physical move.
    defense: number;
    // Partly determines how much damage a Pokémon deals when using a special move.
    specialAttack: number;
    // Partly determines how much damage a Pokémon receives when it is hit with a special move.
    specialDefense: number;
    // Determines the order of Pokémon that can act in battle.
    speed: number;
  };
  inBattleStats: {
    // Determines its probability of avoiding other Pokémon's moves.
    // The initial value at the start of any battle is 100%.
    evasion: number;
    // Determines its probability of hitting another Pokémon.
    // The initial value at the start of any battle is 100%.
    accuracy: number;
  };
  // Determine how much damage a Pokémon can receive before fainting.
  maxHitPoint: number;
  // Current amount of hp.
  hitPoint: number;
}

/**
 * Represents the move state in the battle.
 */
export interface Move {
  dex: MovedexEntry;
  // Current amount of pp.
  powerPoint: number;
  // Determines if the pokémon can use the move.
  isDisabled: boolean;
}
