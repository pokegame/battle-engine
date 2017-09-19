# Pokegame - Battle Engine

This library implements a reusable battle engine for the Pokémon game series. This project is in its early development phase: the Pokédex and the movesets are incomplete. Main features include single battles only.

## Installation

```
$ npm install @pokegame/battle-engine
```

## Usage

```
import {
  createBattle,
  createState,
  decisions
} from '@pokegame/battle-engine'

const players = {
  name: '1ae53ff4-0167-414c-a39a-5966509c03b5', // Trainer ID, usually a UUID
  partyMembers: [
    {
      name: '411fc0e8-148d-4714-8558-7ddbef2cd050', // Pokémon ID, usually a UUID
      species: 'charmander',
      level: 8,
      gender: 'female',
      evs: {hp: 74, atk: 190, def: 91, spa: 48, spd: 86, spe: 23},
      ivs: {hp: 24, atk: 12, def: 30, spa: 16, spd: 23, spe: 5},
      moves: ['tackle']
    },
    {
      name: 'f6bf22b1-946e-4ef6-9d78-f71c9f3639b2',
      species: 'squirtle',
      level: 10,
      gender: 'male',
      evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
      ivs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
      moves: ['tackle']
    }
  ]
}, {
  name: '9ac2cac0-3d14-4148-a6f8-c17cd61a405a',
  partyMembers: [
    {
      name: 'ebdf65bf-a17b-4074-8f93-1a55b3d0f725',
      species: 'bulbasaur',
      level: 5,
      gender: 'female',
      evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
      ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
      moves: ['tackle']
    }
  ]
}

createBattle(
  createState(players) // Create the initial battle state
).start(
  (battleState, listener) => {
    // You can access the current battle state here.
    console.log('Current battle state', battleState)

    listener((choices, dispatch) => {
      // You can get the available choices that each player can do here.
      console.log('Available choices', choices)

      // You can make a decision based on the available choices.
      dispatch(decisions.createAttackDecision(
        '411fc0e8-148d-4714-8558-7ddbef2cd050', 'tackle'
      ))
    })
  },
  (error) => {
    // If something unexpected happens, this callback will be invoked.
  },
  () => {
    // Once the battle is successfully completed, this callback will be invoked.
  }
)
```
