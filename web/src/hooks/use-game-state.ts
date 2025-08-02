import { createStore } from 'zustand'

import type { GameState } from '@/types/game'

export type GameStateStore = {
  state: GameState | null
  set: (value: GameState) => void
}

export const createGameStateStore = () =>
  createStore<GameStateStore>((set) => {
    return {
      state: null,
      set: (state) => set({ state }),
    }
  })
