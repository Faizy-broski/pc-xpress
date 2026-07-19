"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatPartPrice, type Category, type PartOption } from "@/components/build-a-pc/data";

const EASE = [0.22, 1, 0.36, 1] as const;

interface PartSelectModalProps {
  category: Category | null;
  selected: PartOption | null;
  onSelect: (option: PartOption) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function PartSelectModal({
  category,
  selected,
  onSelect,
  onRemove,
  onClose,
}: PartSelectModalProps) {
  useEffect(() => {
    if (!category) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [category, onClose]);

  return (
    <AnimatePresence>
      {category && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
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
            aria-label={`Select ${category.label}`}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Select {category.label}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md border border-primary p-1 text-primary hover:bg-primary/10"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 max-h-80 space-y-2.5 overflow-y-auto pr-1">
              {category.options.map((option, i) => {
                const isSelected = selected?.id === option.id;

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    disabled={!option.inStock}
                    onClick={() => onSelect(option)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    whileHover={option.inStock ? { y: -1 } : undefined}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50",
                      !option.inStock && "cursor-not-allowed opacity-50 hover:border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-foreground">{option.name}</span>
                        {option.badge && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
                            {option.badge}
                          </span>
                        )}
                        {isSelected && (
                          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-medium text-primary-foreground">
                            <Check className="size-3" />
                            Selected
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 font-semibold text-primary">
                        {formatPartPrice(option.price)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {option.specs.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-xs font-medium",
                        option.inStock ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {option.inStock ? "✓ In Stock" : "Out of Stock"}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex gap-3">
              <Button variant="outline" size="lg" onClick={onClose} className="flex-1">
                Done
              </Button>
              {selected && (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => {
                    onRemove();
                    onClose();
                  }}
                  className="flex-1"
                >
                  Remove Component
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
