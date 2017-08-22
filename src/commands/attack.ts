import * as types from '../types';

/**
 * @param actor The actor who executes the command.
 * @param attackerName The name of the Pokémon that uses the move.
 * @param moveName The name of the move that the Pokémon want use.
 */
export function attackCommand(actor: string, attackerName: string, moveName: string): types.BattleCommand {
  return (battleState: types.BattleState) => {
    // The actor's opponent.
    const enemyActor = <string>battleState.actors.find((enemy: string) => enemy !== actor);
    // The target's name.
    const defenderName = battleState.battlers[enemyActor];

    const attacker = battleState.pokemon[attackerName];
    const defender = battleState.pokemon[defenderName];
    const move = battleState.moves[attackerName][moveName];

    // @TODO
    attacker; defender; move;
    return battleState;
  };
}
