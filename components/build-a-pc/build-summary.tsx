"use client";

import { useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/booking-modal";
import {
  ASSEMBLY_FEE,
  BUILD_TIPS,
  formatGBP,
  formatPartPrice,
  type Category,
  type CategoryId,
  type PartOption,
} from "@/components/build-a-pc/data";

const EASE = [0.22, 1, 0.36, 1] as const;

interface BuildSummaryProps {
  categories: Category[];
  selections: Partial<Record<CategoryId, PartOption>>;
  onRemove: (id: CategoryId) => void;
}

export function BuildSummary({ categories, selections, onRemove }: BuildSummaryProps) {
  const selectedList = categories
    .map((category) => ({ category, part: selections[category.id] }))
    .filter(
      (entry): entry is { category: Category; part: PartOption } => Boolean(entry.part)
    );

  const subtotal = selectedList.reduce((sum, { part }) => sum + part.price, 0);
  const hasAny = selectedList.length > 0;
  const total = hasAny ? subtotal + ASSEMBLY_FEE : 0;
  const progress = selectedList.length / categories.length;

  const [bookingOpen, setBookingOpen] = useState(false);
  const canSubmit = hasAny;

  const bookingSummary = [
    ...selectedList.map(({ category, part }) => ({
      label: category.label,
      value: `${part.name} (${formatPartPrice(part.price)})`,
    })),
    { label: "Build & testing fee", value: formatGBP(ASSEMBLY_FEE) },
  ];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold text-foreground">Your Build Summary</h2>
          <span className="text-xs text-muted-foreground">
            {selectedList.length}/{categories.length}
          </span>
        </div>

        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>

        <div className="mt-3 space-y-2">
          {selectedList.length === 0 && (
            <p className="text-sm text-muted-foreground">No components selected yet.</p>
          )}

          <AnimatePresence initial={false}>
            {selectedList.map(({ category, part }) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {category.label}
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">{part.name}</p>
                    <p className="mt-0.5 text-sm font-semibold text-primary">
                      {formatPartPrice(part.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(category.id)}
                    aria-label={`Remove ${part.name}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Parts subtotal</span>
            <span>{formatGBP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Build &amp; testing fee</span>
            <span>{hasAny ? formatGBP(ASSEMBLY_FEE) : formatGBP(0)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold text-foreground">
            <span>Total</span>
            <motion.span
              key={total}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-primary"
            >
              {formatGBP(total)}
            </motion.span>
          </div>
        </div>

        <Button className="mt-3 w-full" disabled={!canSubmit} onClick={() => setBookingOpen(true)}>
          {hasAny ? "Submit Build" : "Select at least one part to continue"}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Ready to build? Submit and we&apos;ll confirm pricing &amp; availability.
        </p>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        kind="build"
        title="Confirm Your Custom PC Build"
        description="Add your contact details and we'll confirm pricing & availability by email."
        summary={bookingSummary}
        totalText={formatGBP(total)}
      />

      <div
        className={cn(
          "mt-3 rounded-2xl border border-border bg-card p-4 shadow-card"
        )}
      >
        <div className="flex items-center gap-2 text-primary">
          <Lightbulb className="size-4" />
          <h3 className="font-mono text-sm font-semibold">Build Tips</h3>
        </div>
        <ul className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
          {BUILD_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="text-primary">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
