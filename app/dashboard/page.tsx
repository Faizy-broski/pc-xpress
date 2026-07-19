import Link from "next/link"
import {
  WrenchIcon,
  MonitorCogIcon,
  PackageIcon,
  WalletIcon,
  SparklesIcon,
  ArrowUpRightIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { TextReveal } from "@/components/motion/text-reveal"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { RepairProgressBar } from "@/components/dashboard/repair-progress"
import {
  REPAIRS,
  ORDERS,
  SAVED_BUILDS,
  REPAIR_STEPS,
} from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

export default function DashboardOverviewPage() {
  const activeRepairs = REPAIRS.filter(
    (r) => r.currentStep < REPAIR_STEPS.length - 1
  )
  const totalSpent = ORDERS.reduce((sum, o) => sum + o.total, 0)

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
              text="Hey Faizan, here's your account."
              delay={0.1}
              className="max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
            />
            <Reveal delay={0.25}>
              <p className="max-w-lg text-sm text-white/70">
                Track your repairs, revisit saved builds, and manage orders —
                all from one place.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="flex flex-wrap gap-3 pt-2">
              <Button
                className="rounded"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                Book a repair
                <ArrowUpRightIcon />
              </Button>
              <Button
                variant="outline"
                className="rounded border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                nativeButton={false}
                render={<Link href="/build-a-pc" />}
              >
                Start a new build
              </Button>
            </Reveal>
          </div>
        </div>
      </Reveal>

      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RevealItem>
          <StatCard
            icon={<WrenchIcon className="size-4 text-primary" />}
            label="Active Repairs"
            value={String(activeRepairs.length)}
            hint="Currently in progress"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<MonitorCogIcon className="size-4 text-primary" />}
            label="Saved Builds"
            value={String(SAVED_BUILDS.length)}
            hint="Ready to order"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<PackageIcon className="size-4 text-primary" />}
            label="Total Orders"
            value={String(ORDERS.length)}
            hint="All time"
          />
        </RevealItem>
        <RevealItem>
          <StatCard
            icon={<WalletIcon className="size-4 text-primary" />}
            label="Total Spent"
            value={formatGBP(totalSpent)}
            hint="All time"
          />
        </RevealItem>
      </RevealGroup>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <Reveal className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">
                Active Repairs
              </h2>
              <Link
                href="/dashboard/repairs"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {activeRepairs.length === 0 && (
                <p className="px-5 py-6 text-sm text-muted-foreground">
                  No active repairs right now.
                </p>
              )}
              {activeRepairs.map((repair) => (
                <div key={repair.id} className="flex flex-col gap-3 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {repair.device}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {repair.issue}
                      </p>
                    </div>
                    <StatusBadge tone={repair.tone} className="shrink-0">
                      {REPAIR_STEPS[repair.currentStep]}
                    </StatusBadge>
                  </div>
                  <RepairProgressBar currentStep={repair.currentStep} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{repair.id}</span>
                    <span>ETA: {repair.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">Saved Builds</h2>
              <Link
                href="/dashboard/builds"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {SAVED_BUILDS.slice(0, 2).map((build) => (
                <div key={build.id} className="px-5 py-4">
                  <p className="font-medium text-foreground">{build.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Updated {build.updated}
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {formatGBP(build.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {ORDERS.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-foreground">{order.items}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} · {order.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">
                    {formatGBP(order.total)}
                  </span>
                  <StatusBadge tone={order.tone}>{order.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
