import * as types from '../types';

export function decisionSpeed(battlingPokemon: types.BattlingPokemon): number {
  // @TODO: when paralized its Speed is reduced to 50% of its previous value.
  return battlingPokemon.stats.speed;
}
