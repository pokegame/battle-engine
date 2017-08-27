import * as types from '../types';

export function hitPointChanged(pokemon: string, delta: number): types.BattleEvent {
  return {
    type: 'hitpoint_changed',
    payload: {
      pokemon, delta
    }
  };
}
