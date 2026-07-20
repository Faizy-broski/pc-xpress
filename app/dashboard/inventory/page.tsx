import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { INVENTORY } from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

export default function DashboardInventoryPage() {
  const lowStockCount = INVENTORY.filter((p) => p.statusLabel !== "In Stock").length

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Inventory
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Parts stock levels and reorder status.
            </p>
          </div>
          {lowStockCount > 0 && (
            <span className="text-xs font-semibold text-destructive">
              {lowStockCount} item{lowStockCount === 1 ? "" : "s"} need attention
            </span>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.6fr_0.7fr_auto] gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid">
            <span>Part</span>
            <span>Category</span>
            <span>SKU</span>
            <span className="text-center">Stock</span>
            <span className="text-right">Unit price</span>
            <span>Status</span>
          </div>
          <RevealGroup className="divide-y divide-border">
            {INVENTORY.map((part) => (
              <RevealItem
                key={part.id}
                className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[1.4fr_1fr_1fr_0.6fr_0.7fr_auto] sm:items-center sm:gap-4"
              >
                <span className="font-medium text-foreground">{part.name}</span>
                <span className="text-sm text-muted-foreground">{part.category}</span>
                <span className="text-sm text-muted-foreground">{part.sku}</span>
                <span className="text-sm font-semibold text-foreground sm:text-center">
                  {part.stock}
                </span>
                <span className="text-sm font-semibold text-foreground sm:text-right">
                  {formatGBP(part.price)}
                </span>
                <StatusBadge tone={part.tone} className="w-fit">
                  {part.statusLabel}
                </StatusBadge>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Reveal>
    </div>
  )
}
