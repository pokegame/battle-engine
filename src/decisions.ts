import * as types from './types';

export function createAttackDecision(actor: string, move: string): types.AttackDecision {
  return { decision: 'attack', actor, move };
}

export function createSwitchDecision(actor: string, pokemon: string): types.SwitchDecision {
  return { decision: 'switch', actor, pokemon };
}
