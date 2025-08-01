import type { User } from './user'

export type GameClient = {
  id: string
  user: User
  role: 'HOST' | 'PLYAYER'
}

export type GameChatMessage = {
  from: string
  message: string
  timestamp: Date
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
  | {
      type: 'chat-message'
      chatMessage: GameChatMessage
    }

export type GameAction =
  | {
      type: 'INCREMENT'
    }
  | {
      type: 'CHAT_MESSAGE'
      chatMessage: GameChatMessage
    }
