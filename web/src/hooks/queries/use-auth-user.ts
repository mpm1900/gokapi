import { instance } from '@/integrations/axios/instance'
import { useQuery } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { useUpdateUser } from '../use-user'

export type GetAuthUserResponse = {
  id: string
  email: string
}

export async function getAuthUser(): Promise<GetAuthUserResponse> {
  const { data } = await instance.get('/api/auth/me')
  return data
}

export function useAuthUser() {
  const set = useUpdateUser()
  return useQuery<GetAuthUserResponse | undefined>({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const data = await getAuthUser()
        set({ id: data.id, email: data.email })
        return data
      } catch (error) {
        redirect({ to: '/login' })
        return undefined
      }
    },
  })
}
