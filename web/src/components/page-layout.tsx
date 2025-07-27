import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function PageLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode
  sidebar?: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset className="lg:max-h-[calc(100svh-1rem)]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
