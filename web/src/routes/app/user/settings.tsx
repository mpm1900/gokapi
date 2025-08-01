import { authGuard } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/user/settings')({
  beforeLoad: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/user/settings"!</div>
}
