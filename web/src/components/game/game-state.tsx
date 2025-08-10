import { useGameConnection, useGameState } from '@/hooks/use-game'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

export function GameState() {
  const game = useGameState()
  const connection = useGameConnection()

  if (!game.state) {
    return (
      <div className="flex flex-col items-center gap-2 p-8">
        <Loader2 className="animate-spin" />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2 p-8">
      <div>Time: {30 - game.state.value}</div>
      <Button
        disabled={game.state.running}
        onClick={() => connection.send({ type: 'UPGRADE_QUESTION' })}
      >
        {game.state.running ? 'Running...' : 'Start 30s Timer'}
      </Button>
    </div>
  )
}
