// import { Editor } from '@/components/editor/editor'
// import { Separator } from '@/components/ui/separator'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGameStore } from '@/hooks/use-game-connection'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  const store = useGameStore()
  useEffect(() => {
    store.connect('e4e233c4-a446-4bf6-9e96-475f1f5e46f7')
  }, [])
  return (
    <div className="@container/main relative flex-1 flex flex-col overflow-hidden"></div>
  )
}
