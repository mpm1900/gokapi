import { GameManager } from '@/components/game/game-manager'
import { GameSidebar } from '@/components/game/game-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { GameProvider } from '@/hooks/use-game'
import { createFileRoute, useBlocker } from '@tanstack/react-router'
import { authGuard } from '@/lib/auth'
import { GameQuestion } from '@/components/game/game-question'
import type { Question } from '@/types/game'
import { GameState } from '@/components/game/game-state'
import { GameLeaveAlert } from '@/components/game/game-leave-alert'
import { GameHeader } from '@/components/game/game-header'

export const Route = createFileRoute('/game/$gameID')({
  beforeLoad: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  const { gameID } = Route.useParams()
  const { status, proceed, reset } = useBlocker({
    shouldBlockFn: ({ next }) => {
      if (next.routeId === '/login') return false
      return true
    },
    withResolver: true,
  })

  const question: Question = {
    id: '123',
    prompt: 'What is the answer to life, the universe, and everything?',
    time: 5000,
    type: 'MULTIPLE_CHOICE',
    eval: (choice) => choice.text === '42',
    choices: [
      {
        id: '0',
        text: '420',
      },
      {
        id: '1',
        text: '42',
      },
      {
        id: '2',
        text: '69',
      },
      {
        id: '3',
        text: '1337',
      },
    ],
  }

  return (
    <GameProvider>
      <GameManager />
      <SidebarProvider
        className="min-h-full"
        // @ts-ignore
        style={{ '--sidebar-width': '320px' }}
      >
        <SidebarInset className="rounded-xl p-4">
          <div className="flex flex-col items-center gap-4">
            <GameHeader gameID={gameID} />
            <GameQuestion question={question} />
            <GameState />
          </div>
        </SidebarInset>
        <GameSidebar />
      </SidebarProvider>

      <GameLeaveAlert
        open={status === 'blocked'}
        reset={reset}
        proceed={proceed}
      />
    </GameProvider>
  )
}
