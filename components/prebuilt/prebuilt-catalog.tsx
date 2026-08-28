"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductCard } from "@/components/marketing/product-card";
import { toProductCardData, type PrebuiltCategory, type PrebuiltProduct } from "@/components/prebuilt/data";

const CATEGORY_FILTERS: Array<PrebuiltCategory | "All"> = ["All", "Gaming", "Creator", "Office"];

const SORTS = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
} as const;
type SortKey = keyof typeof SORTS;

export function PrebuiltCatalog({ products }: { products: PrebuiltProduct[] }) {
  const [category, setCategory] = useState<PrebuiltCategory | "All">("All");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const list =
      category === "All" ? products : products.filter((p) => p.category === category);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);

    return sorted;
  }, [products, category, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded border px-4 py-1.5 text-sm font-medium transition-colors",
                category === c
                  ? "border-transparent bg-gradient-button text-primary-foreground shadow-glow"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {c === "All" ? "All PCs" : c}
            </button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" className="rounded" />}
          >
            <ArrowUpDown className="size-3.5" />
            {SORTS[sort]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.entries(SORTS) as Array<[SortKey, string]>).map(([key, label]) => (
              <DropdownMenuItem key={key} onClick={() => setSort(key)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "PC" : "PCs"}
      </p>

      {filtered.length > 0 ? (
        <RevealGroup key={`${category}-${sort}`} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <RevealItem key={product.slug}>
              <ProductCard {...toProductCardData(product)} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No PCs match this filter yet.
        </div>
      )}
    </div>
  );
}
