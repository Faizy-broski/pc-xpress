"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusDropdown } from "@/components/dashboard/status-dropdown"
import { RowActions } from "@/components/dashboard/row-actions"
import { RecordModal } from "@/components/dashboard/record-modal"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"
import { useRepairJobs, useRepairJobActions } from "@/components/dashboard/store"
import { REPAIR_STATUS_OPTIONS, repairJobFields } from "@/components/dashboard/bookings"
import type { RepairJob } from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

const FILTERS = ["All", "Pending", "In Progress", "Completed", "On Hold"] as const

const GRID_COLS = "grid-cols-[1.1fr_0.9fr_1fr_0.8fr_0.9fr_0.7fr_auto]"

export default function DashboardRepairsPage() {
  const repairJobs = useRepairJobs()
  const { updateRepairJob, removeRepairJob } = useRepairJobActions()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const [search, setSearch] = useState("")

  const [modalJob, setModalJob] = useState<RepairJob | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [deleteTarget, setDeleteTarget] = useState<RepairJob | null>(null)

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()
    return repairJobs.filter(
      (job) =>
        (filter === "All" || job.status === filter) &&
        (query === "" ||
          job.customer.toLowerCase().includes(query) ||
          job.device.toLowerCase().includes(query))
    )
  }, [repairJobs, filter, search])

  function handleSave(values: Record<string, string>) {
    if (!modalJob) return
    const statusOption = REPAIR_STATUS_OPTIONS.find((o) => o.value === values.status)
    updateRepairJob(modalJob.id, {
      customer: values.customer,
      device: values.device,
      issue: values.issue,
      tech: values.tech,
      due: values.due,
      status: values.status,
      tone: statusOption?.tone ?? modalJob.tone,
      price: Number(values.price) || 0,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Repair Jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage every repair ticket in the shop.
          </p>
        </div>
      </Reveal>

      <Reveal viewTrigger={false} delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
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

          <div className={cn("hidden gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid", GRID_COLS)}>
            <span>Customer</span>
            <span>Device</span>
            <span>Issue</span>
            <span>Technician</span>
            <span>Status</span>
            <span className="text-right">Price</span>
            <span></span>
          </div>

          <RevealGroup viewTrigger={false} className="divide-y divide-border">
            {filteredJobs.map((job) => (
              <RevealItem
                key={job.id}
                className={cn("flex flex-col gap-2 px-5 py-4 sm:grid sm:items-center sm:gap-4", GRID_COLS)}
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
                <StatusDropdown
                  value={job.status}
                  tone={job.tone}
                  options={REPAIR_STATUS_OPTIONS}
                  onChange={(status, tone) => updateRepairJob(job.id, { status, tone })}
                />
                <span className="font-semibold text-foreground sm:text-right">
                  {formatGBP(job.price)}
                </span>
                <RowActions
                  onView={() => {
                    setModalJob(job)
                    setModalMode("view")
                  }}
                  onEdit={() => {
                    setModalJob(job)
                    setModalMode("edit")
                  }}
                  onDelete={() => setDeleteTarget(job)}
                />
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

      <RecordModal
        open={modalJob !== null}
        mode={modalMode}
        title={modalMode === "edit" ? "Edit repair job" : "Repair job details"}
        subtitle={modalJob?.id}
        fields={modalJob ? repairJobFields(modalJob) : []}
        onClose={() => setModalJob(null)}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete repair job?"
        description={`This will permanently remove ${deleteTarget?.id} for ${deleteTarget?.customer}. This can't be undone.`}
        onConfirm={() => (deleteTarget ? removeRepairJob(deleteTarget.id) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
