import { authGuard } from '@/lib/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: authGuard({
    onSuccess: () => redirect({ to: '/app' }),
  }),
})
