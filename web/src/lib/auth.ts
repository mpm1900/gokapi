import { QUERY_KEYS } from '@/hooks/queries/keys'
import { authUserOptions } from '@/hooks/queries/use-auth-user'
import { userStore } from '@/hooks/use-user'
import type { QueryClient } from '@tanstack/react-query'

import { redirect } from '@tanstack/react-router'

type AuthGuardOptions = {
  onError?: () => void
  onSuccess?: () => void
}

export function authGuard({ onError, onSuccess }: AuthGuardOptions = {}) {
  return async function ({
    context,
  }: {
    context: { queryClient: QueryClient }
  }) {
    try {
      await checkAuth({ queryClient: context.queryClient })
      return onSuccess?.()
    } catch (error) {
      onError?.()
      throw logout({ queryClient: context.queryClient })
    }
  }
}

export async function checkAuth({ queryClient }: { queryClient: QueryClient }) {
  const data = await queryClient.ensureQueryData(authUserOptions())

  userStore.getState().set({
    id: data.id,
    email: data.email,
  })
}

export function logout({ queryClient }: { queryClient: QueryClient }) {
  queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTH_ME] })
  userStore.getState().clear()
  return redirect({ to: '/login' })
}
