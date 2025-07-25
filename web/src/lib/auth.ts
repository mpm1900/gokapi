import { getAuthUser } from '@/hooks/queries/use-auth-user'
import { userStore } from '@/hooks/use-user'

import { redirect } from '@tanstack/react-router'

type AuthGuardOptions = {
  onError?: () => void
  onSuccess?: () => void
}

export function authGuard({ onError, onSuccess }: AuthGuardOptions = {}) {
  return async function () {
    try {
      const data = await getAuthUser()
      userStore.getState().set({
        id: data.id,
        email: data.email,
      })

      return onSuccess?.()
    } catch (error) {
      onError?.()

      return redirect({ to: '/login' })
    }
  }
}
