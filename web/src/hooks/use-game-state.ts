import type { GameState } from '@/types/game'
import { createStore } from 'zustand'

export type GameStateStore = GameState & {
  set: (value: GameState) => void
}

export const createGameStateStore = () =>
  createStore<GameStateStore>((set) => {
    return {
      value: 0,
      set: (value) => set(value),
    }
  })
