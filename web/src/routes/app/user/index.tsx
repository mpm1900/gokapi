import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/user/')({
  loader: () => redirect({ to: '/app/user/settings' }),
})
