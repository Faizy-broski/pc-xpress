"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutDashboardIcon,
  WrenchIcon,
  MonitorIcon,
  UsersIcon,
  BoxesIcon,
  PackageIcon,
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
  { title: "Repair Jobs", url: "/dashboard/repairs", icon: WrenchIcon },
  { title: "Pre-built PCs", url: "/dashboard/pre-built-pcs", icon: MonitorIcon },
  { title: "Customers", url: "/dashboard/customers", icon: UsersIcon },
  { title: "Inventory", url: "/dashboard/inventory", icon: BoxesIcon },
  { title: "Orders", url: "/dashboard/orders", icon: PackageIcon },
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
              render={<Link href="/dashboard" />}
            >
              <span className="hidden aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded group-data-[collapsible=icon]:flex">
                <Image
                  src="/favicon.ico"
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-7 object-contain"
                />
              </span>
              <div className="flex flex-1 items-center group-data-[collapsible=icon]:hidden">
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
      <SidebarFooter>
        <NavUser user={USER} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
