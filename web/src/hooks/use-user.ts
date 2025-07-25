import { create, useStore } from 'zustand'

export type User = {
  id: string
  email: string
}

export type UserStore = {
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

export function useUpdateUser() {
  return useStore(userStore, (s) => s.set)
}
