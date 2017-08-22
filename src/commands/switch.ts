import * as types from '../types';

export function switchCommand(actor: string, pokemonName: string): types.BattleCommand {
  return (battleState: types.BattleState) => {
    // @TODO
    actor; pokemonName;
    return battleState;
  };
}
