import type { StatusTone } from "@/components/dashboard/status-badge"
import type { RepairJob, CustomBuildOrder, PrebuiltOrder } from "@/components/dashboard/data"
import type { RecordField } from "@/components/dashboard/record-modal"

export type BookingModule = "Repairs" | "Custom Built" | "Pre-built"

export interface UnifiedBooking {
  id: string
  customer: string
  item: string
  module: BookingModule
  status: string
  tone: StatusTone
  date: string
  amount: number
}

export const MODULE_FILTERS = ["All", "Repairs", "Custom Built", "Pre-built"] as const

export interface StatusOption {
  value: string
  tone: StatusTone
}

export const REPAIR_STATUS_OPTIONS: StatusOption[] = [
  { value: "Pending", tone: "danger" },
  { value: "In Progress", tone: "warning" },
  { value: "On Hold", tone: "neutral" },
  { value: "Completed", tone: "success" },
]

export const CUSTOM_BUILD_STATUS_OPTIONS: StatusOption[] = [
  { value: "Processing", tone: "warning" },
  { value: "Shipped", tone: "info" },
  { value: "Delivered", tone: "success" },
]

export const PREBUILT_STATUS_OPTIONS: StatusOption[] = [
  { value: "Awaiting Payment", tone: "danger" },
  { value: "Building", tone: "neutral" },
  { value: "Processing", tone: "warning" },
  { value: "Dispatched", tone: "info" },
  { value: "Delivered", tone: "success" },
]

export function statusOptionsFor(module: BookingModule): StatusOption[] {
  switch (module) {
    case "Repairs":
      return REPAIR_STATUS_OPTIONS
    case "Custom Built":
      return CUSTOM_BUILD_STATUS_OPTIONS
    case "Pre-built":
      return PREBUILT_STATUS_OPTIONS
  }
}

export function repairJobToBooking(job: RepairJob): UnifiedBooking {
  return {
    id: job.id,
    customer: job.customer,
    item: `${job.device} · ${job.issue}`,
    module: "Repairs",
    status: job.status,
    tone: job.tone,
    date: job.due,
    amount: job.price,
  }
}

export function customBuildOrderToBooking(order: CustomBuildOrder): UnifiedBooking {
  return {
    id: order.id,
    customer: order.customer,
    item: order.build,
    module: "Custom Built",
    status: order.status,
    tone: order.tone,
    date: order.date,
    amount: order.total,
  }
}

export function prebuiltOrderToBooking(order: PrebuiltOrder): UnifiedBooking {
  return {
    id: order.id,
    customer: order.customer,
    item: order.product,
    module: "Pre-built",
    status: order.status,
    tone: order.tone,
    date: order.date,
    amount: order.total,
  }
}

export function repairJobFields(job: RepairJob): RecordField[] {
  return [
    { key: "id", label: "Job ID", value: job.id, editable: false },
    { key: "customer", label: "Customer", value: job.customer },
    { key: "device", label: "Device", value: job.device },
    { key: "issue", label: "Issue", value: job.issue, wide: true },
    { key: "tech", label: "Technician", value: job.tech },
    { key: "due", label: "Due date", value: job.due },
    {
      key: "status",
      label: "Status",
      value: job.status,
      type: "select",
      options: REPAIR_STATUS_OPTIONS.map((o) => o.value),
    },
    { key: "price", label: "Price (£)", value: String(job.price), type: "number" },
  ]
}

export function customBuildOrderFields(order: CustomBuildOrder): RecordField[] {
  return [
    { key: "id", label: "Order ID", value: order.id, editable: false },
    { key: "customer", label: "Customer", value: order.customer },
    { key: "build", label: "Build", value: order.build, wide: true },
    { key: "date", label: "Date", value: order.date },
    {
      key: "status",
      label: "Status",
      value: order.status,
      type: "select",
      options: CUSTOM_BUILD_STATUS_OPTIONS.map((o) => o.value),
    },
    { key: "total", label: "Total (£)", value: String(order.total), type: "number" },
  ]
}

export function prebuiltOrderFields(order: PrebuiltOrder): RecordField[] {
  const fields: RecordField[] = [
    { key: "id", label: "Order ID", value: order.id, editable: false },
    { key: "customer", label: "Customer", value: order.customer },
    { key: "product", label: "Product", value: order.product, wide: true },
    { key: "date", label: "Date", value: order.date },
    {
      key: "status",
      label: "Status",
      value: order.status,
      type: "select",
      options: PREBUILT_STATUS_OPTIONS.map((o) => o.value),
    },
    { key: "total", label: "Total (£)", value: String(order.total), type: "number" },
  ]

  // Only present on real Stripe checkout orders — older mock rows have none
  // of these, so they're appended rather than baked into the fixed list above.
  if (order.email) {
    fields.push({ key: "email", label: "Email", value: order.email, editable: false, wide: true })
  }
  if (order.phone) {
    fields.push({ key: "phone", label: "Phone", value: order.phone, editable: false })
  }
  if (order.address) {
    fields.push({ key: "address", label: "Shipping address", value: order.address, editable: false, wide: true })
  }

  return fields
}
