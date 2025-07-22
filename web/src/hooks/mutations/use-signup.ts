import { instance } from '@/integrations/axios/instance'
import { useMutation } from '@tanstack/react-query'

type SignUpRequest = {
  email: string
  password: string
}

export function useSignUp() {
  return useMutation({
    mutationKey: ['signup'],
    mutationFn: async (req: SignUpRequest) => {
      const { data } = await instance.post('/api/auth/signup', req)
      console.log(data)
      return data
    },
  })
}
