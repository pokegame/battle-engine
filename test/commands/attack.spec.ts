import { attackCommand } from '../../src/commands';
import { hitPointChanged, moveHit, moveMissed } from '../../src/events';
import { createState } from '../../src/state';
import * as types from '../../src/types';
import * as utils from '../../src/utils';

describe('attackCommand', () => {
  const actor = 'trainer';
  const attacker = 'pokemon-1';
  const attackerPartyMember = 'pokemon-2';
  const defender = 'pokemon-enemy-1';
  const move = 'tackle';

  let state: types.BattleState;
  beforeEach(() => {
    state = createState({
      name: actor,
      partyMembers: [
        {
          name: attacker,
          species: 'charmander',
          level: 8,
          gender: 'female',
          evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
          ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
          moves: [move]
        },
        {
          name: attackerPartyMember,
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
          name: defender,
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

  it('should fails if attacker is fainted', () => {
    state.pokemon[attacker].hitPoint = 0;
    const command = attackCommand(actor, attacker, move);
    expect(command(state)).toEqual(state);
  });

  it('should fails if attacker is not battler pokemon', () => {
    const command = attackCommand(actor, attackerPartyMember, move);
    expect(command(state)).toEqual(state);
  });

  it('should decrease hit point when move hit', () => {
    const command = attackCommand(actor, attacker, move);
    expect(command(state).pokemon[defender].hitPoint).toBeLessThan(state.pokemon[defender].hitPoint);
  });

  it('should not decrease hit point when move does not hit', () => {
    spyOn(utils, 'chance').and.returnValue(false);
    const command = attackCommand(actor, attacker, move);
    expect(command(state).pokemon[defender].hitPoint).toBe(state.pokemon[defender].hitPoint);
  });

  it('should decrease move power point when move is used', () => {
    const command = attackCommand(actor, attacker, move);
    const originalPowerPoint = state.moves[attacker][move].powerPoint;
    const powerPointWhenMoveHit = command(state).moves[attacker][move].powerPoint;
    spyOn(utils, 'chance').and.returnValue(false);
    const powerPointWhenMoveMiss = command(state).moves[attacker][move].powerPoint;
    expect(originalPowerPoint - powerPointWhenMoveHit).toBe(1);
    expect(originalPowerPoint - powerPointWhenMoveMiss).toBe(1);
  });

  it('should add events when move hit', () => {
    const command = attackCommand(actor, attacker, move);
    const nextState = command(state);
    expect(nextState.events).toEqual([
      moveHit(move, attacker, defender),
      hitPointChanged(defender, state.pokemon[defender].hitPoint - nextState.pokemon[defender].hitPoint)
    ]);
  });

  it('should add event when move does not hit', () => {
    spyOn(utils, 'chance').and.returnValue(false);
    const command = attackCommand(actor, attacker, move);
    expect(command(state).events).toEqual([
      moveMissed(move, attacker, defender)
    ]);
  });
});
