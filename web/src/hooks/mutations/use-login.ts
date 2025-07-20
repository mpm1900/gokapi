import { instance } from '@/integrations/axios/instance'
import { useMutation } from '@tanstack/react-query'

type LoginRequest = {
  email: string
  password: string
}

export function useLogIn() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (req: LoginRequest) => {
      const { data } = await instance.post('/auth/login', req)
      console.log(data)
      return data
    },
  })
}
