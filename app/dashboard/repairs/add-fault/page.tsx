"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { CatalogIcon } from "@/components/icons/icon-registry"
import { RowActions } from "@/components/dashboard/row-actions"
import { BulkActionsBar } from "@/components/dashboard/bulk-actions-bar"
import { RecordModal, type RecordField } from "@/components/dashboard/record-modal"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"
import { useDeviceTypeCatalog, useFaultsCatalog } from "@/components/dashboard/store"
import { type Brand, type DeviceTypeId, type Fault } from "@/components/repair/data"
import { formatGBP } from "@/components/build-a-pc/data"

const fieldClass =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

const labelClass = "mb-1 block text-xs font-medium text-muted-foreground"

const TIERS = ["Brands", "Services"] as const

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function useSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll(ids: string[]) {
    setSelectedIds((prev) => (prev.size === ids.length ? new Set() : new Set(ids)))
  }

  function clear() {
    setSelectedIds(new Set())
  }

  return { selectedIds, toggle, toggleAll, clear, setSelectedIds }
}

function SelectAllCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-input accent-primary"
      />
      Select all
    </label>
  )
}

function RowCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="size-4 shrink-0 rounded border-input accent-primary"
    />
  )
}

function brandFields(brand: Brand): RecordField[] {
  return [{ key: "label", label: "Brand name", value: brand.label }]
}

function faultFields(fault: Fault): RecordField[] {
  return [
    { key: "label", label: "Service name", value: fault.label },
    { key: "description", label: "Description", value: fault.description, wide: true },
    { key: "priceFrom", label: "Price from (£)", value: String(fault.priceFrom), type: "number" },
    { key: "etaLabel", label: "Turnaround / ETA", value: fault.etaLabel },
  ]
}

function BrandsTierForm() {
  const { deviceTypes, brands, addBrand, updateBrand, removeBrand } = useDeviceTypeCatalog()
  const [deviceId, setDeviceId] = useState<DeviceTypeId>(deviceTypes[0].id)
  const [label, setLabel] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selection = useSelection()
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const isValid = label.trim().length > 0
  const currentBrands = brands[deviceId] ?? []

  function selectDevice(id: DeviceTypeId) {
    setDeviceId(id)
    selection.clear()
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid) return

    setSubmitting(true)
    setError(null)
    try {
      await addBrand(deviceId, { id: slugify(label), label: label.trim() })
      setLabel("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the brand.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleSaveEdit(values: Record<string, string>) {
    if (!editingBrand) return Promise.resolve()
    return updateBrand(deviceId, editingBrand.id, { label: values.label })
  }

  async function handleBulkDelete() {
    await Promise.all([...selection.selectedIds].map((id) => removeBrand(deviceId, id)))
    selection.clear()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {deviceTypes.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => selectDevice(device.id)}
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
        <Reveal viewTrigger={false} delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">
                Current brands — {deviceTypes.find((d) => d.id === deviceId)?.label}
              </h2>
              {currentBrands.length > 0 && (
                <SelectAllCheckbox
                  checked={selection.selectedIds.size === currentBrands.length}
                  onChange={() => selection.toggleAll(currentBrands.map((b) => b.id))}
                />
              )}
            </div>
            <BulkActionsBar
              count={selection.selectedIds.size}
              onClear={selection.clear}
              onDelete={() => setBulkConfirmOpen(true)}
            />
            <RevealGroup viewTrigger={false} className="divide-y divide-border">
              {currentBrands.map((brand) => (
                <RevealItem key={brand.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <RowCheckbox
                      checked={selection.selectedIds.has(brand.id)}
                      onChange={() => selection.toggle(brand.id)}
                    />
                    <p className="font-medium text-foreground">{brand.label}</p>
                  </div>
                  <RowActions
                    onEdit={() => setEditingBrand(brand)}
                    onDelete={() => setDeleteTarget(brand)}
                  />
                </RevealItem>
              ))}
              {currentBrands.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No brands yet for this device type.
                </p>
              )}
            </RevealGroup>
          </div>
        </Reveal>

        <Reveal viewTrigger={false} delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3.5 rounded-xl border border-border bg-gradient-card p-5 shadow-card"
          >
            <div>
              <label className={labelClass}>Brand name</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Garmin" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" disabled={!isValid || submitting} className="mt-1">
              <PlusIcon />
              {submitting ? "Adding…" : "Add Brand"}
            </Button>
          </form>
        </Reveal>
      </div>

      <RecordModal
        open={editingBrand !== null}
        mode="edit"
        title="Edit brand"
        subtitle={editingBrand?.label}
        fields={editingBrand ? brandFields(editingBrand) : []}
        onClose={() => setEditingBrand(null)}
        onSave={handleSaveEdit}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete brand?"
        description={`This will permanently remove "${deleteTarget?.label}". This can't be undone.`}
        onConfirm={() => (deleteTarget ? removeBrand(deviceId, deleteTarget.id) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDeleteDialog
        open={bulkConfirmOpen}
        title="Delete selected brands?"
        description={`This will permanently remove ${selection.selectedIds.size} brand${selection.selectedIds.size === 1 ? "" : "s"}. This can't be undone.`}
        onConfirm={handleBulkDelete}
        onClose={() => setBulkConfirmOpen(false)}
      />
    </div>
  )
}

function ServicesTierForm() {
  const { deviceTypes } = useDeviceTypeCatalog()
  const { faults, addFault, updateFault, removeFault } = useFaultsCatalog()
  const [deviceId, setDeviceId] = useState<DeviceTypeId>(deviceTypes[0].id)

  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [priceFrom, setPriceFrom] = useState("")
  const [etaLabel, setEtaLabel] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selection = useSelection()
  const [editingFault, setEditingFault] = useState<Fault | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Fault | null>(null)
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const priceValue = Number(priceFrom)
  const isValid =
    label.trim().length > 0 &&
    description.trim().length > 0 &&
    priceFrom.trim().length > 0 &&
    priceValue > 0 &&
    etaLabel.trim().length > 0

  function selectDevice(id: DeviceTypeId) {
    setDeviceId(id)
    selection.clear()
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid) return

    setSubmitting(true)
    setError(null)
    try {
      await addFault(deviceId, {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the service.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleSaveEdit(values: Record<string, string>) {
    if (!editingFault) return Promise.resolve()
    return updateFault(deviceId, editingFault.id, {
      label: values.label,
      description: values.description,
      priceFrom: Number(values.priceFrom) || 0,
      etaLabel: values.etaLabel,
    })
  }

  async function handleBulkDelete() {
    await Promise.all([...selection.selectedIds].map((id) => removeFault(deviceId, id)))
    selection.clear()
  }

  const currentFaults = faults[deviceId] ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {deviceTypes.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => selectDevice(device.id)}
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
        <Reveal viewTrigger={false} delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">
                Current services — {deviceTypes.find((d) => d.id === deviceId)?.label}
              </h2>
              {currentFaults.length > 0 && (
                <SelectAllCheckbox
                  checked={selection.selectedIds.size === currentFaults.length}
                  onChange={() => selection.toggleAll(currentFaults.map((f) => f.id))}
                />
              )}
            </div>
            <BulkActionsBar
              count={selection.selectedIds.size}
              onClear={selection.clear}
              onDelete={() => setBulkConfirmOpen(true)}
            />
            <RevealGroup viewTrigger={false} className="divide-y divide-border">
              {currentFaults.map((fault) => (
                <RevealItem key={fault.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <RowCheckbox
                      checked={selection.selectedIds.has(fault.id)}
                      onChange={() => selection.toggle(fault.id)}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{fault.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{fault.description}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">From {formatGBP(fault.priceFrom)}</p>
                      <p className="text-xs text-muted-foreground">{fault.etaLabel}</p>
                    </div>
                    <RowActions
                      onEdit={() => setEditingFault(fault)}
                      onDelete={() => setDeleteTarget(fault)}
                    />
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

        <Reveal viewTrigger={false} delay={0.15}>
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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" disabled={!isValid || submitting} className="mt-1">
              <PlusIcon />
              {submitting ? "Adding…" : "Add Service"}
            </Button>
          </form>
        </Reveal>
      </div>

      <RecordModal
        open={editingFault !== null}
        mode="edit"
        title="Edit service"
        subtitle={editingFault?.label}
        fields={editingFault ? faultFields(editingFault) : []}
        onClose={() => setEditingFault(null)}
        onSave={handleSaveEdit}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete service?"
        description={`This will permanently remove "${deleteTarget?.label}". This can't be undone.`}
        onConfirm={() => (deleteTarget ? removeFault(deviceId, deleteTarget.id) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDeleteDialog
        open={bulkConfirmOpen}
        title="Delete selected services?"
        description={`This will permanently remove ${selection.selectedIds.size} service${selection.selectedIds.size === 1 ? "" : "s"}. This can't be undone.`}
        onConfirm={handleBulkDelete}
        onClose={() => setBulkConfirmOpen(false)}
      />
    </div>
  )
}

export default function RepairsCatalogPage() {
  const [tier, setTier] = useState<(typeof TIERS)[number]>("Brands")

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Repairs Catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the device types, brands, and repair services customers can book.
          </p>
        </div>
      </Reveal>

      <Reveal viewTrigger={false} delay={0.05}>
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

      {tier === "Brands" && <BrandsTierForm />}
      {tier === "Services" && <ServicesTierForm />}
    </div>
  )
}
