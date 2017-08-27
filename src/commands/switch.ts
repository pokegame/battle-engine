import { pokemonSwitched } from '../events';
import { isFainted } from '../projections';
import * as types from '../types';

export function switchCommand(actor: string, pokemonName: string): types.BattleCommand {
  return (battleState: types.BattleState) => {
    // Cannot switch to a fainted Pokémon.
    if (isFainted(battleState.pokemon[pokemonName])) {
      return battleState;
    }

    const event = pokemonSwitched(battleState.battlers[actor], pokemonName);

    return {
      ...battleState,
      battlers: {
        ...battleState.battlers,
        [actor]: pokemonName
      },
      events: battleState.events.concat(event)
    };
  };
}
