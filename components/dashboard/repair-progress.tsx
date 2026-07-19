"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { REPAIR_STEPS } from "@/components/dashboard/data"

const EASE = [0.22, 1, 0.36, 1] as const

export function RepairProgressBar({
  currentStep,
  className,
}: {
  currentStep: number
  className?: string
}) {
  const progress = (currentStep / (REPAIR_STEPS.length - 1)) * 100

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        className="h-full rounded-full bg-primary"
      />
    </div>
  )
}

export function RepairStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex w-full items-center">
      {REPAIR_STEPS.map((step, index) => {
        const done = index <= currentStep
        const isLast = index === REPAIR_STEPS.length - 1

        return (
          <li key={step} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-1.5">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08, ease: EASE }}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold",
                  done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </motion.span>
              <span
                className={cn(
                  "hidden text-center text-[0.7rem] whitespace-nowrap sm:block",
                  done ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div className="mx-1.5 h-px flex-1 overflow-hidden bg-muted">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: index < currentStep ? 1 : 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 + 0.1, ease: EASE }}
                  style={{ transformOrigin: "left" }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
