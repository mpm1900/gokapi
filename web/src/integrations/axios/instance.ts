import axios from 'axios'

export const instance = axios.create({
  baseURL: ''
})

instance.interceptors.request.use((config) => {
  return config
})

instance.interceptors.response.use((response) => {
  return response
})
