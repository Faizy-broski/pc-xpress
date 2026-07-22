"use client"

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { usePrebuiltOrders } from "@/components/dashboard/store"
import { formatGBP } from "@/components/build-a-pc/data"

export default function PrebuiltBookingsPage() {
  const orders = usePrebuiltOrders()

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Pre-built PC Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders for off-the-shelf pre-built systems.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
          <div className="hidden grid-cols-[0.7fr_1fr_1.2fr_0.8fr_auto] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Product</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>
          <RevealGroup className="divide-y divide-border">
            {orders.map((order) => (
              <RevealItem
                key={order.id}
                className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[0.7fr_1fr_1.2fr_0.8fr_auto] sm:items-center sm:gap-4"
              >
                <div>
                  <p className="font-semibold text-muted-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <span className="font-medium text-foreground">{order.customer}</span>
                <span className="text-sm text-muted-foreground">{order.product}</span>
                <StatusBadge tone={order.tone} className="w-fit">
                  {order.status}
                </StatusBadge>
                <span className="font-bold text-foreground sm:text-right">
                  {formatGBP(order.total)}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Reveal>
    </div>
  )
}
