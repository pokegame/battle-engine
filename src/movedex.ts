import * as types from './types';

const movedex: {[moveName: string]: types.MovedexEntry} = {
  tackle: {
    power: 50,
    accuracy: 100,
    priority: 0,
    basePowerPoint: 35,
    type: 'normal',
    category: 'physical'
  }
};

export function getMovedexEntry(moveName: string): types.MovedexEntry {
  if (!(moveName in movedex)) {
    throw new Error(`Unidentified move: ${moveName}`);
  }

  return movedex[moveName];
}
