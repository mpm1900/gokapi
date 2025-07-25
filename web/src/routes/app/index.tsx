import { useUser } from '@/hooks/use-user'
import { authGuard } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  loader: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  const user = useUser()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 h-[7000px]">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
