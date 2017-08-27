import * as types from '../types';

export function moveHit(move: string, user: string, target: string): types.BattleEvent {
  return {
    type: 'move_hit',
    payload: {
      move, user, target
    }
  };
}
