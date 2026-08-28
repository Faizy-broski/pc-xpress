"use client"

import { ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge, type StatusTone } from "@/components/dashboard/status-badge"
import type { StatusOption } from "@/components/dashboard/bookings"

export function StatusDropdown({
  value,
  tone,
  options,
  onChange,
}: {
  value: string
  tone: StatusTone
  options: StatusOption[]
  onChange: (value: string, tone: StatusTone) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" className="w-fit" />}>
        <StatusBadge tone={tone} className="cursor-pointer gap-1 pr-1.5 hover:opacity-80">
          {value}
          <ChevronDownIcon className="size-3" />
        </StatusBadge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            const option = options.find((o) => o.value === next)
            if (option) onChange(option.value, option.tone)
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
              {option.value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
