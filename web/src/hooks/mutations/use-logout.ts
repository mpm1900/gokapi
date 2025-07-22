import { instance } from '@/integrations/axios/instance'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useLogOut() {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      const { data } = await instance.post('/api/auth/logout')
      toast('Logged out.')
      return data
    },
  })
}
