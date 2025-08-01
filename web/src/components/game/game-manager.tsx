import {
  useGameChat,
  useGameClients,
  useGameConnection,
  useGameState,
} from '@/hooks/use-game'
import type { MessageHandler } from '@/hooks/use-game-connection'
import { getRouteApi } from '@tanstack/react-router'

import { useEffect } from 'react'
import { Button } from '../ui/button'

const route = getRouteApi('/game/$gameID')

export function GameManager() {
  const { gameID } = route.useParams()
  const connection = useGameConnection()
  const state = useGameState()
  const clients = useGameClients()
  const chat = useGameChat()

  useEffect(() => {
    connection.connect(gameID, {
      onConnect: (store) => {
        console.log('connected', store)
      },
    })
    const stateHandler: MessageHandler = (msg) => {
      console.log('state', msg)
      if (msg.type === 'state') {
        state.set(msg.state)
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
      console.log('disconnecting')
      connection.disconnect()
      connection.off('state', stateHandler)
      connection.off('clients', clientsHandler)
      connection.off('chat-message', chatHandler)
    }
  }, [])

  return (
    <div>
      <div className="flex flex-rol items-center gap-2">
        {connection.connected ? (
          <div className="rounded-full size-2 bg-green-300" />
        ) : (
          <div className="rounded-full size-2 bg-green-300" />
        )}
        <div className="text-muted-foreground italic">{gameID}</div>
      </div>
      <div className="flex flex-col items-center gap-2 p-8">
        <div>State: {state.value}</div>
        <Button onClick={() => connection.send({ type: 'INCREMENT' })}>
          Increment
        </Button>
      </div>
    </div>
  )
}
