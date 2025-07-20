import { createFileRoute, redirect } from '@tanstack/react-router'
import { authGuard } from '@/lib/auth'

export const Route = createFileRoute('/')({
  loader: authGuard({
    onSuccess: () => redirect({ to: '/app' }),
  }),
})
