import * as types from '../types';
import { choices } from './choices';
import { compareCommands } from './compareCommands';
import { DecisionError } from './decisionError';
import { resolveDecision } from './resolveDecision';

export function* turn(battleState: types.BattleState) {
  const commandQueue: types.TurnCommand[] = [];
  const pendingChoices = choices(battleState);

  while (Object.keys(pendingChoices).length !== 0) {
    // Inform the client about the required decisions that each actor must do.
    // Then wait until the client provide a response.
    // Thanks to BattleChoices the client know which actor must make their decision and who need to wait.
    const { battleDecision, emitError }: types.DecisionResponse = yield pendingChoices;

    try {
      if (!(battleDecision.actor in pendingChoices)) {
        throw new DecisionError('This actor cannot make decisions now.');
      }

      if (!pendingChoices[battleDecision.actor].includes(battleDecision.decision)) {
        throw new DecisionError('This actor is not allowed to make this decision.');
      }

      commandQueue.push(resolveDecision(battleState, battleDecision));

      // The actor's decision was valid, so remove it from the pending choices.
      delete pendingChoices[battleDecision.actor];
    } catch (error) {
      if (error instanceof DecisionError && typeof emitError === 'function') {
        emitError(error.message);
      }
    }
  }

  // Get all the commands ordered by priority.
  const battleCommands = commandQueue.sort(compareCommands).map((command: types.TurnCommand) => command.command);

  // Execute commands and return the new battle state
  return battleCommands.reduce((currentState: types.BattleState, battleCommand: types.BattleCommand) => {
    return battleCommand(currentState);
  }, battleState);
}
