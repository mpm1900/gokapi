import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSignUp } from '@/hooks/mutations/use-signup'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { PiSquareIcon } from 'lucide-react'

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement
  password: HTMLInputElement
}
interface FormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const signUp = useSignUp()

  return (
    <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <a
          href="#"
          className="flex items-center justify-center gap-2 self-center font-medium p-4 mb-3"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <PiSquareIcon className="size-4" />
          </div>
          Gokapi
        </a>
        <div className={cn('flex flex-col gap-3')}>
          <Card>
            <CardContent>
              <Tabs defaultValue="signup" className="flex flex-col gap-6">
                <TabsList className="flex flex-row gap-2 self-center">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                  <form
                    onSubmit={(e: React.FormEvent<FormElement>) => {
                      e.preventDefault()
                      const elements = e.currentTarget.elements
                      signUp.mutate({
                        email: elements.email.value,
                        password: elements.password.value,
                      })
                      e.currentTarget.reset()
                    }}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="grid">
                        <div className="flex items-center mb-3">
                          <Label htmlFor="email">Email</Label>
                        </div>
                        <Input
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
                        />
                      </div>
                      <div className="flex flex-col">
                        <Button type="submit" className="w-full">
                          Sign Up
                        </Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>{' '}
                <TabsContent value="login">
                  <form
                    onSubmit={(e: React.FormEvent<FormElement>) => {
                      e.preventDefault()
                      const elements = e.currentTarget.elements
                      signUp.mutate({
                        email: elements.email.value,
                        password: elements.password.value,
                      })
                      e.currentTarget.reset()
                    }}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="grid">
                        <div className="flex items-center mb-3">
                          <Label htmlFor="email">Email</Label>
                        </div>
                        <Input
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
                        />
                      </div>
                      <div className="flex flex-col">
                        <Button type="submit" className="w-full">
                          Log In
                        </Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
