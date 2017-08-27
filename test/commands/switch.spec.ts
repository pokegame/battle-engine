import { switchCommand } from '../../src/commands';
import { pokemonSwitched } from '../../src/events';
import { createState } from '../../src/state';
import * as types from '../../src/types';

describe('switchCommand', () => {
  const actor = 'trainer';
  const switchFrom = 'pokemon-1';
  const switchTo = 'pokemon-2';

  let state: types.BattleState;
  beforeEach(() => {
    state = createState({
      name: actor,
      partyMembers: [
        {
          name: switchFrom,
          species: 'charmander',
          level: 8,
          gender: 'female',
          evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
          ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
          moves: ['tackle']
        },
        {
          name: switchTo,
          species: 'squirtle',
          level: 10,
          gender: 'male',
          evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
          ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
          moves: ['tackle']
        }
      ]
    }, {
      name: `${actor}-enemy`,
      partyMembers: [
        {
          name: 'pokemon-enemy-1',
          species: 'bulbasaur',
          level: 5,
          gender: 'male',
          evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
          ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
          moves: ['tackle']
        }
      ]
    });
  });

  it('should fails if pokemon is fainted', () => {
    state.pokemon[switchTo].hitPoint = 0;
    const command = switchCommand(actor, switchTo);
    expect(command(state)).toEqual(state);
  });

  it('should change battling pokemon', () => {
    const command = switchCommand(actor, switchTo);
    expect(state.battlers[actor]).toEqual(switchFrom);
    expect(command(state).battlers[actor]).toEqual(switchTo);
  });

  it('should add event when pokemon is switched', () => {
    const command = switchCommand(actor, switchTo);
    expect(command(state).events).toEqual([
      pokemonSwitched(switchFrom, switchTo)
    ]);
  });
});
