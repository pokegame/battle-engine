import { isFainted } from '../projections';
import * as types from '../types';
import { DecisionError } from './decisionError';

/**
 * If the decision is valid with the current state, return a command with its priority.
 * If it isn't, throw a DecisionError.
 */
export function resolveDecision(battleState: types.BattleState, battleDecision: types.BattleDecision): types.TurnCommand {
  if (battleDecision.decision === 'attack') {
    // @TODO
    throw new Error('Must implement it.');
  }

  if (battleDecision.decision === 'switch') {
    if (!battleState.parties[battleDecision.actor].includes(battleDecision.pokemon)) {
      throw new DecisionError('This pokémon is not in your party.');
    }

    if (battleState.battlers[battleDecision.actor] === battleDecision.pokemon) {
      throw new DecisionError('This pokémon is already battling.');
    }

    if (isFainted(battleState.pokemon[battleDecision.pokemon])) {
      throw new DecisionError('Cannot switch to a fainted pokémon.');
    }

    // @TODO
    throw new Error('Must implement it.');
  }

  throw new DecisionError('Invalid decision.');
}
