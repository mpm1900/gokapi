import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import type { FormElement } from '@/routes/login'
import { Loader2 } from 'lucide-react'
import { useLogIn } from '@/hooks/mutations/use-login'

export function LogInForm() {
  const logIn = useLogIn()
  const navigate = useNavigate()

  function handleLogIn(e: React.FormEvent<FormElement>) {
    e.preventDefault()
    const elements = e.currentTarget.elements
    logIn.mutate(
      {
        email: elements.email.value,
        password: elements.password.value,
      },
      {
        onError() {
          toast.error('There was an error logging in')
        },
        onSuccess() {
          toast.success('Successfully logged in!')
          navigate({ to: '/app' })
        },
      },
    )
  }

  return (
    <form onSubmit={handleLogIn}>
      <div className="flex flex-col gap-6">
        <div className="grid">
          <div className="flex items-center mb-3">
            <Label htmlFor="email">Email</Label>
          </div>
          <Input
            autoFocus
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid">
          <div className="flex items-center mb-3">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" name="password" required />
        </div>
        <div className="flex flex-col">
          <Button type="submit" className="w-full" disabled={logIn.isPending}>
            {logIn.isPending ? <Loader2 className="animate-spin" /> : 'Log In'}
          </Button>
        </div>
      </div>
    </form>
  )
}
