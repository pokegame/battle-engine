import { isFainted } from '../projections';
import * as types from '../types';

export function choices(battleState: types.BattleState): types.BattleChoices {
  // Returns a list of actors that need to switch pokémon.
  const switchTable = battleState.actors.reduce((table: string[], actor: string) => {
    const battler = battleState.battlers[actor];
    if (isFainted(battleState.pokemon[battler])) {
      return table.concat(actor);
    }

    return table;
  }, []);

  // When an actor need to switch pokémon, the other player must wait.
  const forceSwitch = switchTable.length > 0;

  return battleState.actors.reduce((choices: {}, actor: string) => {
    if (forceSwitch) {
      if (switchTable.includes(actor)) {
        return {
          ...choices,
          [actor]: ['switch']
        };
      }

      return choices;
    }

    return {
      ...choices,
      [actor]: ['switch', 'attack']
    };
  }, {});
}
