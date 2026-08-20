"use client";

import Link from "next/link";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  WrenchIcon,
  MonitorIcon,
  CpuIcon,
  StarIcon,
  LogOutIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const QUICK_LINKS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "All Bookings", href: "/dashboard/bookings", icon: ClipboardListIcon },
  { label: "Repairs", href: "/dashboard/repairs", icon: WrenchIcon },
  { label: "Pre-built PCs", href: "/dashboard/pre-built-pcs", icon: MonitorIcon },
  { label: "Custom Built", href: "/dashboard/custom-built/bookings", icon: CpuIcon },
  { label: "Reviews", href: "/dashboard/reviews", icon: StarIcon },
];

function initialsFor(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A"
  );
}

export function AdminNavMenu({
  user,
  className,
}: {
  user: { name: string; email: string };
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Admin menu"
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:opacity-80",
          className
        )}
      >
        <Avatar className="size-9 ring-2 ring-white/25">
          <AvatarFallback className="bg-white/10 text-white">
            {initialsFor(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12} className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex flex-col gap-0.5 px-1.5 py-1.5">
              <span className="truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {QUICK_LINKS.map((link) => (
            <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
              <link.icon />
              {link.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logout()}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
