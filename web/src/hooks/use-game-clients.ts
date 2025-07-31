import type { GameClient } from '@/types/game'
import { createStore } from 'zustand'

export type GameClientsStore = {
  clients: GameClient[]
  set: (clients: GameClient[]) => void
}

export const createGameClientsStore = () =>
  createStore<GameClientsStore>((set) => {
    const clients: GameClient[] = []
    return {
      clients,
      set: (clients) => set({ clients }),
    }
  })
