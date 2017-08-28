import { getPokedexEntry } from '../../src/dex/pokedex';

describe('Pokédex', () => {
  it('should return entry for valid species', () => {
    expect(getPokedexEntry('bulbasaur')).toBeDefined();
  });

  it('should throw error for invalid species', () => {
    expect(() => getPokedexEntry('agumon')).toThrowError('Unidentified species: agumon');
  });
});
