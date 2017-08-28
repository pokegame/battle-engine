import { createController } from './controller';
import { isBattleEnded } from './projections';
import { turn } from './turn';
import * as types from './types';
import { timeout } from './utils';

function battleFactory(options: types.BattleOptions = {}) {
  const {
    // Default: 5min.
    decisionTimeout = 5 * 60 * 1000
  } = options;

  async function run(
    battleState: types.BattleState,
    onTurn: (battleState: types.BattleState, listener: types.Listener) => void
  ): Promise<void> {
    // Each turn has its own controller.
    const controller = createController();
    // Notify the client with this turn's state and the new controller.
    onTurn(battleState, controller.listen);

    // The battle is over!
    if (isBattleEnded(battleState)) {
      return;
    }

    // Notify the client with this turn's available choices.
    // Once the client provide its decision, the nextTick's Promise is resolved with it.
    const decisionProvider = (choices: types.BattleChoices, resolve: (response: types.DecisionResponse) => void): void => {
      const dispatcher: types.Dispatcher = (battleDecision: types.BattleDecision, emitError?: (errorMessage: string) => void) => {
        resolve({ battleDecision, emitError });
      };

      controller.emit(choices, dispatcher);
    };

    battleState = await nextTick(turn(battleState), decisionProvider);

    return run(battleState, onTurn);
  }

  async function nextTick(
    turn: IterableIterator<types.BattleState | types.BattleChoices>,
    decisionProvider: (choices: types.BattleChoices, resolve: (response: types.DecisionResponse) => void) => void,
    response?: types.DecisionResponse
  ): Promise<types.BattleState> {
    const tick = turn.next(response);

    if (tick.done) {
      return <types.BattleState>tick.value;
    }

    response = await timeout(
      new Promise<types.DecisionResponse>((resolve: (res: types.DecisionResponse) => void) => {
        return decisionProvider(<types.BattleChoices>tick.value, resolve);
      }),
      decisionTimeout,
      new Error('A timeout was reached while waiting for decision.')
    );

    return nextTick(turn, decisionProvider, response);
  }

  return {
    run
  };
}

export function createBattle(initState: types.BattleState, options: types.BattleOptions = {}) {
  const battle = battleFactory(options);

  const observable = (observer: {
    next(battleState: types.BattleState, listener: types.Listener): void,
    error(err: Error): void,
    complete(): void
  }) => {
    battle.run(initState, observer.next)
    .then(observer.complete)
    .catch(observer.error);
  };

  return {
    start: (
      next: (battleState: types.BattleState, listener: types.Listener) => void,
      error: (err: Error) => void,
      complete: () => void
    ) => {
      return observable({
        next,
        error,
        complete
      });
    }
  };
}
