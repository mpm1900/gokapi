import { instance } from '@/integrations/axios/instance'
import { useQuery } from '@tanstack/react-query'

export async function getAuthUser() {
  return await instance.get('/api/auth/me')
}

export function useAuthUser() {
  return useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const { data } = await getAuthUser()
      return data
    },
  })
}
