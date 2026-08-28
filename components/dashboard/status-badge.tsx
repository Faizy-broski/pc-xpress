import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TONES = {
  info: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  warning:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  danger: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  neutral: "bg-muted text-muted-foreground",
} as const

export type StatusTone = keyof typeof TONES

export function StatusBadge({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<typeof Badge> & { tone?: StatusTone }) {
  return (
    <Badge variant="soft" className={cn(TONES[tone], className)} {...props} />
  )
}
