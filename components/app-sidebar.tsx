"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboardIcon,
  MonitorCogIcon,
  WrenchIcon,
  PackageIcon,
  Settings2Icon,
  ZapIcon,
} from "lucide-react"

import { NavMain, type NavItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const NAV_ITEMS: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "My Builds", url: "/dashboard/builds", icon: MonitorCogIcon },
  { title: "Repairs", url: "/dashboard/repairs", icon: WrenchIcon },
  { title: "Orders", url: "/dashboard/orders", icon: PackageIcon },
  { title: "Settings", url: "/dashboard/settings", icon: Settings2Icon },
]

const USER = {
  name: "Faizan Hashmi",
  email: "faizanhashmi603@gmail.com",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
              render={<Link href="/" />}
            >
              <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ZapIcon className="size-4" />
              </span>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">PC Xpress</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Customer Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_ITEMS} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={USER} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
