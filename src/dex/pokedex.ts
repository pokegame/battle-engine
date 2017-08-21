import * as types from '../types';

const pokedex: {[species: string]: types.PokedexEntry} = {
  bulbasaur: {
    types: ['grass', 'poison'],
    baseStats: {hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45}
  },
  ivysaur: {
    types: ['grass', 'poison'],
    baseStats: {hp: 60, atk: 62, def: 63, spa: 80, spd: 80, spe: 60}
  },
  venusaur: {
    types: ['grass', 'poison'],
    baseStats: {hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80}
  },
  charmander: {
    types: ['fire'],
    baseStats: {hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65}
  },
  charmeleon: {
    types: ['fire'],
    baseStats: {hp: 58, atk: 64, def: 58, spa: 80, spd: 65, spe: 80}
  },
  charizard: {
    types: ['fire', 'flying'],
    baseStats: {hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100}
  },
  squirtle: {
    types: ['water'],
    baseStats: {hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43}
  },
  wartortle: {
    types: ['water'],
    baseStats: {hp: 59, atk: 63, def: 80, spa: 65, spd: 80, spe: 58}
  },
  blastoise: {
    types: ['water'],
    baseStats: {hp: 79, atk: 83, def: 100, spa: 85, spd: 105, spe: 78}
  }
};

export function getPokedexEntry(species: string): types.PokedexEntry {
  if (!(species in pokedex)) {
    throw new Error(`Unidentified species: ${species}`);
  }

  return pokedex[species];
}
