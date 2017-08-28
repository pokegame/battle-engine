import * as types from './types';

export function statistics(
  { level, ivs, evs }: types.Pokemon,
  { baseStats }: types.PokedexEntry
): types.Stats {
  const stats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

  /* tslint:disable:no-string-literal */
  stats['hp'] = Math.floor(
    Math.floor(
      2 * baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100
    ) * level / 100 + 10
  );
  /* tslint:enable:no-string-literal */

  ['atk', 'def', 'spa', 'spd', 'spe'].forEach((statName: 'atk' | 'def' | 'spa' | 'spd' | 'spe') => {
    stats[statName] = Math.floor(
      Math.floor(
        2 * baseStats[statName] + ivs[statName] + Math.floor(evs[statName] / 4)
      ) * level / 100 + 5
    );
  });

  return stats;
}
