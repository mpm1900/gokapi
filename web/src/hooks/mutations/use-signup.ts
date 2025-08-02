import { useMutation } from '@tanstack/react-query'

import { instance } from '@/integrations/axios/instance'

import { MUTATION_KEYS } from './keys'

type SignUpRequest = {
  email: string
  password: string
}

export function useSignUp() {
  return useMutation({
    mutationKey: [MUTATION_KEYS.SIGNUP],
    mutationFn: async (req: SignUpRequest) => {
      const { data } = await instance.post('/api/auth/signup', req)
      return data
    },
  })
}
