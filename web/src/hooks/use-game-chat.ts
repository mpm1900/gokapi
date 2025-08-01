import type { GameChatMessage } from '@/types/game'
import { createStore } from 'zustand'

export type GameChatStore = {
  messages: GameChatMessage[]
  set: (messages: GameChatMessage[]) => void
  add: (message: GameChatMessage) => void
}

export const createGameChatStore = () =>
  createStore<GameChatStore>((set) => {
    return {
      messages: [],
      set: (messages) => set({ messages }),
      add: (message) => {
        set(({ messages }) => ({
          messages: [...messages, message],
        }))
      },
    }
  })
