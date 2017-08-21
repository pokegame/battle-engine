/**
 * Types are properties for Pokémon and their moves.
 * A Pokémon may have either one or two types.
 * A move has exactly one type.
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

/**
 * Immutable values of a given species.
 */
export interface PokedexEntry {
  types: Type[];
  // Base stats define the average strengths of a pokémon.
  baseStats: Stats;
}
