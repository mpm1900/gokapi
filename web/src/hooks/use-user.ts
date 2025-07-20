import { create, useStore } from 'zustand'

type User = {
  id: string
  email: string
}

type UserStore = {
  user: User | null
  set: (user: User) => void
  clear: () => void
}

export const userStore = create<UserStore>((set) => ({
  user: null,
  set: (user) => set({ user }),
  clear: () => set({ user: null }),
}))

export function useUser() {
  return useStore(userStore, (s) => s.user)
}
