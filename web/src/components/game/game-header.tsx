import { useGameConnection } from '@/hooks/use-game'
import { cn } from '@/lib/utils'

export function GameHeader({ gameID }: { gameID: string }) {
  const connection = useGameConnection()
  return (
    <div className="w-full flex flex-row items-center justify-between gap-2">
      <div className="flex flex-rol items-center gap-2">
        <div
          className={cn('rounded-full size-2 bg-neutral-400', {
            'bg-green-300': connection.connected,
            'bg-red-300': !connection.connected,
          })}
        />
        <div className="text-muted-foreground italic">{gameID}</div>
      </div>
    </div>
  )
}
