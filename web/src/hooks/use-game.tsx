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
import { createGameChatStore, type GameChatStore } from './use-game-chat'

type GameContext = {
  chat: StoreApi<GameChatStore> | null
  clients: StoreApi<GameClientsStore> | null
  connection: StoreApi<GameConnectionStore> | null
  state: StoreApi<GameStateStore> | null
}
const GameContext = createContext<GameContext>({
  chat: null,
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

export function useGameChat() {
  const ctx = useContext(GameContext)
  if (!ctx || !ctx.chat) {
    throw new Error('useGameStore must be used within a GameStoreProvider')
  }
  return useStore(ctx.chat)
}

export function GameProvider({ children }: PropsWithChildren) {
  const chatRef = useRef(createGameChatStore())
  const connectionRef = useRef(createGameConnectionStore())
  const stateRef = useRef(createGameStateStore())
  const clientsRef = useRef(createGameClientsStore())
  const value = {
    chat: chatRef.current,
    clients: clientsRef.current,
    connection: connectionRef.current,
    state: stateRef.current,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
