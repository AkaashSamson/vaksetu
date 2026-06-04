"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppHeader() {
  return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="pointer-events-none justify-center">
            <div className="bg-brand-900 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <span className="text-sm font-bold">V</span>
            </div>
            <span className="sr-only">Vaksetu</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
  )
}
