import { instance } from '@/integrations/axios/instance'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { logout } from '@/lib/auth'
import { MUTATION_KEYS } from './keys'

export function useLogOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGOUT],
    mutationFn: async () => {
      const { data } = await instance.post('/api/auth/logout')
      logout({ queryClient, location, preload: true, navigate })
      toast('Logged out.')
      return data
    },
  })
}
