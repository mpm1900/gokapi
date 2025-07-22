import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

const DEV_TOOLS_ENABLED = false

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      {DEV_TOOLS_ENABLED && (
        <>
          <TanStackRouterDevtools />
          <TanStackQueryLayout />
        </>
      )}
    </>
  ),
})
