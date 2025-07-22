import { instance } from '@/integrations/axios/instance'
import { useMutation } from '@tanstack/react-query'

export function useLogOut() {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      const { data } = await instance.post('/api/auth/logout')
      return data
    },
  })
}
