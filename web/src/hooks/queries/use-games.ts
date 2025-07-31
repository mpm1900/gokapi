import { useQuery } from '@tanstack/react-query'

import { instance } from '@/integrations/axios/instance'
import { QUERY_KEYS } from './keys'

type GetGamesResponse = {
  games: { id: string }[]
}

export async function getGames(): Promise<GetGamesResponse> {
  const { data } = await instance.get('/api/games')
  return {
    games: data,
  }
}

export function gamesOptions() {
  return {
    queryKey: [QUERY_KEYS.GAMES],
    queryFn: getGames,
  }
}

export function useGames() {
  return useQuery(gamesOptions())
}
