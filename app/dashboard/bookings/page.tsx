"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { useRepairJobs, useCustomBuildOrders, usePrebuiltOrders } from "@/components/dashboard/store"
import {
  MODULE_FILTERS,
  repairJobToBooking,
  customBuildOrderToBooking,
  prebuiltOrderToBooking,
} from "@/components/dashboard/bookings"
import { formatGBP } from "@/components/build-a-pc/data"

export default function DashboardAllBookingsPage() {
  const repairJobs = useRepairJobs()
  const customBuildOrders = useCustomBuildOrders()
  const prebuiltOrders = usePrebuiltOrders()

  const allBookings = useMemo(
    () => [
      ...repairJobs.map(repairJobToBooking),
      ...customBuildOrders.map(customBuildOrderToBooking),
      ...prebuiltOrders.map(prebuiltOrderToBooking),
    ],
    [repairJobs, customBuildOrders, prebuiltOrders]
  )

  const [filter, setFilter] = useState<(typeof MODULE_FILTERS)[number]>("All")
  const [search, setSearch] = useState("")

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()
    return allBookings.filter(
      (booking) =>
        (filter === "All" || booking.module === filter) &&
        (query === "" ||
          booking.customer.toLowerCase().includes(query) ||
          booking.item.toLowerCase().includes(query))
    )
  }, [allBookings, filter, search])

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            All Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every repair job and PC order across the shop, in one place.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div className="flex flex-wrap gap-1.5">
              {MODULE_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    filter === f
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-60">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer or item"
                className="h-9 rounded-lg pl-8"
              />
            </div>
          </div>

          <div className="hidden grid-cols-[1.1fr_1.3fr_0.9fr_0.9fr_0.9fr_auto] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Customer</span>
            <span>Item</span>
            <span>Module</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>

          <RevealGroup
            key={filteredBookings.map((b) => `${b.module}-${b.id}`).join(",")}
            className="divide-y divide-border"
          >
            {filteredBookings.map((booking) => (
              <RevealItem
                key={`${booking.module}-${booking.id}`}
                className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[1.1fr_1.3fr_0.9fr_0.9fr_0.9fr_auto] sm:items-center sm:gap-4"
              >
                <div>
                  <p className="font-medium text-foreground">{booking.customer}</p>
                  <p className="text-xs text-muted-foreground">{booking.id}</p>
                </div>
                <span className="text-sm text-muted-foreground">{booking.item}</span>
                <Badge variant="soft" className="w-fit">
                  {booking.module}
                </Badge>
                <StatusBadge tone={booking.tone} className="w-fit">
                  {booking.status}
                </StatusBadge>
                <span className="text-sm text-muted-foreground">{booking.date}</span>
                <span className="font-semibold text-foreground sm:text-right">
                  {formatGBP(booking.amount)}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          {filteredBookings.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No bookings match your search.
            </p>
          )}
        </div>
      </Reveal>
    </div>
  )
}
