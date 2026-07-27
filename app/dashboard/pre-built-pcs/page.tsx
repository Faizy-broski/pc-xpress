"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Cpu, PlusIcon, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { RowActions } from "@/components/dashboard/row-actions";
import { BulkActionsBar } from "@/components/dashboard/bulk-actions-bar";
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog";
import { PrebuiltProductModal } from "@/components/dashboard/add-prebuilt-modal";
import { usePrebuiltCatalog } from "@/components/dashboard/store";
import {
  formatExVat,
  formatGBP,
  type PrebuiltProduct,
} from "@/components/prebuilt/data";

export default function DashboardPrebuiltPcsPage() {
  const {
    products,
    addPrebuiltProduct,
    updatePrebuiltProduct,
    removePrebuiltProduct,
  } = usePrebuiltCatalog();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PrebuiltProduct | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<PrebuiltProduct | null>(
    null,
  );
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  function toggleSelected(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedSlugs((prev) =>
      prev.size === products.length
        ? new Set()
        : new Set(products.map((p) => p.slug)),
    );
  }

  async function handleBulkDelete() {
    await Promise.all(
      [...selectedSlugs].map((slug) => removePrebuiltProduct(slug)),
    );
    setSelectedSlugs(new Set());
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Pre-built PCs
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the pre-built systems customers can buy off the shelf.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {products.length > 0 && (
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <input
                  type="checkbox"
                  checked={selectedSlugs.size === products.length}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-input accent-primary"
                />
                Select all
              </label>
            )}
            <Button className="rounded" onClick={() => setModalOpen(true)}>
              <PlusIcon />
              Add Pre-built PC
            </Button>
          </div>
        </div>
      </Reveal>

      {selectedSlugs.size > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <BulkActionsBar
            count={selectedSlugs.size}
            onClear={() => setSelectedSlugs(new Set())}
            onDelete={() => setBulkConfirmOpen(true)}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <motion.div
            key={product.slug}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card"
          >
            <div className="relative aspect-video w-full shrink-0 bg-muted">
              <label className="absolute top-2 left-2 z-10 flex size-6 items-center justify-center rounded-md bg-background/90 shadow-sm">
                <input
                  type="checkbox"
                  checked={selectedSlugs.has(product.slug)}
                  onChange={() => toggleSelected(product.slug)}
                  className="size-4 rounded border-input accent-primary"
                />
              </label>
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
                  <p className="text-[0.7rem] font-medium text-muted-foreground">
                    {product.os}
                  </p>
                  <p className="truncate font-semibold text-foreground">
                    {product.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant="soft">{product.category}</Badge>
                    {product.badge && <Badge>{product.badge}</Badge>}
                  </div>
                </div>
                <StatusBadge
                  tone={product.inStock ? "success" : "danger"}
                  className="shrink-0"
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </StatusBadge>
              </div>

              <p className="text-xs text-muted-foreground">SKU {product.sku}</p>

              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-2.5",
                        i < product.rating
                          ? "fill-white text-white"
                          : "fill-white/30 text-white/30",
                      )}
                    />
                  ))}
                </span>
                <span className="text-xs text-muted-foreground">
                  {product.reviewCount} reviews
                </span>
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

              <div className="flex flex-col gap-2 border-t border-border pt-3.5">
                <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                      <span className="text-lg font-bold text-primary whitespace-nowrap">
                        {formatGBP(product.price)}
                      </span>
                      {product.wasPrice && (
                        <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
                          {formatGBP(product.wasPrice)}
                        </span>
                      )}
                    </span>
                    <span className="text-[0.65rem] text-muted-foreground">
                      ({formatExVat(product.price)} ex. VAT)
                    </span>
                  </div>
                  <span className="text-right text-[0.65rem] text-muted-foreground break-words">
                    Dispatch {product.dispatchDate}
                  </span>
                </div>
                <RowActions
                  onEdit={() => setEditingProduct(product)}
                  onDelete={() => setDeleteTarget(product)}
                />
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

      <PrebuiltProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addPrebuiltProduct}
      />

      <PrebuiltProductModal
        open={editingProduct !== null}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={(updated) => updatePrebuiltProduct(updated.slug, updated)}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete pre-built PC?"
        description={`This will permanently remove "${deleteTarget?.name}" from the store. This can't be undone.`}
        onConfirm={() =>
          deleteTarget ? removePrebuiltProduct(deleteTarget.slug) : undefined
        }
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDeleteDialog
        open={bulkConfirmOpen}
        title="Delete selected pre-built PCs?"
        description={`This will permanently remove ${selectedSlugs.size} product${selectedSlugs.size === 1 ? "" : "s"} from the store. This can't be undone.`}
        onConfirm={handleBulkDelete}
        onClose={() => setBulkConfirmOpen(false)}
      />
    </div>
  );
}
