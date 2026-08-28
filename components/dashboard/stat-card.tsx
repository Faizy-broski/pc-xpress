"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

export function StatCard({
  icon,
  label,
  value,
  hint,
  className,
}: {
  icon: ReactNode
  label: string
  value: string
  hint?: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={cn(
        "rounded-xl border border-border bg-gradient-card p-4 shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-glow">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  )
}
