import Link from "next/link"
import {
  WalletIcon,
  WrenchIcon,
  CheckCircle2Icon,
  ClockIcon,
  SparklesIcon,
  ArrowUpRightIcon,
  PlusIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { TextReveal } from "@/components/motion/text-reveal"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RepairBreakdownChart } from "@/components/dashboard/repair-breakdown-chart"
import {
  REPAIR_JOBS,
  CUSTOMERS,
  REVENUE_HISTORY,
  REPAIR_TYPE_BREAKDOWN,
} from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

export default function DashboardOverviewPage() {
  const revenueMTD = REVENUE_HISTORY[REVENUE_HISTORY.length - 1].value
  const prevRevenue = REVENUE_HISTORY[REVENUE_HISTORY.length - 2].value
  const revenueGrowth = ((revenueMTD - prevRevenue) / prevRevenue) * 100

  const activeJobs = REPAIR_JOBS.filter((j) => j.status !== "Completed")
  const completedJobs = REPAIR_JOBS.filter((j) => j.status === "Completed")

  const topCustomers = [...CUSTOMERS].sort((a, b) => b.spent - a.spent).slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <div className="dark relative overflow-hidden rounded-2xl bg-gradient-brand text-foreground shadow-card">
          <div className="relative flex flex-col gap-4 px-6 py-8 sm:px-8 sm:py-10">
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
              className="max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
            />
            <Reveal delay={0.25}>
              <p className="max-w-lg text-sm text-white/70">
                Track repair jobs, keep an eye on inventory, and see how the
                shop is performing — all from one place.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="flex flex-wrap gap-3 pt-2">
              <Button
                className="rounded"
                nativeButton={false}
                render={<Link href="/dashboard/repairs" />}
              >
                <PlusIcon />
                New repair job
              </Button>
              <Button
                variant="outline"
                className="rounded border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                nativeButton={false}
                render={<Link href="/dashboard/orders" />}
              >
                View orders
              </Button>
            </Reveal>
          </div>
        </div>
      </Reveal>

      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            icon={<WrenchIcon className="size-4 text-primary" />}
            label="Active Repair Jobs"
            value={String(activeJobs.length)}
            hint="Currently in the queue"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<CheckCircle2Icon className="size-4 text-primary" />}
            label="Completed Jobs"
            value={String(completedJobs.length)}
            hint="Out of the last 10 jobs"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<ClockIcon className="size-4 text-primary" />}
            label="Avg. Repair Time"
            value="1.8 days"
            hint="Across all device types"
          />
        </RevealItem>
      </RevealGroup>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <Reveal className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Revenue over time</h2>
              <span className="text-xs text-muted-foreground">Last 12 months</span>
            </div>
            <div className="mt-3">
              <RevenueChart data={REVENUE_HISTORY} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h2 className="font-semibold text-foreground">Repair type breakdown</h2>
            <div className="mt-4 flex flex-1 items-center">
              <RepairBreakdownChart data={REPAIR_TYPE_BREAKDOWN} />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <Reveal className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">Recent repair jobs</h2>
              <Link
                href="/dashboard/repairs"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {REPAIR_JOBS.slice(0, 6).map((job) => (
                <div
                  key={job.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{job.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.device} · {job.issue}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge tone={job.tone}>{job.status}</StatusBadge>
                    <span className="w-16 text-right text-sm font-semibold text-foreground">
                      {formatGBP(job.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
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
          </div>
        </Reveal>
      </div>
    </div>
  )
}
