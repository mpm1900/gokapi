import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function PageLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode
  sidebar?: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      {sidebar}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
