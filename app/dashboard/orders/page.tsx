import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { ORDERS } from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

export default function DashboardOrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your custom builds and part purchases.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Total</span>
          </div>
          <RevealGroup className="divide-y divide-border">
            {ORDERS.map((order) => (
              <RevealItem
                key={order.id}
                className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4"
              >
                <div>
                  <p className="font-medium text-foreground">{order.items}</p>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {order.date}
                </span>
                <StatusBadge tone={order.tone} className="w-fit">
                  {order.status}
                </StatusBadge>
                <span className="font-semibold text-foreground sm:text-right">
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
