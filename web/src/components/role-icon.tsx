import { type GameClient } from '@/types/game'
import { CrownIcon, UserIcon, type LucideProps } from 'lucide-react'
export function RoleIcon({
  role,
  ...rest
}: { role: GameClient['role'] } & LucideProps) {
  switch (role) {
    case 'HOST':
      return <CrownIcon {...rest} />
    case 'PLYAYER':
      return <UserIcon {...rest} />
    default:
      return null
  }
}
