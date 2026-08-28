"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { CatalogIcon } from "@/components/icons/icon-registry"
import { RowActions } from "@/components/dashboard/row-actions"
import { BulkActionsBar } from "@/components/dashboard/bulk-actions-bar"
import { RecordModal, type RecordField } from "@/components/dashboard/record-modal"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"
import { usePartCatalog } from "@/components/dashboard/store"
import { type CategoryId, type PartOption, formatPartPrice } from "@/components/build-a-pc/data"

const fieldClass =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

const labelClass = "mb-1 block text-xs font-medium text-muted-foreground"

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function partFields(part: PartOption): RecordField[] {
  return [
    { key: "name", label: "Part name", value: part.name },
    { key: "specs", label: "Specs (comma separated)", value: part.specs.join(", "), wide: true },
    { key: "price", label: "Price (£, 0 = included)", value: String(part.price), type: "number" },
    { key: "badge", label: "Badge (optional)", value: part.badge ?? "" },
    { key: "socket", label: "Socket (optional)", value: part.socket ?? "" },
    {
      key: "inStock",
      label: "In stock",
      value: part.inStock ? "Yes" : "No",
      type: "select",
      options: ["Yes", "No"],
    },
  ]
}

export default function CustomBuiltCatalogPage() {
  const { categories, addPart, updatePart, removePart } = usePartCatalog()
  const [categoryId, setCategoryId] = useState<CategoryId>(categories[0].id)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [specsText, setSpecsText] = useState("")
  const [inStock, setInStock] = useState(true)
  const [badge, setBadge] = useState("")
  const [socket, setSocket] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingPart, setEditingPart] = useState<PartOption | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PartOption | null>(null)
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const selectedCategory = categories.find((c) => c.id === categoryId)

  const priceValue = Number(price)
  const isValid = name.trim().length > 0 && price.trim().length > 0 && priceValue >= 0

  function selectCategory(id: CategoryId) {
    setCategoryId(id)
    setSelectedIds(new Set())
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (!selectedCategory) return
    setSelectedIds((prev) =>
      prev.size === selectedCategory.options.length ? new Set() : new Set(selectedCategory.options.map((o) => o.id))
    )
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid || !selectedCategory) return

    const specs = specsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    setSubmitting(true)
    setError(null)
    try {
      await addPart(selectedCategory.id, {
        id: `${slugify(name)}-${Date.now().toString(36)}`,
        name: name.trim(),
        price: priceValue,
        specs,
        inStock,
        badge: badge.trim() || undefined,
        socket: socket.trim() || undefined,
      })

      setName("")
      setPrice("")
      setSpecsText("")
      setInStock(true)
      setBadge("")
      setSocket("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the part.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleSaveEdit(values: Record<string, string>) {
    if (!editingPart || !selectedCategory) return Promise.resolve()
    return updatePart(selectedCategory.id, editingPart.id, {
      name: values.name,
      specs: values.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      price: Number(values.price) || 0,
      badge: values.badge.trim() || undefined,
      socket: values.socket.trim() || undefined,
      inStock: values.inStock === "Yes",
    })
  }

  async function handleBulkDelete() {
    if (!selectedCategory) return
    await Promise.all([...selectedIds].map((id) => removePart(selectedCategory.id, id)))
    setSelectedIds(new Set())
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Custom Built Catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the components customers can pick for each category in the Build-a-PC wizard.
          </p>
        </div>
      </Reveal>

      {categories.length === 0 ? (
        <Reveal viewTrigger={false} delay={0.05}>
          <div className="rounded-xl border border-dashed border-border bg-card px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">No categories available yet.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal viewTrigger={false} delay={0.05}>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    categoryId === category.id
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <CatalogIcon name={category.icon} className="size-3.5" />
                  {category.label}
                </button>
              ))}
            </div>
          </Reveal>

          {selectedCategory && (
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <Reveal viewTrigger={false} delay={0.1}>
                <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
                  <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                      Current options — {selectedCategory.label}
                    </h2>
                    {selectedCategory.options.length > 0 && (
                      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === selectedCategory.options.length}
                          onChange={toggleSelectAll}
                          className="size-4 rounded border-input accent-primary"
                        />
                        Select all
                      </label>
                    )}
                  </div>
                  <BulkActionsBar
                    count={selectedIds.size}
                    onClear={() => setSelectedIds(new Set())}
                    onDelete={() => setBulkConfirmOpen(true)}
                  />
                  <RevealGroup viewTrigger={false} className="divide-y divide-border">
                    {selectedCategory.options.map((option) => (
                      <RevealItem key={option.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(option.id)}
                            onChange={() => toggleSelected(option.id)}
                            className="size-4 shrink-0 rounded border-input accent-primary"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{option.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {option.badge && <Badge variant="soft">{option.badge}</Badge>}
                              {option.socket && <Badge variant="soft">{option.socket}</Badge>}
                              {!option.inStock && <Badge variant="soft">Out of stock</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="font-semibold text-foreground">
                            {formatPartPrice(option.price)}
                          </span>
                          <RowActions
                            onEdit={() => setEditingPart(option)}
                            onDelete={() => setDeleteTarget(option)}
                          />
                        </div>
                      </RevealItem>
                    ))}
                    {selectedCategory.options.length === 0 && (
                      <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                        No options yet for this category.
                      </p>
                    )}
                  </RevealGroup>
                </div>
              </Reveal>

              <Reveal viewTrigger={false} delay={0.15}>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3.5 rounded-xl border border-border bg-gradient-card p-4 shadow-card sm:p-5 lg:p-6"
                >
                  <div>
                    <label className={labelClass}>Part name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="AMD Ryzen 9 9950X" required />
                  </div>
                  <div>
                    <label className={labelClass}>Specs (comma separated)</label>
                    <Input
                      value={specsText}
                      onChange={(e) => setSpecsText(e.target.value)}
                      placeholder="16 cores, 32 threads, 4.3GHz base"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Price (£, 0 = included)</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="489"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Badge (optional)</label>
                      <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Best Value, Staff Pick, New" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Socket (optional, CPU/Motherboard only)</label>
                      <Input value={socket} onChange={(e) => setSocket(e.target.value)} placeholder="AM5, LGA1700..." />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => setInStock(e.target.checked)}
                          className="size-4 rounded border-input accent-primary"
                        />
                        In stock
                      </label>
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" size="lg" disabled={!isValid || submitting} className="mt-1">
                    <PlusIcon />
                    {submitting ? "Adding…" : "Add Part"}
                  </Button>
                </form>
              </Reveal>
            </div>
          )}
        </>
      )}

      <RecordModal
        open={editingPart !== null}
        mode="edit"
        title="Edit part"
        subtitle={editingPart?.name}
        fields={editingPart ? partFields(editingPart) : []}
        onClose={() => setEditingPart(null)}
        onSave={handleSaveEdit}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete part?"
        description={`This will permanently remove "${deleteTarget?.name}" from the catalog. This can't be undone.`}
        onConfirm={() => (selectedCategory && deleteTarget ? removePart(selectedCategory.id, deleteTarget.id) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDeleteDialog
        open={bulkConfirmOpen}
        title="Delete selected parts?"
        description={`This will permanently remove ${selectedIds.size} part${selectedIds.size === 1 ? "" : "s"} from the catalog. This can't be undone.`}
        onConfirm={handleBulkDelete}
        onClose={() => setBulkConfirmOpen(false)}
      />
    </div>
  )
}
