import { GameManager } from '@/components/game/game-manager'
import { GameProvider } from '@/hooks/use-game'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$gameID')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GameProvider>
      <GameManager />
    </GameProvider>
  )
}
