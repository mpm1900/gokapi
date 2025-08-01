import type { GameAction, GameMessage } from '@/types/game'
import { createStore } from 'zustand'

type MessageType = GameMessage['type']
export type MessageHandler = (message: GameMessage) => void
export type MessageHandlers = Map<MessageType, Set<MessageHandler>>

export type GameConnectOptions = {
  onConnect?: (
    conn: GameConnectionStore,
    reconnectOptions: GameConnectOptions,
  ) => void
  onDisconnect?: (reconnectOptions: GameConnectOptions) => void
  onError?: (evt: Event) => void
}

export type GameConnectionStore = {
  conn: WebSocket | null
  connected: boolean
  connect: (instanceID: string, opts: GameConnectOptions) => void
  disconnect: () => void
  eventEmitter: MessageHandlers
  on: (messageType: MessageType, handler: MessageHandler) => () => void
  off: (messageType: MessageType, handler: MessageHandler) => void
  send: (action: GameAction) => void
}

export const createGameConnectionStore = () =>
  createStore<GameConnectionStore>((set, get) => {
    function emit(msg: GameMessage) {
      const { eventEmitter } = get()
      if (eventEmitter.has(msg.type)) {
        eventEmitter.get(msg.type)?.forEach((callback) => callback(msg))
      }
    }

    return {
      conn: null,
      connected: false,
      eventEmitter: new Map(),
      connect: (instanceID: string, opts) => {
        const old = get()
        if (old.conn) return opts.onConnect?.(old, opts)

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = window.location.host
        const path = `/games/${instanceID}/connect`
        const conn = new WebSocket(`${protocol}//${host}${path}`)
        set({ conn })

        conn.onopen = () => {
          set({ connected: true })
          opts.onConnect?.(get(), opts)
        }
        conn.onerror = (e) => {
          opts.onError?.(e)
        }
        conn.onmessage = (e) => {
          const msg: GameMessage = JSON.parse(e.data)
          emit(msg)
        }
        conn.onclose = () => {
          if (conn === get().conn) {
            opts.onDisconnect?.(opts)
            set({ connected: false })
          }
        }
      },
      disconnect: () => {
        const { conn, connected } = get()
        if (conn && connected) {
          conn.close(1000)
        }
      },
      on: (messageType, handler) => {
        const { eventEmitter } = get()
        if (!eventEmitter.has(messageType)) {
          eventEmitter.set(messageType, new Set())
        }
        eventEmitter.get(messageType)?.add(handler)
        return () => get().off(messageType, handler)
      },
      off: (messageType, handler) => {
        const { eventEmitter } = get()
        if (eventEmitter.has(messageType)) {
          eventEmitter.get(messageType)?.delete(handler)
          if (eventEmitter.get(messageType)?.size === 0) {
            eventEmitter.delete(messageType)
          }
        }
      },
      send: (action) => {
        const { conn } = get()
        if (conn) {
          conn.send(JSON.stringify(action))
        }
      },
    }
  })
