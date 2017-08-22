import { getMovedexEntry } from '../../src/dex/movedex';

describe('Movedex', () => {
  it('should return entry for valid move', () => {
    expect(getMovedexEntry('tackle')).toBeDefined();
  });

  it('should throw error for invalid move', () => {
    expect(() => getMovedexEntry('kamekameha')).toThrowError('Unidentified move: kamekameha');
  });
});
