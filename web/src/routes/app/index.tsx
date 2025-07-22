import { Button } from '@/components/ui/button'
import { useLogOut } from '@/hooks/mutations/use-logout'
import { useUser } from '@/hooks/use-user'
import { authGuard } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  loader: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  const user = useUser()
  const logOut = useLogOut()
  const navigate = Route.useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <div>Hello "/app/"! asdfasdf asdf {user?.email}</div>
      <Button
        onClick={() =>
          logOut.mutate(undefined, {
            onSuccess() {
              navigate({ to: '/login' })
            },
          })
        }
      >
        Log Out
      </Button>
    </div>
  )
}
