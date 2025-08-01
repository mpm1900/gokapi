import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/hooks/use-user'
import { authGuard } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/user/settings')({
  beforeLoad: authGuard(),
  component: RouteComponent,
})

function RouteComponent() {
  const user = useUser()
  const [username, setUsername] = useState(user!.username)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('submit')
    toast.success('Successfully updated username!')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      <form className="flex flex-col justify-start" onSubmit={handleSubmit}>
        <div className="lg:max-w-64">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </form>
    </div>
  )
}
