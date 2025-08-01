import { SendIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  useGameChat,
  useGameClients,
  useGameConnection,
} from '@/hooks/use-game'
import { useUser } from '@/hooks/use-user'
import type { GameChatMessage, GameClient } from '@/types/game'
import { useMemo } from 'react'
import { RoleIcon } from '../role-icon'

export function GameSidebar() {
  const user = useUser()
  const connection = useGameConnection()
  const { clients } = useGameClients()
  const { messages } = useGameChat()
  return (
    <Sidebar
      collapsible="offcanvas"
      side="right"
      variant="floating"
      className="m-2 h-[calc(100svh-1rem)]"
    >
      <Tabs defaultValue="chat" className="h-full gap-0">
        <SidebarHeader className="items-center">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
        </SidebarHeader>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <SidebarContent className="flex-1 max-h-[calc(100vh-8rem)] overflow-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {messages.map((message, i) => (
                    <ChatMessage key={i} message={message} clients={clients} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <form
              className="flex row gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                connection.send({
                  type: 'CHAT_MESSAGE',
                  chatMessage: {
                    from: user!.id,
                    // @ts-ignore
                    message: event.currentTarget.elements.message.value,
                    timestamp: new Date(),
                  },
                })
                event.currentTarget.reset()
              }}
            >
              <Input
                autoFocus
                autoComplete="off"
                placeholder="Type a message..."
                name="message"
                disabled={!user}
              />
              <Button
                type="submit"
                variant="secondary"
                size="icon"
                disabled={!user}
              >
                <SendIcon />
              </Button>
            </form>
          </SidebarFooter>
        </TabsContent>

        <TabsContent value="clients" asChild>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {clients.map((client) => (
                    <SidebarMenuItem key={client.id}>
                      <SidebarMenuButton>
                        <RoleIcon role={client.role} /> {client.user.email}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </TabsContent>
      </Tabs>
    </Sidebar>
  )
}

function ChatMessage({
  message,
  clients,
}: {
  message: GameChatMessage
  clients: GameClient[]
}) {
  const client = useMemo(
    () => clients.find((c) => c.id === message.from),
    [clients, message.from],
  )

  return (
    <SidebarMenuItem>
      <div className="h-fit items-start inline">
        <span className="font-bold mr-1 inline-flex max-h-[17px] items-baseline gap-1">
          {client && (
            <RoleIcon className="size-4 absolute top-0.5" role={client?.role} />
          )}
          <div className="pl-5">{client?.user.email || 'unknown'}:</div>
        </span>
        <span>{message.message}</span>
      </div>
    </SidebarMenuItem>
  )
}
