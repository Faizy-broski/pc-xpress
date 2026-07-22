"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { CatalogIcon, ICON_NAMES, type IconName } from "@/components/icons/icon-registry"
import { useDeviceTypeCatalog, useFaultsCatalog } from "@/components/dashboard/store"
import { type DeviceTypeId } from "@/components/repair/data"
import { formatGBP } from "@/components/build-a-pc/data"

const fieldClass =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

const labelClass = "mb-1 block text-xs font-medium text-muted-foreground"

const TIERS = ["Device Types", "Brands", "Services"] as const

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function IconPicker({ value, onChange }: { value: IconName; onChange: (name: IconName) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ICON_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          aria-label={name}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border transition-colors",
            value === name
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <CatalogIcon name={name} className="size-4" />
        </button>
      ))}
    </div>
  )
}

function DeviceTypeTierForm() {
  const { deviceTypes, addDeviceType } = useDeviceTypeCatalog()

  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState<IconName>(ICON_NAMES[0])

  const isValid = label.trim().length > 0 && description.trim().length > 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid) return

    addDeviceType({
      id: `${slugify(label)}-${Date.now().toString(36)}`,
      label: label.trim(),
      description: description.trim(),
      icon,
    })

    setLabel("")
    setDescription("")
    setIcon(ICON_NAMES[0])
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <Reveal delay={0.1}>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Current device types</h2>
          </div>
          <RevealGroup key={deviceTypes.map((d) => d.id).join(",")} className="divide-y divide-border">
            {deviceTypes.map((device) => (
              <RevealItem key={device.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <CatalogIcon name={device.icon} className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{device.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{device.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3.5 rounded-xl border border-border bg-gradient-card p-5 shadow-card"
        >
          <div>
            <label className={labelClass}>Device type name</label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Smartwatch" required />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Apple Watch, Galaxy Watch & more"
              className={cn(fieldClass, "h-auto resize-none py-2")}
            />
          </div>
          <div>
            <label className={labelClass}>Icon</label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>

          <Button type="submit" size="lg" disabled={!isValid} className="mt-1">
            <PlusIcon />
            Add Device Type
          </Button>
        </form>
      </Reveal>
    </div>
  )
}

function BrandsTierForm() {
  const { deviceTypes, brands, addBrand } = useDeviceTypeCatalog()
  const [deviceId, setDeviceId] = useState<DeviceTypeId>(deviceTypes[0].id)
  const [label, setLabel] = useState("")

  const isValid = label.trim().length > 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid) return

    addBrand(deviceId, { id: slugify(label), label: label.trim() })
    setLabel("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {deviceTypes.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => setDeviceId(device.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              deviceId === device.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <CatalogIcon name={device.icon} className="size-3.5" />
            {device.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">
                Current brands — {deviceTypes.find((d) => d.id === deviceId)?.label}
              </h2>
            </div>
            <RevealGroup
              key={(brands[deviceId] ?? []).map((b) => b.id).join(",")}
              className="divide-y divide-border"
            >
              {(brands[deviceId] ?? []).map((brand) => (
                <RevealItem key={brand.id} className="px-5 py-3.5">
                  <p className="font-medium text-foreground">{brand.label}</p>
                </RevealItem>
              ))}
              {(brands[deviceId] ?? []).length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No brands yet for this device type.
                </p>
              )}
            </RevealGroup>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3.5 rounded-xl border border-border bg-gradient-card p-5 shadow-card"
          >
            <div>
              <label className={labelClass}>Brand name</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Garmin" required />
            </div>
            <Button type="submit" size="lg" disabled={!isValid} className="mt-1">
              <PlusIcon />
              Add Brand
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  )
}

function ServicesTierForm() {
  const { deviceTypes } = useDeviceTypeCatalog()
  const { faults, addFault } = useFaultsCatalog()
  const [deviceId, setDeviceId] = useState<DeviceTypeId>(deviceTypes[0].id)

  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [priceFrom, setPriceFrom] = useState("")
  const [etaLabel, setEtaLabel] = useState("")

  const priceValue = Number(priceFrom)
  const isValid =
    label.trim().length > 0 &&
    description.trim().length > 0 &&
    priceFrom.trim().length > 0 &&
    priceValue > 0 &&
    etaLabel.trim().length > 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid) return

    addFault(deviceId, {
      id: `${slugify(label)}-${Date.now().toString(36)}`,
      label: label.trim(),
      description: description.trim(),
      priceFrom: priceValue,
      etaLabel: etaLabel.trim(),
    })

    setLabel("")
    setDescription("")
    setPriceFrom("")
    setEtaLabel("")
  }

  const currentFaults = faults[deviceId] ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {deviceTypes.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => setDeviceId(device.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              deviceId === device.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <CatalogIcon name={device.icon} className="size-3.5" />
            {device.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">
                Current services — {deviceTypes.find((d) => d.id === deviceId)?.label}
              </h2>
            </div>
            <RevealGroup key={currentFaults.map((f) => f.id).join(",")} className="divide-y divide-border">
              {currentFaults.map((fault) => (
                <RevealItem key={fault.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{fault.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{fault.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-foreground">From {formatGBP(fault.priceFrom)}</p>
                    <p className="text-xs text-muted-foreground">{fault.etaLabel}</p>
                  </div>
                </RevealItem>
              ))}
              {currentFaults.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No services yet for this device type.
                </p>
              )}
            </RevealGroup>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3.5 rounded-xl border border-border bg-gradient-card p-5 shadow-card"
          >
            <div>
              <label className={labelClass}>Service name</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Speaker Replacement" required />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Short summary shown to customers on the repair wizard..."
                className={cn(fieldClass, "h-auto resize-none py-2")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Price from (£)</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  placeholder="45"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Turnaround / ETA</label>
                <Input value={etaLabel} onChange={(e) => setEtaLabel(e.target.value)} placeholder="Same day" required />
              </div>
            </div>

            <Button type="submit" size="lg" disabled={!isValid} className="mt-1">
              <PlusIcon />
              Add Service
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  )
}

export default function RepairsCatalogPage() {
  const [tier, setTier] = useState<(typeof TIERS)[number]>("Device Types")

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Repairs Catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the device types, brands, and repair services customers can book.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="flex flex-wrap gap-1.5">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                tier === t
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Reveal>

      {tier === "Device Types" && <DeviceTypeTierForm />}
      {tier === "Brands" && <BrandsTierForm />}
      {tier === "Services" && <ServicesTierForm />}
    </div>
  )
}
