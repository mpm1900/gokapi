import { LogInForm } from '@/components/login/log-in-form'
import { SignUpForm } from '@/components/login/sign-up-form'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { PiSquareIcon } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

export type FormElements = HTMLFormControlsCollection & {
  email: HTMLInputElement
  password: HTMLInputElement
}
export type FormElement = HTMLFormElement & {
  readonly elements: FormElements
}

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
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
              <Tabs defaultValue="login" className="flex flex-col gap-6">
                <TabsList className="flex flex-row gap-2 self-center">
                  <TabsTrigger value="login">Log In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                  <SignUpForm />
                </TabsContent>
                <TabsContent value="login">
                  <LogInForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            Copyright © 2025 Gokapi. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
