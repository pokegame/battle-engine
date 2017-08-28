import { isBattleEnded } from '../../src/projections/isBattleEnded';
import { createState } from '../../src/state';
import * as types from '../../src/types';

describe('isBattleEnded', () => {
  let state: types.BattleState;
  beforeEach(() => {
    state = createState({
      name: 'trainer-123',
      partyMembers: [
        {
          name: 'pokemon-123-1',
          species: 'bulbasaur',
          level: 5,
          gender: 'male',
          evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
          ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
          moves: ['tackle']
        }
      ]
    }, {
      name: 'trainer-456',
      partyMembers: [
        {
          name: 'pokemon-456-1',
          species: 'charmander',
          level: 8,
          gender: 'female',
          evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
          ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
          moves: ['tackle']
        },
        {
          name: 'pokemon-456-2',
          species: 'squirtle',
          level: 10,
          gender: 'male',
          evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
          ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
          moves: ['tackle']
        }
      ]
    });
  });

  it('should return false when actors have at least one non-fainted pokemon', () => {
    expect(isBattleEnded(state)).toBe(false);
    state.pokemon['pokemon-456-1'].hitPoint = 0;
    expect(isBattleEnded(state)).toBe(false);
  });

  it('should return true when actors has no usable pokemon', () => {
    state.pokemon['pokemon-123-1'].hitPoint = 0;
    expect(isBattleEnded(state)).toBe(true);
    state.pokemon['pokemon-456-1'].hitPoint = 0;
    state.pokemon['pokemon-456-2'].hitPoint = 0;
    expect(isBattleEnded(state)).toBe(true);
  });
});
