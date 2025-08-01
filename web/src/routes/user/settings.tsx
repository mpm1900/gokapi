import { authGuard } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/settings')({
  beforeLoad: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/settings"!</div>
}
