import { queryOptions, useQuery } from '@tanstack/react-query'

import { instance } from '@/integrations/axios/instance'
import type { User } from '@/types/user'

import { QUERY_KEYS } from './keys'

export type GetAuthUserResponse = User

export async function getAuthUser(): Promise<GetAuthUserResponse> {
  const { data } = await instance.get('/api/auth/me')
  return data
}

export function authUserOptions() {
  return queryOptions({
    queryKey: [QUERY_KEYS.AUTH_ME],
    queryFn: getAuthUser,
    gcTime: 1000 * 60 * 2,
  })
}

export function useAuthUser() {
  return useQuery(authUserOptions())
}
