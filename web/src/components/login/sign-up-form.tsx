import { useSignUp } from '@/hooks/mutations/use-signup'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import type { FormElement } from '@/routes/login'

function SignUpForm() {
  const signUp = useSignUp()
  const navigate = useNavigate()

  function handleSignUp(e: React.FormEvent<FormElement>) {
    e.preventDefault()
    const elements = e.currentTarget.elements
    signUp.mutate(
      {
        email: elements.email.value,
        password: elements.password.value,
      },
      {
        onError() {
          toast.error('There was an error signing up')
        },
        onSuccess() {
          toast.success('Successfully signed up!')
          navigate({ to: '/app' })
        },
      },
    )
  }
  return (
    <form onSubmit={handleSignUp}>
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
          <Input
            id="password"
            type="password"
            name="password"
            required
            minLength={8}
          />
        </div>
        <div className="flex flex-col">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  )
}

export { SignUpForm }
