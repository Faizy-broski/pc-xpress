"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Cpu, PlusIcon, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion/reveal"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { AddPrebuiltModal } from "@/components/dashboard/add-prebuilt-modal"
import {
  PREBUILT_PCS,
  formatExVat,
  formatGBP,
  type PrebuiltProduct,
} from "@/components/prebuilt/data"

export default function DashboardPrebuiltPcsPage() {
  const [products, setProducts] = useState<PrebuiltProduct[]>(PREBUILT_PCS)
  const [modalOpen, setModalOpen] = useState(false)

  function handleAdd(product: PrebuiltProduct) {
    setProducts((prev) => [product, ...prev])
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Pre-built PCs
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the pre-built systems customers can buy off the shelf.
            </p>
          </div>
          <Button className="rounded" onClick={() => setModalOpen(true)}>
            <PlusIcon />
            Add Pre-built PC
          </Button>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <motion.div
            key={product.slug}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card"
          >
            <div className="relative aspect-video w-full shrink-0 bg-muted">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  unoptimized={product.images[0].startsWith("blob:")}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-3"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <Cpu className="size-7" />
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-medium text-muted-foreground">{product.os}</p>
                  <p className="truncate font-semibold text-foreground">{product.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant="soft">{product.category}</Badge>
                    {product.badge && <Badge>{product.badge}</Badge>}
                  </div>
                </div>
                <StatusBadge tone={product.inStock ? "success" : "danger"} className="shrink-0">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </StatusBadge>
              </div>

              <p className="text-xs text-muted-foreground">
                SKU {product.sku}
              </p>

              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-2.5",
                        i < product.rating ? "fill-white text-white" : "fill-white/30 text-white/30"
                      )}
                    />
                  ))}
                </span>
                <span className="text-xs text-muted-foreground">{product.reviewCount} reviews</span>
              </div>

              {product.specs.length > 0 && (
                <div className="flex flex-1 flex-wrap content-start items-start gap-1.5">
                  {product.specs.slice(0, 4).map((spec) => (
                    <span
                      key={spec.label}
                      className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {spec.value}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1 border-t border-border pt-3.5">
                <div className="flex items-end justify-between gap-2">
                  <div className="flex flex-col leading-tight">
                    <span className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-primary">
                        {formatGBP(product.price)}
                      </span>
                      {product.wasPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatGBP(product.wasPrice)}
                        </span>
                      )}
                    </span>
                    <span className="text-[0.65rem] text-muted-foreground">
                      ({formatExVat(product.price)} ex. VAT)
                    </span>
                  </div>
                  <span className="shrink-0 text-right text-[0.65rem] text-muted-foreground">
                    Dispatch {product.dispatchDate}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex h-full min-h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <PlusIcon className="size-5" />
          <span className="text-sm font-medium">Add a pre-built PC</span>
        </button>
      </div>

      <AddPrebuiltModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}
