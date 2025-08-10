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
  running: boolean
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
  | {
      type: 'UPGRADE_QUESTION'
    }

type BaseQuestion = {
  id: string
  prompt: string
  time: number
}

export type QuestionChoice = {
  id: string
  text: string
}

export type Question = BaseQuestion &
  (
    | {
        type: 'MULTIPLE_CHOICE'
        eval: QuestionChoice[] | ((choice: QuestionChoice) => boolean)
        choices: QuestionChoice[]
      }
    | {
        type: 'FREE_TEXT'
        eval?: (text: string) => boolean
      }
  )
