"use client"

import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <Button variant="ghost" size="icon-sm" aria-label="View details" onClick={onView}>
          <EyeIcon />
        </Button>
      )}
      <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={onEdit}>
        <PencilIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2Icon />
      </Button>
    </div>
  )
}
