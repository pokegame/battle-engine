import * as types from '../types';
import { isFainted } from './isFainted';

/**
 * If all Pokémon in one actor's party have fainted, the battle end.
 */
export function isBattleEnded(battleState: types.BattleState): boolean {
  return battleState.actors.find((actor: string) => {
    return battleState.parties[actor].find((pokemonName: string) => {
      return !isFainted(battleState.pokemon[pokemonName]);
    }) === undefined;
  }) !== undefined;
}
