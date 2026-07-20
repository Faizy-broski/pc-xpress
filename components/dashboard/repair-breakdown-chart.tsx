"use client"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import type { RepairTypeShare } from "@/components/dashboard/data"

const SIZE = 180
const RADIUS = 70
const STROKE = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const SLOT_COLORS = [
  "var(--viz-cat-1)",
  "var(--viz-cat-2)",
  "var(--viz-cat-3)",
  "var(--viz-cat-4)",
  "var(--viz-cat-5)",
  "var(--viz-cat-6)",
]

export function RepairBreakdownChart({ data }: { data: RepairTypeShare[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const slices = useMemo(() => {
    let cumulative = 0
    return data.map((d, i) => {
      const length = (d.percent / 100) * CIRCUMFERENCE
      const offset = -cumulative
      cumulative += length
      return { ...d, length, offset, color: SLOT_COLORS[i % SLOT_COLORS.length] }
    })
  }, [data])

  return (
    <div className="flex w-full min-w-0 flex-wrap items-center gap-5">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={150}
        height={150}
        className="shrink-0 -rotate-90"
        role="img"
        aria-label="Repair type breakdown"
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth={STROKE} />
        {slices.map((s, i) => (
          <circle
            key={s.label}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={s.color}
            strokeWidth={STROKE}
            strokeDasharray={`${s.length} ${CIRCUMFERENCE - s.length}`}
            strokeDashoffset={s.offset}
            opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
            className="transition-opacity duration-150"
            onPointerEnter={() => setActiveIndex(i)}
            onPointerLeave={() => setActiveIndex(null)}
          />
        ))}
      </svg>

      <ul className="flex min-w-0 flex-1 flex-col gap-2">
        {slices.map((s, i) => (
          <li
            key={s.label}
            className={cn(
              "flex min-w-0 items-center gap-2 rounded px-1 text-[12.5px] text-foreground transition-opacity",
              activeIndex !== null && activeIndex !== i && "opacity-40"
            )}
            onPointerEnter={() => setActiveIndex(i)}
            onPointerLeave={() => setActiveIndex(null)}
          >
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ background: s.color }}
              aria-hidden
            />
            <span className="min-w-0 truncate">{s.label}</span>
            <span className="shrink-0 text-muted-foreground">{s.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
