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
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const slices = useMemo(() => {
    let cumulative = 0
    return data.map((d, i) => {
      const length = (d.percent / 100) * CIRCUMFERENCE
      const offset = -cumulative
      cumulative += length
      return { ...d, length, offset, color: SLOT_COLORS[i % SLOT_COLORS.length] }
    })
  }, [data])

  const active = activeIndex !== null ? slices[activeIndex] : null

  function handlePointerMove(event: React.PointerEvent<SVGCircleElement>, i: number) {
    const container = event.currentTarget.closest("[data-chart-container]") as HTMLElement | null
    if (!container) return
    const rect = container.getBoundingClientRect()
    setActiveIndex(i)
    setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4">
      <div data-chart-container className="relative shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={150}
          height={150}
          className="-rotate-90"
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
              className="cursor-pointer transition-opacity duration-150"
              onPointerMove={(event) => handlePointerMove(event, i)}
              onPointerLeave={() => {
                setActiveIndex(null)
                setTooltipPos(null)
              }}
            />
          ))}
        </svg>

        {active && tooltipPos && (
          <div
            className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-[calc(100%+10px)] items-center gap-1.5 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-popover-foreground shadow-card"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <span className="size-2 shrink-0 rounded-sm" style={{ background: active.color }} aria-hidden />
            {active.label}
            <span className="text-muted-foreground">{active.percent}%</span>
          </div>
        )}
      </div>

      <ul className="flex w-full min-w-0 flex-col gap-2">
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
            <span className="min-w-0 flex-1">{s.label}</span>
            <span className="shrink-0 text-muted-foreground">{s.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
