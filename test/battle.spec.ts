import { createBattle } from '../src/battle';
import * as decisions from '../src/decisions';
import { createState } from '../src/state';
import { choices } from '../src/turn/choices';
import * as types from '../src/types';

jest.useFakeTimers();

describe('battle', () => {
  const battle = createBattle(
    createState({
      name: 'trainer-1',
      partyMembers: [
        {
          name: 'pokemon-1-1',
          species: 'charmander',
          level: 8,
          gender: 'female',
          evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
          ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
          moves: ['tackle']
        },
        {
          name: 'pokemon-1-2',
          species: 'squirtle',
          level: 10,
          gender: 'male',
          evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
          ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
          moves: ['tackle']
        }
      ]
    }, {
      name: 'trainer-2',
      partyMembers: [
        {
          name: 'pokemon-2-1',
          species: 'bulbasaur',
          level: 5,
          gender: 'male',
          evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
          ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
          moves: ['tackle']
        }
      ]
    })
  );

  const noop = () => undefined;

  it('should receive choices', (done: jest.DoneCallback) => {
    battle.start((state: types.BattleState, listener: types.Listener) => {
      listener((battleChoices: types.BattleChoices, _: types.Dispatcher) => {
        expect(battleChoices).toEqual(choices(state));
        done();
      });
    }, noop, noop);
  });

  it('should have two-way communication by receiving choices and providing decisions', (done: jest.DoneCallback) => {
    let nTick = 0;
    battle.start((_: types.BattleState, listener: types.Listener) => {
      listener((choices: types.BattleChoices, dispatch: types.Dispatcher) => {
        switch (nTick) {
        case 0:
          dispatch(decisions.createAttackDecision('trainer-1', 'tackle'));
          // A promise can be resolve just one time: this is ignored.
          dispatch(decisions.createAttackDecision('trainer-2', 'tackle'));
          break;
        case 1:
          expect('trainer-1' in choices).toBe(false);
          expect('trainer-2' in choices).toBe(true);
          done();
          break;
        default:
          throw new Error('Should not reach this.');
        }

        nTick = nTick + 1;
      });
    }, noop, noop);
  });

  it('should change battle state only when new turn start', (done: jest.DoneCallback) => {
    const applyDecisions = [
      decisions.createAttackDecision('trainer-1', 'tackle'),
      decisions.createAttackDecision('trainer-2', 'tackle')
    ];

    let latestState: types.BattleState | undefined;
    battle.start((state: types.BattleState, listener: types.Listener) => {
      if (latestState !== undefined) {
        expect(state).not.toEqual(latestState);
        done();
      }

      listener((_: types.BattleChoices, dispatch: types.Dispatcher) => {
        const decision = applyDecisions.shift();
        if (decision !== undefined) {
          dispatch(decision);
        }
      });

      latestState = state;
    }, noop, noop);
  });

  it('should emit error when decision is not valid', (done: jest.DoneCallback) => {
    const applyDecisions = [
      decisions.createAttackDecision('wrong-trainer', 'tackle'),
      decisions.createAttackDecision('trainer-1', 'wrong-move'),
      decisions.createSwitchDecision('trainer-1', 'wrong-pokemon')
    ];

    battle.start((_: types.BattleState, listener: types.Listener) => {
      listener((__: types.BattleChoices, dispatch: types.Dispatcher) => {
        const decision = applyDecisions.shift();
        if (decision !== undefined) {
          dispatch(decision, (errorMessage: string) => {
            expect(errorMessage).toBeDefined();
          });
        } else {
          done();
        }
      });
    }, noop, noop);
  });

  it('should provide error when decision timeout', (done: jest.DoneCallback) => {
    battle.start(noop, (err: Error) => {
      expect(err.message).toBe('A timeout was reached while waiting for decision.');
      done();
    }, noop);

    jest.runOnlyPendingTimers();
  });
});
