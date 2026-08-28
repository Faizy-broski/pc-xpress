"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusDropdown } from "@/components/dashboard/status-dropdown"
import { RowActions } from "@/components/dashboard/row-actions"
import { RecordModal, type RecordField } from "@/components/dashboard/record-modal"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"
import {
  useRepairJobs,
  useRepairJobActions,
  useCustomBuildOrders,
  useCustomBuildOrderActions,
  usePrebuiltOrders,
  usePrebuiltOrderActions,
} from "@/components/dashboard/store"
import {
  MODULE_FILTERS,
  repairJobToBooking,
  customBuildOrderToBooking,
  prebuiltOrderToBooking,
  statusOptionsFor,
  repairJobFields,
  customBuildOrderFields,
  prebuiltOrderFields,
  type UnifiedBooking,
} from "@/components/dashboard/bookings"
import type { StatusTone } from "@/components/dashboard/status-badge"
import { formatGBP } from "@/components/build-a-pc/data"

const GRID_COLS = "grid-cols-[1fr_1.2fr_0.8fr_0.85fr_0.8fr_0.7fr_auto]"

export default function DashboardAllBookingsPage() {
  const repairJobs = useRepairJobs()
  const { updateRepairJob, removeRepairJob } = useRepairJobActions()
  const customBuildOrders = useCustomBuildOrders()
  const { updateCustomBuildOrder, removeCustomBuildOrder } = useCustomBuildOrderActions()
  const prebuiltOrders = usePrebuiltOrders()
  const { updatePrebuiltOrder, removePrebuiltOrder } = usePrebuiltOrderActions()

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

  const [modalBooking, setModalBooking] = useState<UnifiedBooking | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [deleteTarget, setDeleteTarget] = useState<UnifiedBooking | null>(null)

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

  function updateStatus(booking: UnifiedBooking, status: string, tone: StatusTone) {
    if (booking.module === "Repairs") updateRepairJob(booking.id, { status, tone })
    else if (booking.module === "Custom Built") updateCustomBuildOrder(booking.id, { status, tone })
    else updatePrebuiltOrder(booking.id, { status, tone })
  }

  function removeBooking(booking: UnifiedBooking) {
    if (booking.module === "Repairs") return removeRepairJob(booking.id)
    if (booking.module === "Custom Built") return removeCustomBuildOrder(booking.id)
    return removePrebuiltOrder(booking.id)
  }

  function fieldsForBooking(booking: UnifiedBooking): RecordField[] {
    if (booking.module === "Repairs") {
      const job = repairJobs.find((j) => j.id === booking.id)
      return job ? repairJobFields(job) : []
    }
    if (booking.module === "Custom Built") {
      const order = customBuildOrders.find((o) => o.id === booking.id)
      return order ? customBuildOrderFields(order) : []
    }
    const order = prebuiltOrders.find((o) => o.id === booking.id)
    return order ? prebuiltOrderFields(order) : []
  }

  function handleSave(values: Record<string, string>) {
    if (!modalBooking) return
    const options = statusOptionsFor(modalBooking.module)
    const statusOption = options.find((o) => o.value === values.status)
    const tone = statusOption?.tone ?? modalBooking.tone

    if (modalBooking.module === "Repairs") {
      return updateRepairJob(modalBooking.id, {
        customer: values.customer,
        device: values.device,
        issue: values.issue,
        tech: values.tech,
        due: values.due,
        status: values.status,
        tone,
        price: Number(values.price) || 0,
      })
    }
    if (modalBooking.module === "Custom Built") {
      return updateCustomBuildOrder(modalBooking.id, {
        customer: values.customer,
        build: values.build,
        date: values.date,
        status: values.status,
        tone,
        total: Number(values.total) || 0,
      })
    }
    return updatePrebuiltOrder(modalBooking.id, {
      customer: values.customer,
      product: values.product,
      date: values.date,
      status: values.status,
      tone,
      total: Number(values.total) || 0,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            All Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every repair job and PC order across the shop, in one place.
          </p>
        </div>
      </Reveal>

      <Reveal viewTrigger={false} delay={0.05}>
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

          <div className={cn("hidden gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid", GRID_COLS)}>
            <span>Customer</span>
            <span>Item</span>
            <span>Module</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
            <span></span>
          </div>

          <RevealGroup viewTrigger={false} className="divide-y divide-border">
            {filteredBookings.map((booking) => (
              <RevealItem
                key={`${booking.module}-${booking.id}`}
                className={cn("flex flex-col gap-2 px-5 py-4 sm:grid sm:items-center sm:gap-4", GRID_COLS)}
              >
                <div>
                  <p className="font-medium text-foreground">{booking.customer}</p>
                  <p className="text-xs text-muted-foreground">{booking.id}</p>
                </div>
                <span className="text-sm text-muted-foreground">{booking.item}</span>
                <Badge variant="soft" className="w-fit">
                  {booking.module}
                </Badge>
                <StatusDropdown
                  value={booking.status}
                  tone={booking.tone}
                  options={statusOptionsFor(booking.module)}
                  onChange={(status, tone) => updateStatus(booking, status, tone)}
                />
                <span className="text-sm text-muted-foreground">{booking.date}</span>
                <span className="font-semibold text-foreground sm:text-right">
                  {formatGBP(booking.amount)}
                </span>
                <RowActions
                  onView={() => {
                    setModalBooking(booking)
                    setModalMode("view")
                  }}
                  onEdit={() => {
                    setModalBooking(booking)
                    setModalMode("edit")
                  }}
                  onDelete={() => setDeleteTarget(booking)}
                />
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

      <RecordModal
        open={modalBooking !== null}
        mode={modalMode}
        title={modalMode === "edit" ? "Edit booking" : "Booking details"}
        subtitle={modalBooking ? `${modalBooking.module} · ${modalBooking.id}` : undefined}
        fields={modalBooking ? fieldsForBooking(modalBooking) : []}
        onClose={() => setModalBooking(null)}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete booking?"
        description={`This will permanently remove ${deleteTarget?.id} for ${deleteTarget?.customer}. This can't be undone.`}
        onConfirm={() => (deleteTarget ? removeBooking(deleteTarget) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
