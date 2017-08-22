import * as types from '../types';

/**
 * Used to sort TurnCommands by priority.
 */
export function compareCommands(c1: types.TurnCommand, c2: types.TurnCommand, index: number = 0): number {
  const p1 = index in c1.priorities ? c1.priorities[index] : 0;
  const p2 = index in c2.priorities ? c2.priorities[index] : 0;
  const result = p2 - p1;

  if (result === 0 && index < 3) {
    return compareCommands(c1, c2, index + 1);
  }

  return result;
}
