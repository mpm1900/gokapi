import type { User } from './user'

export type GameClient = {
  id: string
  user: User
}

export type GameState = {
  value: number
}

export type GameMessage =
  | {
      type: 'state'
      state: GameState
    }
  | {
      type: 'clients'
      clients: GameClient[]
    }

export type GameAction = {
  type: 'INCREMENT'
}
