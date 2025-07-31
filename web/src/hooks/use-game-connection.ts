import { createStore, useStore } from 'zustand'

type GameStore = {
  conn: WebSocket | null
  connected: boolean
  connect: (instanceID: string) => WebSocket | null
}

export const gameStore = createStore<GameStore>((set, get) => {
  return {
    conn: null,
    connected: false,
    connect: (instanceID: string) => {
      if (get().conn) return get().conn

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      const path = `/games/${instanceID}/connect`

      const conn = new WebSocket(`${protocol}//${host}${path}`)
      conn.onopen = () => {
        console.log('connected')
        set({ connected: true })
      }
      conn.onerror = (e) => {
        console.log('error', e)
      }
      conn.onclose = () => {
        if (conn === get().conn) {
          set({ connected: false })
        }
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
