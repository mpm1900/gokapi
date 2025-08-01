import { instance } from '@/integrations/axios/instance'
import { useMutation } from '@tanstack/react-query'
import { useUpdateUser } from '../use-user'
import { MUTATION_KEYS } from './keys'

type LoginRequest = {
  email: string
  password: string
}

export function useLogIn() {
  const set = useUpdateUser()
  return useMutation({
    mutationKey: [MUTATION_KEYS.LOGIN],
    mutationFn: async (req: LoginRequest) => {
      const { data } = await instance.post('/api/auth/login', req)
      set({ id: data.id, email: data.email, username: data.username })
      return data
    },
  })
}
