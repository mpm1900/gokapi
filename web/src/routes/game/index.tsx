import { useGames } from '@/hooks/queries/use-games'
import { authGuard } from '@/lib/auth'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/game/')({
  beforeLoad: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  const query = useGames()
  return (
    <div className="@container/main relative flex-1 flex flex-col overflow-hidden p-4">
      <h1 className="text-2xl font-bold">Games</h1>
      <ul>
        {query.data?.games.map((game) => (
          <li key={game.id}>
            <Link
              to={`/game/$gameID`}
              params={{ gameID: game.id }}
              // target="_blank"
              className="text-link hover:underline"
            >
              {game.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
