export interface BattleOptions {
  // How much time the actor have to make his decision?
  decisionTimeout?: number;
}

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
  moves: string[];
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
  // Determines how much damage a Pokémon can receive before fainting.
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

/**
 * Battle state.
 */
export interface BattleState {
  // Actor's identifiers.
  actors: string[];
  // Map of every battling Pokémon.
  pokemon: {
    [name: string]: BattlingPokemon;
  };
  // Party members identifiers for each actor.
  parties: {
    [actor: string]: string[];
  };
  // Current Pokémon identifiers in battle for each actor.
  battlers: {
    [actor: string]: string;
  };
  // Every moves of every battling Pokèmon.
  moves: {
    [pokemon: string]: {
      [move: string]: Move;
    };
  };
}

/**
 * The available decisions that each actor can do within a turn.
 * If the actor isn't present, he can't make any decisions.
 */
export interface BattleChoices {
  [actor: string]: ('attack' | 'switch')[];
}

/**
 * Actor choose to attack with the specified move.
 */
export interface AttackDecision {
  decision: 'attack';
  actor: string;
  move: string;
}

/**
 * Actor choose to switch the current battling Pokémon with the specified Pokémon.
 */
export interface SwitchDecision {
  decision: 'switch';
  actor: string;
  pokemon: string;
}

/**
 * All the available decisions that an actor can make within a turn.
 */
export type BattleDecision = AttackDecision | SwitchDecision;

/**
 * The decision provided from the turn's client.
 * If decision isn't valid, it must be rejected and `emitError` must be invoked with the error message.
 */
export interface DecisionResponse {
  battleDecision: BattleDecision;
  emitError: ((errorMessage: string) => void) | undefined;
}

/**
 * Battle commands checks if the given command can be applied for the current state before returning a new one.
 */
export type BattleCommand = (battleState: BattleState) => BattleState;

/**
 * A command that must be executed in the turn after all the actors made their decisions.
 * They must be executed in order of priority.
 */
export interface TurnCommand {
  command: BattleCommand;
  priorities: number[];
}
