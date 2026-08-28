"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusDropdown } from "@/components/dashboard/status-dropdown"
import { RowActions } from "@/components/dashboard/row-actions"
import { RecordModal } from "@/components/dashboard/record-modal"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"
import { useCustomBuildOrders, useCustomBuildOrderActions } from "@/components/dashboard/store"
import { CUSTOM_BUILD_STATUS_OPTIONS, customBuildOrderFields } from "@/components/dashboard/bookings"
import type { CustomBuildOrder } from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

const GRID_COLS = "grid-cols-[0.7fr_1fr_1.1fr_0.8fr_0.7fr_auto]"

export default function CustomBuiltBookingsPage() {
  const orders = useCustomBuildOrders()
  const { updateCustomBuildOrder, removeCustomBuildOrder } = useCustomBuildOrderActions()

  const [modalOrder, setModalOrder] = useState<CustomBuildOrder | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [deleteTarget, setDeleteTarget] = useState<CustomBuildOrder | null>(null)

  function handleSave(values: Record<string, string>) {
    if (!modalOrder) return
    const statusOption = CUSTOM_BUILD_STATUS_OPTIONS.find((o) => o.value === values.status)
    updateCustomBuildOrder(modalOrder.id, {
      customer: values.customer,
      build: values.build,
      date: values.date,
      status: values.status,
      tone: statusOption?.tone ?? modalOrder.tone,
      total: Number(values.total) || 0,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Custom Built Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders for customer-configured PC builds.
          </p>
        </div>
      </Reveal>

      <Reveal viewTrigger={false} delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
          <div className={cn("hidden gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid", GRID_COLS)}>
            <span>Order</span>
            <span>Customer</span>
            <span>Build</span>
            <span>Status</span>
            <span className="text-right">Total</span>
            <span></span>
          </div>
          <RevealGroup viewTrigger={false} className="divide-y divide-border">
            {orders.map((order) => (
              <RevealItem
                key={order.id}
                className={cn("flex flex-col gap-2 px-5 py-4 sm:grid sm:items-center sm:gap-4", GRID_COLS)}
              >
                <div>
                  <p className="font-semibold text-muted-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <span className="font-medium text-foreground">{order.customer}</span>
                <span className="text-sm text-muted-foreground">{order.build}</span>
                <StatusDropdown
                  value={order.status}
                  tone={order.tone}
                  options={CUSTOM_BUILD_STATUS_OPTIONS}
                  onChange={(status, tone) => updateCustomBuildOrder(order.id, { status, tone })}
                />
                <span className="font-bold text-foreground sm:text-right">
                  {formatGBP(order.total)}
                </span>
                <RowActions
                  onView={() => {
                    setModalOrder(order)
                    setModalMode("view")
                  }}
                  onEdit={() => {
                    setModalOrder(order)
                    setModalMode("edit")
                  }}
                  onDelete={() => setDeleteTarget(order)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Reveal>

      <RecordModal
        open={modalOrder !== null}
        mode={modalMode}
        title={modalMode === "edit" ? "Edit custom build order" : "Custom build order details"}
        subtitle={modalOrder?.id}
        fields={modalOrder ? customBuildOrderFields(modalOrder) : []}
        onClose={() => setModalOrder(null)}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete order?"
        description={`This will permanently remove ${deleteTarget?.id} for ${deleteTarget?.customer}. This can't be undone.`}
        onConfirm={() => (deleteTarget ? removeCustomBuildOrder(deleteTarget.id) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
