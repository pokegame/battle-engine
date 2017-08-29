import { hitPointChanged, moveHit, moveMissed } from '../events';
import { isFainted } from '../projections';
import * as types from '../types';
import { chance } from '../utils';

/**
 * @param actor The actor who executes the command.
 * @param attackerName The name of the Pokémon that uses the move.
 * @param moveName The name of the move that the Pokémon want use.
 */
export function attackCommand(actor: string, attackerName: string, moveName: string): types.BattleCommand {
  // @TODO: This is still a WIP.
  return (battleState: types.BattleState) => {
    // The actor's opponent.
    const enemyActor = <string>battleState.actors.find((enemy: string) => enemy !== actor);
    // The target's name.
    const defenderName = battleState.battlers[enemyActor];

    // Only battling Pokémon can attack.
    if (battleState.battlers[actor] !== attackerName) {
      return battleState;
    }

    const attacker = battleState.pokemon[attackerName];
    const defender = battleState.pokemon[defenderName];
    const move = battleState.moves[attackerName][moveName];

    // Only non-fainted Pokémon can attack.
    if (isFainted(attacker)) {
      return battleState;
    }

    // Deduct power point of the attacker's move.
    battleState = {
      ...battleState,
      moves: {
        ...battleState.moves,
        [attackerName]: {
          ...battleState.moves[attackerName],
          [moveName]: {
            ...battleState.moves[attackerName][moveName],
            powerPoint: move.powerPoint - 1
          }
        }
      }
    };

    if (move.dex.category === 'status') {
      throw new Error(`${moveName} cannot be used yet.`);
    }

    const probability = move.dex.accuracy * (attacker.inBattleStats.accuracy / defender.inBattleStats.evasion);

    // The move missed.
    if (!chance(probability)) {
      const event = moveMissed(moveName, attackerName, defenderName);

      return {
        ...battleState,
        events: battleState.events.concat(event)
      };
    }

    const baseDamage = Math.floor(
      Math.floor(
        Math.floor(2 * attacker.level / 5 + 2) * move.dex.power *
        (
          move.dex.category === 'physical' ?
          attacker.stats.attack / defender.stats.defense :
          attacker.stats.specialAttack / defender.stats.specialDefense
        )
      ) / 50
    ) + 2;

    const delta = - (baseDamage > defender.hitPoint ? defender.hitPoint : baseDamage);
    const currentHp = defender.hitPoint + delta;

    const events = [
      moveHit(moveName, attackerName, defenderName),
      hitPointChanged(defenderName, delta)
    ];

    return {
      ...battleState,
      pokemon: {
        ...battleState.pokemon,
        [defenderName]: {
          ...battleState.pokemon[defenderName],
          hitPoint: currentHp
        }
      },
      events: battleState.events.concat(...events)
    };
  };
}
