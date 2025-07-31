import { GameManager } from '@/components/game/game-manager'
import { GameSidebar } from '@/components/game/game-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { GameProvider } from '@/hooks/use-game'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$gameID')({
  component: RouteComponent,
})

function RouteComponent() {
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
    </GameProvider>
  )
}
