"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { CatalogIcon } from "@/components/icons/icon-registry"
import { usePartCatalog } from "@/components/dashboard/store"
import { type CategoryId, formatPartPrice } from "@/components/build-a-pc/data"

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

export default function CustomBuiltCatalogPage() {
  const { categories, addPart } = usePartCatalog()
  const [categoryId, setCategoryId] = useState<CategoryId>(categories[0].id)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [specsText, setSpecsText] = useState("")
  const [inStock, setInStock] = useState(true)
  const [badge, setBadge] = useState("")
  const [socket, setSocket] = useState("")

  const selectedCategory = categories.find((c) => c.id === categoryId)

  const priceValue = Number(price)
  const isValid = name.trim().length > 0 && price.trim().length > 0 && priceValue >= 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid || !selectedCategory) return

    const specs = specsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    addPart(selectedCategory.id, {
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
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
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
        <Reveal delay={0.05}>
          <div className="rounded-xl border border-dashed border-border bg-card px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">No categories available yet.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
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
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                      Current options — {selectedCategory.label}
                    </h2>
                  </div>
                  <RevealGroup
                    key={selectedCategory.options.map((o) => o.id).join(",")}
                    className="divide-y divide-border"
                  >
                    {selectedCategory.options.map((option) => (
                      <RevealItem key={option.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{option.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {option.badge && <Badge variant="soft">{option.badge}</Badge>}
                            {option.socket && <Badge variant="soft">{option.socket}</Badge>}
                            {!option.inStock && <Badge variant="soft">Out of stock</Badge>}
                          </div>
                        </div>
                        <span className="shrink-0 font-semibold text-foreground">
                          {formatPartPrice(option.price)}
                        </span>
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

              <Reveal delay={0.15}>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3.5 rounded-xl border border-border bg-gradient-card p-5 shadow-card"
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

                  <Button type="submit" size="lg" disabled={!isValid} className="mt-1">
                    <PlusIcon />
                    Add Part
                  </Button>
                </form>
              </Reveal>
            </div>
          )}
        </>
      )}
    </div>
  )
}
