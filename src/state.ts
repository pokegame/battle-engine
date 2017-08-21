import { getMovedexEntry, getPokedexEntry } from './dex';
import { statistics } from './statistics';
import * as types from './types';
import { deepClone } from './utils';

const createBattlingPokemon = (partyMember: types.Pokemon): types.BattlingPokemon => {
  const pokedexEntry = getPokedexEntry(partyMember.species);
  const stats = statistics(partyMember, pokedexEntry);

  return Object.assign({}, deepClone(partyMember), {
    dex: deepClone(pokedexEntry),
    stats: {
      attack: stats.atk,
      defense: stats.def,
      specialAttack: stats.spa,
      specialDefense: stats.spd,
      speed: stats.spe
    },
    inBattleStats: {
      evasion: 100,
      accuracy: 100
    },
    maxHitPoint: stats.hp,
    hitPoint: stats.hp
  });
};

const createMove = (moveName: string): types.Move => {
  const movedexEntry = getMovedexEntry(moveName);

  return Object.assign({}, {
    dex: deepClone(movedexEntry),
    powerPoint: movedexEntry.basePowerPoint,
    isDisabled: false
  });
};

export function createState(...actors: types.Actor[]): types.BattleState {
  if (actors.length !== 2) {
    throw new Error('Only two actors are allowed in battle.');
  }

  if (new Set(actors.map((actor: types.Actor) => actor.name)).size !== actors.length) {
    throw new Error('Actors cannot share the same name.');
  }

  if (actors.filter((actor: types.Actor) => actor.partyMembers.length !== 0).length !== actors.length) {
    throw new Error('Actors must have at least a pokémon in their party.');
  }

  const everyPokemon = actors.map((actor: types.Actor) => actor.partyMembers)
    .reduce((p1: types.Pokemon[], p2: types.Pokemon[]) => p1.concat(p2), []);

  return {
    actors: actors.map((actor: types.Actor) => actor.name),
    pokemon: everyPokemon.reduce((pokemon: {[name: string]: types.BattlingPokemon}, partyMember: types.Pokemon) => ({
      ...pokemon,
      [partyMember.name]: createBattlingPokemon(partyMember)
    }), {}),
    parties: actors.reduce((parties: {[actor: string]: string[]}, actor: types.Actor) => ({
      ...parties,
      [actor.name]: actor.partyMembers.map((partyMember: types.Pokemon) => partyMember.name)
    }), {}),
    battlers: actors.reduce((battlers: {[actor: string]: string}, actor: types.Actor) => ({
      ...battlers,
      [actor.name]: actor.partyMembers[0].name
    }), {}),
    moves: everyPokemon.reduce((pokemon: {[pokemon: string]: {[move: string]: types.Move}}, partyMember: types.Pokemon) => ({
      ...pokemon,
      [partyMember.name]: partyMember.moves.reduce((moves: {[move: string]: types.Move}, moveName: string) => ({
        ...moves,
        [moveName]: createMove(moveName)
      }), {})
    }), {}),
    isRunning: true
  };
}
