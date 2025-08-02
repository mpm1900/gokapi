import { createStore } from 'zustand'

import type { GameClient } from '@/types/game'

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
