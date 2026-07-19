"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { Category, CategoryId, PartOption } from "@/components/build-a-pc/data";

interface CategoryGridProps {
  categories: Category[];
  selections: Partial<Record<CategoryId, PartOption>>;
  onSelect: (id: CategoryId) => void;
}

export function CategoryGrid({ categories, selections, onSelect }: CategoryGridProps) {
  return (
    <RevealGroup className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" stagger={0.06}>
      {categories.map((category) => {
        const Icon = category.icon;
        const selected = selections[category.id];

        return (
          <RevealItem key={category.id}>
            <motion.button
              type="button"
              onClick={() => onSelect(category.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative w-full rounded-xl border bg-white/3 p-3 text-left transition-colors hover:border-primary/60",
                selected ? "border-primary" : "border-white/10"
              )}
            >
              {selected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Check className="size-2.5" />
                </motion.span>
              )}
              <Icon className={cn("size-4.5", selected ? "text-primary" : "text-white/50")} />
              <p className="mt-2 text-sm font-semibold text-white">{category.label}</p>
              <p className={cn("mt-0.5 truncate text-xs", selected ? "text-primary" : "text-white/40")}>
                {selected ? selected.name : "Empty"}
              </p>
            </motion.button>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
