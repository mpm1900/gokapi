import { AppSidebar } from '@/components/app-sidebar'
import { PageLayout } from '@/components/page-layout'
import { authGuard } from '@/lib/auth'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/user')({
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
