import {
  useGameChat,
  useGameClients,
  useGameConnection,
  useGameState,
} from '@/hooks/use-game'
import type { MessageHandler } from '@/hooks/use-game-connection'
import { getRouteApi } from '@tanstack/react-router'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

const route = getRouteApi('/game/$gameID')

export function GameManager() {
  const { gameID } = route.useParams()
  const connection = useGameConnection()
  const game = useGameState()
  const clients = useGameClients()
  const chat = useGameChat()
  const hasRenderedConnectToast = useRef(false)
  const hasRenderedDiconnectToast = useRef(false)

  useEffect(() => {
    connection.connect(gameID, {
      // @ts-ignore TODO reconnect
      onConnect: (store, opts) => {
        if (!hasRenderedConnectToast.current) {
          toast.success('Connected to game')
        }
        hasRenderedConnectToast.current = true
        hasRenderedDiconnectToast.current = false
      },
      onError: (evt) => {
        console.log('error', evt)
      },
      // @ts-ignore TODO reconnect
      onDisconnect: (opts) => {
        if (!hasRenderedDiconnectToast.current) {
          toast.error('Disconnected from game')
          hasRenderedDiconnectToast.current = true
          hasRenderedConnectToast.current = false
        }
      },
    })

    const stateHandler: MessageHandler = (msg) => {
      console.log('state', msg)
      if (msg.type === 'state') {
        game.set(msg.state)
      }
    }
    const clientsHandler: MessageHandler = (msg) => {
      console.log('clients', msg)
      if (msg.type === 'clients') {
        clients.set(msg.clients)
      }
    }
    const chatHandler: MessageHandler = (msg) => {
      console.log('chat', msg)
      if (msg.type === 'chat-message') {
        chat.add(msg.chatMessage)
      }
    }
    connection.on('state', stateHandler)
    connection.on('clients', clientsHandler)
    connection.on('chat-message', chatHandler)

    return () => {
      connection.disconnect()
      connection.off('state', stateHandler)
      connection.off('clients', clientsHandler)
      connection.off('chat-message', chatHandler)
    }
  }, [])

  return null
}
