import Link from "next/link"
import { MessageCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { RepairStepper } from "@/components/dashboard/repair-progress"
import { REPAIRS, REPAIR_STEPS } from "@/components/dashboard/data"

export default function DashboardRepairsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Repairs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live status for every device you&apos;ve sent in.
          </p>
        </div>
      </Reveal>

      <RevealGroup className="flex flex-col gap-4">
        {REPAIRS.map((repair) => (
          <RevealItem
            key={repair.id}
            className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {repair.device}
                </p>
                <p className="text-sm text-muted-foreground">
                  {repair.issue}
                </p>
              </div>
              <StatusBadge tone={repair.tone} className="shrink-0">
                {REPAIR_STEPS[repair.currentStep]}
              </StatusBadge>
            </div>

            <div className="mt-6">
              <RepairStepper currentStep={repair.currentStep} />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
              <span>
                {repair.id} · Submitted {repair.submitted} · ETA {repair.eta}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="rounded"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                <MessageCircleIcon />
                Ask about this repair
              </Button>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
