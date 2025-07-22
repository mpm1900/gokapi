import { AppSidebar } from '@/components/app-sidebar'
import { PageLayout } from '@/components/page-layout'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout sidebar={<AppSidebar variant="inset" />}>
      <Outlet />
    </PageLayout>
  )
}
