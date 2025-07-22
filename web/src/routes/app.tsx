import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>header</div>
      <div>
        <div>sidebar</div>
        <Outlet />
      </div>
    </div>
  )
}
