import { instance } from '@/integrations/axios/instance'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './keys'

export type GetAuthUserResponse = {
  id: string
  email: string
}

export async function getAuthUser(): Promise<GetAuthUserResponse> {
  const { data } = await instance.get('/api/auth/me')
  return data
}

export function authUserOptions() {
  return {
    queryKey: [QUERY_KEYS.AUTH_ME],
    queryFn: getAuthUser,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
  }
}

export function useAuthUser() {
  return useQuery<GetAuthUserResponse | undefined>(authUserOptions())
}
