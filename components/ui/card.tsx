import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * Global surface card. Fully responsive padding (xs -> 2xl) around the
 * shared border/gradient/shadow treatment used across the dashboard.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-gradient-card p-4 shadow-card sm:p-5 lg:p-6",
        className
      )}
      {...props}
    />
  )
}
