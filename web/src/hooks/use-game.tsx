import { useStore, type StoreApi } from 'zustand'
import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from 'react'

import {
  createGameConnectionStore,
  type GameConnectionStore,
} from './use-game-connection'
import { createGameStateStore, type GameStateStore } from './use-game-state'
import {
  createGameClientsStore,
  type GameClientsStore,
} from './use-game-clients'

type GameContext = {
  clients: StoreApi<GameClientsStore> | null
  connection: StoreApi<GameConnectionStore> | null
  state: StoreApi<GameStateStore> | null
}
const GameContext = createContext<GameContext>({
  clients: null,
  connection: null,
  state: null,
})

export function useGameConnection() {
  const ctx = useContext(GameContext)
  if (!ctx || !ctx.connection) {
    throw new Error('useGameStore must be used within a GameStoreProvider')
  }
  return useStore(ctx.connection)
}

export function useGameState() {
  const ctx = useContext(GameContext)
  if (!ctx || !ctx.state) {
    throw new Error('useGameStore must be used within a GameStoreProvider')
  }
  return useStore(ctx.state)
}

export function useGameClients() {
  const ctx = useContext(GameContext)
  if (!ctx || !ctx.clients) {
    throw new Error('useGameStore must be used within a GameStoreProvider')
  }
  return useStore(ctx.clients)
}

export function GameProvider({ children }: PropsWithChildren) {
  const connectionRef = useRef(createGameConnectionStore())
  const stateRef = useRef(createGameStateStore())
  const clientsRef = useRef(createGameClientsStore())
  const value = {
    clients: clientsRef.current,
    connection: connectionRef.current,
    state: stateRef.current,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
