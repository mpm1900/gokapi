import { Loader2, SendIcon } from 'lucide-react'
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
import { useMemo, useEffect, useState } from 'react'
import { RoleIcon } from '../role-icon'

function scroolToBottom(
  node: HTMLUListElement | null,
  options?: ScrollIntoViewOptions,
) {
  if (!node) return
  const lastMessage = node.lastElementChild
  if (lastMessage) {
    lastMessage.scrollIntoView(options)
  }
}

export function GameSidebar() {
  const user = useUser()
  const connection = useGameConnection()
  const { clients } = useGameClients()
  const { messages } = useGameChat()
  const [chatMenuNode, setChatMenuNode] = useState<HTMLUListElement | null>(
    null,
  )
  const [activeTab, setActiveTab] = useState('chat')

  useEffect(() => {
    if (activeTab === 'chat') {
      scroolToBottom(chatMenuNode, { behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (activeTab === 'chat') {
      scroolToBottom(chatMenuNode, { behavior: 'instant' })
    }
  }, [activeTab, chatMenuNode])

  return (
    <Sidebar
      collapsible="offcanvas"
      side="right"
      variant="floating"
      className="m-2 h-[calc(100svh-1rem)]"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="chat"
        className="h-full gap-0"
      >
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
                <SidebarMenu ref={setChatMenuNode}>
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
                disabled={!user || !connection.connected}
              />
              <Button
                type="submit"
                variant="secondary"
                size="icon"
                disabled={!user || !connection.connected}
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
                  {clients.length === 0 && (
                    <SidebarMenuItem className="flex items-center justify-center">
                      <Loader2 className="animate-spin" />
                    </SidebarMenuItem>
                  )}
                  {clients.map((client) => (
                    <SidebarMenuItem key={client.id}>
                      <SidebarMenuButton>
                        <RoleIcon role={client.role} /> {client.user.email}{' '}
                        {client.user.id === user?.id && (
                          <span className="italic text-muted-foreground">
                            (You)
                          </span>
                        )}
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
