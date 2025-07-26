import { instance } from '@/integrations/axios/instance'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { MUTATION_KEYS } from './keys'
import { logout } from '@/lib/auth'

export function useLogOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGOUT],
    mutationFn: async () => {
      const { data } = await instance.post('/api/auth/logout')
      logout({ queryClient })
      toast('Logged out.')
      return data
    },
  })
}
