import { QUERY_KEYS } from '@/hooks/queries/keys'
import { authUserOptions } from '@/hooks/queries/use-auth-user'
import { userStore } from '@/hooks/use-user'
import type { QueryClient } from '@tanstack/react-query'
import {
  redirect,
  type NavigateFn,
  type ParsedLocation,
} from '@tanstack/react-router'

type AuthGuardOptions = {
  onError?: () => void
  onSuccess?: () => void
}

export function authGuard({ onError, onSuccess }: AuthGuardOptions = {}) {
  return async function ({
    context,
    navigate,
    ...options
  }: {
    context: { queryClient: QueryClient }
    preload: boolean
    navigate: NavigateFn
    location: ParsedLocation
  }) {
    try {
      await checkAuth({ queryClient: context.queryClient })
      return onSuccess?.()
    } catch (error) {
      onError?.()

      throw logout({
        location,
        navigate,
        preload: options.preload,
        queryClient: context.queryClient,
      })
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

export function logout({
  location,
  navigate,
  preload,
  queryClient,
}: {
  location: Location
  navigate: NavigateFn
  preload: boolean
  queryClient: QueryClient
}) {
  queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTH_ME] })
  userStore.getState().clear()
  if (preload) {
    navigate({ to: '/login', search: { redirect: location.href } })
  } else {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}
