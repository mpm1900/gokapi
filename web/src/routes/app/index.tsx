import { useGames } from '@/hooks/queries/use-games'
import { authGuard } from '@/lib/auth'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  beforeLoad: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  const query = useGames()
  return (
    <div className="@container/main relative flex-1 flex flex-col overflow-hidden">
      APP
      <ul>
        {query.data?.games.map((game) => (
          <li key={game.id}>
            <Link
              to={`/app/$gameID`}
              params={{ gameID: game.id }}
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
