import { attackCommand, switchCommand } from '../commands';
import { decisionSpeed, isFainted } from '../projections';
import * as types from '../types';
import { DecisionError } from './decisionError';

/**
 * If the decision is valid with the current state, return a command with its priority.
 * If it isn't, throw a DecisionError.
 */
export function resolveDecision(battleState: types.BattleState, battleDecision: types.BattleDecision): types.TurnCommand {
  if (battleDecision.decision === 'attack') {
    // The battler Pokémon's name of this actor.
    const attackerName = battleState.battlers[battleDecision.actor];

    if (!(battleDecision.move in battleState.moves[attackerName])) {
      throw new DecisionError('This pokémon does not have this move.');
    }

    const move = battleState.moves[attackerName][battleDecision.move];

    if (move.isDisabled) {
      throw new DecisionError('Cannot use this move: is disabled.');
    }

    if (move.powerPoint <= 0) {
      throw new DecisionError('Cannot use this move: is out of power point.');
    }

    return {
      command: attackCommand(battleDecision.actor, attackerName, battleDecision.move),
      // The attacks with the highest priority go first.
      // If two Pokémon both use an attack with the same priority,
      // then the speed stat of each Pokémon comes into play.
      priorities: [8, move.dex.priority, decisionSpeed(battleState.pokemon[attackerName])]
    };
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

    return {
      command: switchCommand(battleDecision.actor, battleDecision.pokemon),
      priorities: [64]
    };
  }

  throw new DecisionError('Invalid decision.');
}
