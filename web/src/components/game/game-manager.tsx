import { useGameConnection, useGameState } from '@/hooks/use-game'
import type { MessageHandler } from '@/hooks/use-game-connection'
import { getRouteApi } from '@tanstack/react-router'

import { useEffect } from 'react'
import { Button } from '../ui/button'

const route = getRouteApi('/app/$gameID')

export function GameManager() {
  const { gameID } = route.useParams()
  const connection = useGameConnection()
  const state = useGameState()

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
    }
    connection.on('state', stateHandler)
    connection.on('clients', clientsHandler)

    return () => {
      console.log('disconnecting')
      connection.disconnect()
      connection.off('state', stateHandler)
      connection.off('clients', clientsHandler)
    }
  }, [])

  return (
    <div>
      <div>Game Manager: connected={String(connection.connected)}</div>
      <div>{connection.conn?.url}</div>
      <div>State: {state.value}</div>
      <Button onClick={() => connection.send({ type: 'INCREMENT' })}>
        Increment
      </Button>
    </div>
  )
}
