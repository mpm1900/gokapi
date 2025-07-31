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
import { useGameClients } from '@/hooks/use-game'

export function GameSidebar() {
  const { clients } = useGameClients()
  return (
    <Sidebar
      collapsible="offcanvas"
      side="right"
      variant="floating"
      className="m-2 h-[calc(100svh-1rem)]"
    >
      <Tabs defaultValue="clients" asChild>
        <>
          <SidebarHeader className="items-center">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>
          </SidebarHeader>
          <TabsContent value="chat" asChild>
            <>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    Chat message here...
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <div className="flex row gap-2">
                  <Input placeholder="Type a message..." />
                  <Button variant="secondary" size="icon">
                    <SendIcon />
                  </Button>
                </div>
              </SidebarFooter>
            </>
          </TabsContent>
          <TabsContent value="clients" asChild>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {clients.map((client) => (
                      <SidebarMenuItem key={client.id}>
                        <SidebarMenuButton>
                          {client.user.email}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </TabsContent>
        </>
      </Tabs>
    </Sidebar>
  )
}
