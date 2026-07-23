"use client"

import { useState } from "react"
import { BellIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const NOTIFICATION_PREFS = [
  {
    id: "job-updates",
    label: "Repair job updates",
    description: "Get notified when a job moves to the next status.",
    defaultChecked: true,
  },
  {
    id: "order-updates",
    label: "New PC orders",
    description: "Get notified when a customer places a custom build order.",
    defaultChecked: true,
  },
  {
    id: "stock-alerts",
    label: "Low stock alerts",
    description: "Get notified when a part drops below reorder level.",
    defaultChecked: true,
  },
]

export function ProfileSettingsForm({ name, email }: { name: string; email: string }) {
  const [saved, setSaved] = useState(false)

  return (
    <form
      className="rounded-xl border border-border bg-gradient-card p-5 shadow-card sm:p-6"
      onSubmit={(e) => {
        e.preventDefault()
        setSaved(true)
      }}
    >
      <h2 className="font-semibold text-foreground">Profile</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <UserIcon className="size-3.5" />
            Full name
          </span>
          <Input defaultValue={name} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <MailIcon className="size-3.5" />
            Email
          </span>
          <Input type="email" defaultValue={email} disabled />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <PhoneIcon className="size-3.5" />
            Phone
          </span>
          <Input type="tel" defaultValue="+44 7700 900123" />
        </label>
      </div>

      <Separator className="my-6" />

      <h2 className="flex items-center gap-1.5 font-semibold text-foreground">
        <BellIcon className="size-4" />
        Notifications
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {NOTIFICATION_PREFS.map((pref) => (
          <label key={pref.id} className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              defaultChecked={pref.defaultChecked}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span>
              <span className="block font-medium text-foreground">{pref.label}</span>
              <span className="text-muted-foreground">{pref.description}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <Button type="submit" className="rounded">
          Save changes
        </Button>
        {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
      </div>
    </form>
  )
}
