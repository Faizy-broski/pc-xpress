import { StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { CUSTOMERS } from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

export default function DashboardCustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your customer relationships at a glance.
          </p>
        </div>
      </Reveal>

      <RevealGroup
        viewTrigger={false}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {CUSTOMERS.map((customer) => (
          <RevealItem
            key={customer.id}
            className="rounded-xl border border-border bg-gradient-card p-4 shadow-card sm:p-5 lg:p-6"
          >
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-foreground text-background">
                  {customer.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                  {customer.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3.5">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  DEVICES
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {customer.devices}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  TOTAL SPENT
                </p>
                <p className="mt-0.5 text-sm font-semibold text-primary">
                  {formatGBP(customer.spent)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  LAST VISIT
                </p>
                <p className="mt-0.5 text-sm text-foreground">
                  {customer.lastVisit}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  RATING
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-foreground">
                  <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
                  {customer.rating.toFixed(1)}
                </p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
