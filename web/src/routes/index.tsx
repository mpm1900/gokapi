import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
              <form
                onSubmit={(e: React.FormEvent<FormElement>) => {
                  e.preventDefault()
                  const elements = e.currentTarget.elements
                  console.log(elements)
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
                      {/*
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                      */}
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
                      Login
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
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
