"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  WrenchIcon,
  MonitorIcon,
  CpuIcon,
  StarIcon,
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
  SidebarSeparator,
} from "@/components/ui/sidebar"

const NAV_ITEMS: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "All Bookings", url: "/dashboard/bookings", icon: ClipboardListIcon },
  { title: "Reviews", url: "/dashboard/reviews", icon: StarIcon },
  {
    title: "Repairs",
    icon: WrenchIcon,
    children: [
      { title: "Bookings", url: "/dashboard/repairs", icon: WrenchIcon },
      { title: "Catalog", url: "/dashboard/repairs/add-fault", icon: WrenchIcon },
    ],
  },
  {
    title: "Pre-built PCs",
    icon: MonitorIcon,
    children: [
      { title: "Bookings", url: "/dashboard/pre-built-pcs/bookings", icon: MonitorIcon },
      { title: "Catalog", url: "/dashboard/pre-built-pcs", icon: MonitorIcon },
    ],
  },
  {
    title: "Custom Built",
    icon: CpuIcon,
    children: [
      { title: "Bookings", url: "/dashboard/custom-built/bookings", icon: CpuIcon },
      { title: "Catalog", url: "/dashboard/custom-built/add-part", icon: CpuIcon },
    ],
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
              render={<Link href="/dashboard" />}
            >
              <span className="hidden aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded transition-transform duration-200 group-data-[collapsible=icon]:flex hover:scale-105">
                <Image
                  src="/favicon.ico"
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-7 object-contain"
                />
              </span>
              <div className="flex flex-1 items-center transition-transform duration-200 group-data-[collapsible=icon]:hidden hover:scale-[1.02]">
                <Image
                  src="/pc-xpress.png"
                  alt="PC Xpress"
                  width={404}
                  height={110}
                  className="h-9 w-auto"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_ITEMS} />
      </SidebarContent>
      <SidebarSeparator className="mx-0 w-full bg-sidebar-border/60" />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
