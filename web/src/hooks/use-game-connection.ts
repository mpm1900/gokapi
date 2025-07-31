import { createStore, useStore } from 'zustand'

type GameStore = {
  conn: WebSocket | null
  connect: (instanceID: string) => WebSocket | null
}

export const gameStore = createStore<GameStore>((set, get) => {
  return {
    conn: null,
    connect: (instanceID: string) => {
      if (get().conn) return get().conn

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      const path = `/games/${instanceID}/connect`

      const conn = new WebSocket(`${protocol}//${host}${path}`)
      conn.onopen = () => {
        console.log('connected')
      }
      conn.onerror = (e) => {
        console.log('error', e)
      }

      console.log('connecting', conn)
      set({ conn })
      return conn
    },
  }
})

export function useGameStore() {
  return useStore(gameStore)
}
