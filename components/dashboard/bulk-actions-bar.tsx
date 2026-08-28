"use client"

import { Trash2Icon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function BulkActionsBar({
  count,
  onDelete,
  onClear,
}: {
  count: number
  onDelete: () => void
  onClear: () => void
}) {
  if (count === 0) return null

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-accent/60 px-5 py-2.5">
      <span className="text-sm font-medium text-foreground">
        {count} selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>
          <XIcon />
          Clear
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2Icon />
          Delete selected
        </Button>
      </div>
    </div>
  )
}
