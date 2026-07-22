"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRightIcon, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export interface NavLinkItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface NavGroupItem {
  title: string
  icon: LucideIcon
  children: [NavLinkItem, NavLinkItem]
}

export type NavItem = NavLinkItem | NavGroupItem

function isUrlActive(pathname: string, url: string) {
  return url === "/dashboard"
    ? pathname === url
    : pathname === url || pathname.startsWith(`${url}/`)
}

function useActiveUrl(items: NavItem[], pathname: string) {
  return React.useMemo(() => {
    const urls = items.flatMap((item) => ("children" in item ? item.children.map((c) => c.url) : [item.url]))
    let best: string | null = null
    for (const url of urls) {
      if (isUrlActive(pathname, url) && (!best || url.length > best.length)) {
        best = url
      }
    }
    return best
  }, [items, pathname])
}

function NavHighlightPill() {
  return (
    <motion.span
      layoutId="dashboard-nav-active"
      transition={{ type: "spring", stiffness: 500, damping: 38 }}
      className="absolute inset-0 rounded-md bg-sidebar-accent shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]"
    >
      <span className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-primary" />
    </motion.span>
  )
}

function NavLink({ item, activeUrl }: { item: NavLinkItem; activeUrl: string | null }) {
  const isActive = item.url === activeUrl

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={isActive}
        render={<Link href={item.url} />}
        className="relative data-active:bg-transparent"
      >
        {isActive && <NavHighlightPill />}
        <item.icon className={cn("relative z-10 transition-colors", isActive && "text-primary")} />
        <span className="relative z-10">{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function NavGroup({ item, activeUrl }: { item: NavGroupItem; activeUrl: string | null }) {
  const { state, isMobile } = useSidebar()
  const childActive = item.children.some((child) => child.url === activeUrl)
  const [manualOpen, setManualOpen] = React.useState(childActive)

  const open = childActive || manualOpen

  if (state === "collapsed" && !isMobile) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                tooltip={item.title}
                isActive={childActive}
                className="relative data-active:bg-transparent"
              />
            }
          >
            {childActive && <NavHighlightPill />}
            <item.icon className={cn("relative z-10 transition-colors", childActive && "text-primary")} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
              {item.children.map((child) => {
                const isActive = child.url === activeUrl
                return (
                  <DropdownMenuItem
                    key={child.title}
                    render={<Link href={child.url} />}
                    className={cn(isActive && "font-medium text-primary")}
                  >
                    <child.icon />
                    {child.title}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setManualOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={childActive}
              className="group/trigger relative data-active:bg-transparent"
            />
          }
        >
          {childActive && <NavHighlightPill />}
          <item.icon className={cn("relative z-10 transition-colors", childActive && "text-primary")} />
          <span className="relative z-10">{item.title}</span>
          <ChevronRightIcon className="relative z-10 ml-auto size-4 shrink-0 transition-transform duration-200 group-data-panel-open/trigger:rotate-90 group-data-[collapsible=icon]:hidden" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => {
              const isActive = child.url === activeUrl
              return (
                <SidebarMenuSubItem key={child.title}>
                  <SidebarMenuSubButton
                    isActive={isActive}
                    render={<Link href={child.url} />}
                    className="data-active:font-medium data-active:text-primary"
                  >
                    <span
                      className={cn(
                        "size-1 shrink-0 rounded-full bg-current transition-opacity",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{child.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const activeUrl = useActiveUrl(items, pathname)

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.65rem] font-semibold tracking-wider uppercase">
        Menu
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          "children" in item ? (
            <NavGroup key={item.title} item={item} activeUrl={activeUrl} />
          ) : (
            <NavLink key={item.title} item={item} activeUrl={activeUrl} />
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
