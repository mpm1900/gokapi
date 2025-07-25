import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/user/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/user/settings"!</div>
}
