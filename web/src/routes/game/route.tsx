import { AppSidebar } from '@/components/app-sidebar'
import { PageLayout } from '@/components/page-layout'
import { authGuard } from '@/lib/auth'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/game')({
  beforeLoad: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout sidebar={<AppSidebar variant="inset" />}>
      <Outlet />
    </PageLayout>
  )
}
