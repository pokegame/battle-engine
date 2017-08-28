import * as types from '../types';

export function pokemonSwitched(from: string, to: string): types.BattleEvent {
  return {
    type: 'pokemon_switched',
    payload: {
      from, to
    }
  };
}
