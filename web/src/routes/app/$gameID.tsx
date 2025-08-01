import { GameManager } from '@/components/game/game-manager'
import { GameSidebar } from '@/components/game/game-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { GameProvider } from '@/hooks/use-game'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { createFileRoute, useBlocker } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$gameID')({
  component: RouteComponent,
})

function RouteComponent() {
  const { status, proceed, reset } = useBlocker({
    shouldBlockFn: () => true,
    withResolver: true,
  })
  return (
    <GameProvider>
      <SidebarProvider
        className="min-h-full"
        // @ts-ignore
        style={{ '--sidebar-width': '320px' }}
      >
        <SidebarInset className="rounded-xl p-4">
          <GameManager />
        </SidebarInset>
        <GameSidebar />
      </SidebarProvider>
      <AlertDialog open={status === 'blocked'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to leave this game?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect you from the game and you will lose all
              previous chat messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={reset}>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={proceed}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GameProvider>
  )
}
