import * as types from './types';

export function createController(): types.BattleController {
  const subscribers: types.DecisionProvider[] = [];

  function listen(sub: types.DecisionProvider) {
    subscribers.push(sub);

    return () => {
      const index = subscribers.indexOf(sub);
      if (index >= 0) {
        subscribers.splice(index, 1);
      }
    };
  }

  function emit(choices: types.BattleChoices, dispatch: types.Dispatcher) {
    subscribers.forEach((sub: types.DecisionProvider) => {
      sub(choices, dispatch);
    });
  }

  return {
    listen,
    emit
  };
}
