"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { REPAIR_JOBS } from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

const FILTERS = ["All", "Pending", "In Progress", "Completed", "On Hold"] as const

export default function DashboardRepairsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const [search, setSearch] = useState("")

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()
    return REPAIR_JOBS.filter(
      (job) =>
        (filter === "All" || job.status === filter) &&
        (query === "" ||
          job.customer.toLowerCase().includes(query) ||
          job.device.toLowerCase().includes(query))
    )
  }, [filter, search])

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Repair Jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage every repair ticket in the shop.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
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
                placeholder="Search customer or device"
                className="h-9 rounded-lg pl-8"
              />
            </div>
          </div>

          <div className="hidden grid-cols-[1.3fr_1fr_1fr_0.8fr_0.9fr_auto] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Customer</span>
            <span>Device</span>
            <span>Issue</span>
            <span>Technician</span>
            <span>Status</span>
            <span className="text-right">Price</span>
          </div>

          <RevealGroup className="divide-y divide-border">
            {filteredJobs.map((job) => (
              <RevealItem
                key={job.id}
                className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.9fr_auto] sm:items-center sm:gap-4"
              >
                <div>
                  <p className="font-medium text-foreground">{job.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.id} · Due {job.due}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{job.device}</span>
                <span className="text-sm text-muted-foreground">{job.issue}</span>
                <span className="text-sm text-muted-foreground">{job.tech}</span>
                <StatusBadge tone={job.tone} className="w-fit">
                  {job.status}
                </StatusBadge>
                <span className="font-semibold text-foreground sm:text-right">
                  {formatGBP(job.price)}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          {filteredJobs.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No jobs match your search.
            </p>
          )}
        </div>
      </Reveal>
    </div>
  )
}
