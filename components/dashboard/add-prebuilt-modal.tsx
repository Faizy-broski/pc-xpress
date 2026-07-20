"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlusIcon, PlusIcon, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { PrebuiltCategory, PrebuiltProduct, PrebuiltSpec } from "@/components/prebuilt/data"

const EASE = [0.22, 1, 0.36, 1] as const

const CATEGORY_OPTIONS: PrebuiltCategory[] = ["Gaming", "Creator", "Office"]
const BADGE_OPTIONS = ["None", "Best Seller", "New", "Editor's Pick"] as const

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

interface AddPrebuiltModalProps {
  open: boolean
  onClose: () => void
  onAdd: (product: PrebuiltProduct) => void
}

export function AddPrebuiltModal({ open, onClose, onAdd }: AddPrebuiltModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<string[]>([])
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [category, setCategory] = useState<PrebuiltCategory>("Gaming")
  const [badge, setBadge] = useState<(typeof BADGE_OPTIONS)[number]>("None")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [os, setOs] = useState("Windows 11 Home")
  const [rating, setRating] = useState("5")
  const [reviewCount, setReviewCount] = useState("0")
  const [price, setPrice] = useState("")
  const [wasPrice, setWasPrice] = useState("")
  const [dispatchDate, setDispatchDate] = useState("")
  const [inStock, setInStock] = useState(true)
  const [highlightsText, setHighlightsText] = useState("")
  const [specs, setSpecs] = useState<PrebuiltSpec[]>([{ label: "", value: "" }])
  const [whatsIncludedText, setWhatsIncludedText] = useState(
    "Pre-built PC, Power cable, Driver USB stick, Quick start guide"
  )

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  function resetFields() {
    setImages([])
    setName("")
    setSku("")
    setCategory("Gaming")
    setBadge("None")
    setTagline("")
    setDescription("")
    setOs("Windows 11 Home")
    setRating("5")
    setReviewCount("0")
    setPrice("")
    setWasPrice("")
    setDispatchDate("")
    setInStock(true)
    setHighlightsText("")
    setSpecs([{ label: "", value: "" }])
    setWhatsIncludedText("Pre-built PC, Power cable, Driver USB stick, Quick start guide")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleClose() {
    images.forEach((url) => URL.revokeObjectURL(url))
    resetFields()
    onClose()
  }

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    setImages((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))])
    event.target.value = ""
  }

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  function updateSpec(index: number, field: keyof PrebuiltSpec, value: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  function addSpecRow() {
    setSpecs((prev) => [...prev, { label: "", value: "" }])
  }

  function removeSpecRow(index: number) {
    setSpecs((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }

  const priceValue = Number(price)
  const isValid =
    name.trim().length > 0 &&
    sku.trim().length > 0 &&
    tagline.trim().length > 0 &&
    price.trim().length > 0 &&
    priceValue > 0 &&
    images.length > 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid) return

    const wasPriceValue = Number(wasPrice)
    const cleanSpecs = specs
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter((s) => s.label && s.value)
    const highlights = highlightsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const whatsIncluded = whatsIncludedText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    onAdd({
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      sku: sku.trim(),
      name: name.trim(),
      category,
      badge: badge === "None" ? undefined : badge,
      tagline: tagline.trim(),
      description: description.trim(),
      images,
      os: os.trim() || "Windows 11 Home",
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      reviewCount: Math.max(0, Number(reviewCount) || 0),
      price: priceValue,
      wasPrice: wasPrice.trim() && wasPriceValue > priceValue ? wasPriceValue : undefined,
      dispatchDate: dispatchDate.trim() || "Contact us for lead time",
      inStock,
      highlights,
      specs: cleanSpecs,
      whatsIncluded,
    })

    // Ownership of the blob URLs transfers to the added product, so don't revoke them here.
    resetFields()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Add pre-built PC"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Add Pre-built PC</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in every field the product page needs before it goes live.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-md border border-primary p-1 text-primary hover:bg-primary/10"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
              <div>
                <label className={labelClass}>Photos</label>
                <div className="flex flex-wrap gap-2.5">
                  {images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div key={src} className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border">
                      <img src={src} alt={`Upload ${i + 1}`} className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="Remove photo"
                        className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5 text-white hover:bg-black/90"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <ImagePlusIcon className="size-4" />
                    <span className="text-[0.65rem] font-medium">Add</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="U87 XT Next Day PC"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>SKU</label>
                  <Input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SY3111"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PrebuiltCategory)}
                    className={fieldClass}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Badge</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as (typeof BADGE_OPTIONS)[number])}
                    className={fieldClass}
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Tagline</label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="1440p-ready gaming rig with RGB tempered glass panel"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full product description shown on the Overview tab..."
                  rows={3}
                  className={cn(fieldClass, "h-auto resize-none py-2")}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className={labelClass}>OS</label>
                  <Input value={os} onChange={(e) => setOs(e.target.value)} placeholder="Windows 11 Home" />
                </div>
                <div>
                  <label className={labelClass}>Rating (1-5)</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Review count</label>
                  <Input
                    type="number"
                    min="0"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(e.target.value)}
                  />
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

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Price (£)</label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1399"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Was price (£, optional)</label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={wasPrice}
                    onChange={(e) => setWasPrice(e.target.value)}
                    placeholder="1499"
                  />
                </div>
                <div>
                  <label className={labelClass}>Estimated dispatch</label>
                  <Input
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    placeholder="Monday, 6/7/2026"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Highlights (comma separated)</label>
                <Input
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  placeholder="1440p 144fps ready, Ray tracing capable, Quiet under load"
                />
              </div>

              <div>
                <label className={labelClass}>What's in the box (comma separated)</label>
                <Input
                  value={whatsIncludedText}
                  onChange={(e) => setWhatsIncludedText(e.target.value)}
                />
              </div>

              <Separator />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className={cn(labelClass, "mb-0")}>Full specifications</label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <PlusIcon className="size-3.5" />
                    Add row
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={spec.label}
                        onChange={(e) => updateSpec(i, "label", e.target.value)}
                        placeholder="Processor"
                        className="w-32 shrink-0 sm:w-40"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        placeholder="AMD Ryzen 7 8700F"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(i)}
                        aria-label="Remove spec row"
                        disabled={specs.length === 1}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-1 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={!isValid} className="flex-1">
                  Add Pre-built PC
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
