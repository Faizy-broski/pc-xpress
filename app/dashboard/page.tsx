"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  WalletIcon,
  ClipboardListIcon,
  WrenchIcon,
  MonitorIcon,
  SparklesIcon,
  ArrowUpRightIcon,
  PlusIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { TextReveal } from "@/components/motion/text-reveal"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RepairBreakdownChart } from "@/components/dashboard/repair-breakdown-chart"
import {
  useRepairJobs,
  useCustomBuildOrders,
  usePrebuiltOrders,
} from "@/components/dashboard/store"
import {
  repairJobToBooking,
  customBuildOrderToBooking,
  prebuiltOrderToBooking,
} from "@/components/dashboard/bookings"
import {
  CUSTOMERS,
  REVENUE_HISTORY,
  REPAIR_TYPE_BREAKDOWN,
} from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

function monthKeyOf(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${d.getMonth()}`
}

export default function DashboardOverviewPage() {
  const repairJobs = useRepairJobs()
  const customBuildOrders = useCustomBuildOrders()
  const prebuiltOrders = usePrebuiltOrders()

  const revenueMTD = REVENUE_HISTORY[REVENUE_HISTORY.length - 1].value
  const prevRevenue = REVENUE_HISTORY[REVENUE_HISTORY.length - 2].value
  const revenueGrowth = ((revenueMTD - prevRevenue) / prevRevenue) * 100

  const activeJobs = repairJobs.filter((j) => j.status !== "Completed")
  const activeCustomBuildOrders = customBuildOrders.filter((o) => o.status !== "Delivered")
  const activePrebuiltOrders = prebuiltOrders.filter((o) => o.status !== "Delivered")

  const allBookings = useMemo(
    () => [
      ...repairJobs.map(repairJobToBooking),
      ...customBuildOrders.map(customBuildOrderToBooking),
      ...prebuiltOrders.map(prebuiltOrderToBooking),
    ],
    [repairJobs, customBuildOrders, prebuiltOrders]
  )

  const bookingsThisMonth = useMemo(() => {
    if (allBookings.length === 0) return 0
    const monthKeys = allBookings.map((b) => monthKeyOf(b.date))
    const currentMonth = monthKeys.sort().at(-1)
    return monthKeys.filter((key) => key === currentMonth).length
  }, [allBookings])

  const recentActivity = useMemo(() => allBookings.slice(0, 6), [allBookings])

  const topCustomers = [...CUSTOMERS].sort((a, b) => b.spent - a.spent).slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <Reveal viewTrigger={false}>
        <div className="dark relative overflow-hidden rounded-2xl bg-gradient-brand text-foreground shadow-card">
          <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="relative flex flex-col gap-4 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <Badge
              variant="soft"
              className="w-fit border border-white/15 bg-white/10 text-white"
            >
              <SparklesIcon className="size-3.5" />
              Welcome back
            </Badge>
            <TextReveal
              as="h1"
              text="Hey Faizan, here's what's happening at your shop."
              delay={0.1}
              className="max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl xl:text-4xl"
            />
            <Reveal viewTrigger={false} delay={0.25}>
              <p className="max-w-lg text-sm text-white/70">
                Track repairs, custom builds, and pre-built orders, and see how
                the shop is performing — all from one place.
              </p>
            </Reveal>
            <Reveal viewTrigger={false} delay={0.35} className="flex flex-wrap gap-3 pt-2">
              <Button
                className="rounded"
                nativeButton={false}
                render={<Link href="/dashboard/repairs" />}
              >
                <PlusIcon />
                New repair
              </Button>
              <Button
                variant="outline"
                className="rounded border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                nativeButton={false}
                render={<Link href="/dashboard/bookings" />}
              >
                View all bookings
              </Button>
            </Reveal>
          </div>
        </div>
      </Reveal>

      <RevealGroup
        viewTrigger={false}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <RevealItem>
          <StatCard
            icon={<WalletIcon className="size-4 text-primary" />}
            label="Revenue (MTD)"
            value={formatGBP(revenueMTD)}
            hint={`${revenueGrowth >= 0 ? "▲" : "▼"} ${Math.abs(revenueGrowth).toFixed(1)}% vs last month`}
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<ClipboardListIcon className="size-4 text-primary" />}
            label="Total Bookings"
            value={String(bookingsThisMonth)}
            hint="This month, across all modules"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<WrenchIcon className="size-4 text-primary" />}
            label="Repair Jobs In Progress"
            value={String(activeJobs.length)}
            hint="Currently in the queue"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<MonitorIcon className="size-4 text-primary" />}
            label="PC Orders In Progress"
            value={String(activeCustomBuildOrders.length + activePrebuiltOrders.length)}
            hint={`${activeCustomBuildOrders.length} custom build · ${activePrebuiltOrders.length} pre-built`}
          />
        </RevealItem>
      </RevealGroup>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal viewTrigger={false} className="lg:col-span-2">
          <Card className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Revenue over time</h2>
              <span className="text-xs text-muted-foreground">Last 12 months</span>
            </div>
            <div className="mt-3 flex flex-1 items-center">
              <RevenueChart data={REVENUE_HISTORY} />
            </div>
          </Card>
        </Reveal>

        <Reveal viewTrigger={false} delay={0.1}>
          <Card className="flex h-full flex-col">
            <h2 className="font-semibold text-foreground">Repair type breakdown</h2>
            <div className="mt-4 flex flex-1 items-center">
              <RepairBreakdownChart data={REPAIR_TYPE_BREAKDOWN} />
            </div>
          </Card>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <Reveal viewTrigger={false} className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">Recent activity</h2>
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((booking) => (
                <div
                  key={`${booking.module}-${booking.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{booking.customer}</p>
                    <p className="text-xs text-muted-foreground">{booking.item}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="soft">{booking.module}</Badge>
                    <StatusBadge tone={booking.tone}>{booking.status}</StatusBadge>
                    <span className="w-16 text-right text-sm font-semibold text-foreground">
                      {formatGBP(booking.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal viewTrigger={false} delay={0.1}>
          <Card>
            <h2 className="font-semibold text-foreground">Top customers</h2>
            <div className="mt-4 flex flex-col gap-4">
              {topCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-foreground text-background">
                      {customer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {customer.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer.devices} devices
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {formatGBP(customer.spent)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  )
}
