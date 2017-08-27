import * as types from '../types';

export function moveMissed(move: string, user: string, target: string): types.BattleEvent {
  return {
    type: 'move_missed',
    payload: {
      move, user, target
    }
  };
}
