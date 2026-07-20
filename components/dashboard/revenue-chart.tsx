"use client"

import { useId, useMemo, useState } from "react"

import { formatGBP } from "@/components/build-a-pc/data"
import type { RevenuePoint } from "@/components/dashboard/data"

const WIDTH = 560
const HEIGHT = 220
const TOP_PAD = 14
const BASELINE = 200

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const points = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value)) * 1.08
    return data.map((d, i) => ({
      ...d,
      x: (i / (data.length - 1)) * WIDTH,
      y: BASELINE - (d.value / max) * (BASELINE - TOP_PAD),
    }))
  }, [data])

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ")
  const areaPath = `${linePath} L${WIDTH},${BASELINE} L0,${BASELINE} Z`

  const active = hoverIndex !== null ? points[hoverIndex] : null

  function handleMove(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const index = Math.round(ratio * (points.length - 1))
    setHoverIndex(Math.min(Math.max(index, 0), points.length - 1))
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height={HEIGHT}
        preserveAspectRatio="none"
        role="img"
        aria-label="Revenue over the last 12 months"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line x1="0" y1={BASELINE} x2={WIDTH} y2={BASELINE} stroke="var(--border)" strokeWidth="1" />
        <line x1="0" y1={BASELINE - (BASELINE - TOP_PAD) * 0.5} x2={WIDTH} y2={BASELINE - (BASELINE - TOP_PAD) * 0.5} stroke="var(--border)" strokeWidth="1" />
        <line x1="0" y1={TOP_PAD} x2={WIDTH} y2={TOP_PAD} stroke="var(--border)" strokeWidth="1" />

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {active && (
          <line
            x1={active.x}
            y1={TOP_PAD}
            x2={active.x}
            y2={BASELINE}
            stroke="var(--border)"
            strokeWidth="1"
          />
        )}

        {points.map((p, i) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={p.y}
            r={hoverIndex === i ? 4.5 : 0}
            fill="var(--primary)"
            className="transition-[r] duration-100"
          />
        ))}

        <rect
          x="0"
          y="0"
          width={WIDTH}
          height={HEIGHT}
          fill="transparent"
          onPointerMove={handleMove}
          onPointerLeave={() => setHoverIndex(null)}
        />
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute top-1 -translate-x-1/2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-card"
          style={{ left: `${(active.x / WIDTH) * 100}%` }}
        >
          <p className="font-semibold text-popover-foreground">{formatGBP(active.value)}</p>
          <p className="text-muted-foreground">{active.label}</p>
        </div>
      )}

      <div className="mt-1 flex justify-between px-0.5 text-[11px] text-muted-foreground">
        {points.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </div>
  )
}
