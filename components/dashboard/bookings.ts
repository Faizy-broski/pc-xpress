import type { StatusTone } from "@/components/dashboard/status-badge"
import type { RepairJob, CustomBuildOrder, PrebuiltOrder } from "@/components/dashboard/data"

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
