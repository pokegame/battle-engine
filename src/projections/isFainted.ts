import * as types from '../types';

/**
 * A battling pokémon is fainted when it has no hp.
 */
export function isFainted(battlingPokemon: types.BattlingPokemon): boolean {
  return battlingPokemon.hitPoint <= 0;
}
