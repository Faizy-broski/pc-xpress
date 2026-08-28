"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { ProductGallery } from "@/components/prebuilt/product-gallery";
import { useCart } from "@/components/cart/cart-provider";
import { StarRating } from "@/components/marketing/star-rating";
import { ReviewSection } from "@/components/marketing/review-section";
import type { Review } from "@/lib/data/reviews";
import {
  formatExVat,
  formatGBP,
  type PrebuiltProduct,
} from "@/components/prebuilt/data";

const EASE = [0.22, 1, 0.36, 1] as const;

const TRUST_POINTS = [
  { icon: Truck, label: "Free UK delivery" },
  { icon: ShieldCheck, label: "12+ month warranty" },
  { icon: Wrench, label: "Built & tested in-house" },
  { icon: RotateCcw, label: "14-day returns" },
];

const TABS = ["Overview", "Full Specifications", "What's in the Box"] as const;
type Tab = (typeof TABS)[number];

function computeSaving(was: number, now: number) {
  const diff = was - now;
  return diff > 0 ? formatGBP(diff) : null;
}

export function ProductDetail({ product, reviews }: { product: PrebuiltProduct; reviews: Review[] }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<Tab>("Overview");
  const { addItem } = useCart();
  const router = useRouter();

  const saving = product.wasPrice ? computeSaving(product.wasPrice, product.price) : null;

  function handleAddToCart() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
      },
      quantity
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function handleBuyNow() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
      },
      quantity
    );
    router.push("/checkout");
  }

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <ProductGallery images={product.images} name={product.name} />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="soft">{product.category}</Badge>
              {product.badge && (
                <Badge className="bg-gradient-button text-primary-foreground shadow-glow">
                  {product.badge}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">SKU {product.sku}</span>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">{product.os}</p>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-1.5 text-muted-foreground">{product.tagline}</p>
            </div>

            <div className="flex items-center gap-2">
              <StarRating value={product.rating} size="md" />
              <a
                href="#reviews"
                className="text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                {product.reviewCount} Reviews
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatGBP(product.price)}
                    </span>
                    {product.wasPrice && (
                      <span className="text-base text-muted-foreground line-through">
                        {formatGBP(product.wasPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({formatExVat(product.price)} ex. VAT)
                  </span>
                </div>
                {saving && (
                  <Badge className="bg-primary text-primary-foreground">
                    Save {saving}
                  </Badge>
                )}
              </div>

              <p className="mt-3 text-sm text-foreground">
                {product.inStock ? (
                  <span className="font-medium text-primary">In stock</span>
                ) : (
                  <span className="font-medium text-muted-foreground">Out of stock</span>
                )}{" "}
                &middot; Estimated dispatch{" "}
                <span className="font-medium">{product.dispatchDate}</span>
              </p>

              <Separator className="my-4" />

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-11 items-center justify-between rounded-lg border border-border sm:w-32">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="text-sm font-medium text-foreground">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    disabled={quantity >= 5}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  className="flex-1 rounded-lg p-5"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="size-4" />
                        Added to cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5"
                      >
                        <ShoppingCart className="size-4" />
                        Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>

                <Button
                  size="lg"
                  disabled={!product.inStock}
                  onClick={handleBuyNow}
                  className="flex-1 rounded-lg bg-gradient-button p-5 shadow-glow"
                >
                  Buy Now
                  <ArrowRight />
                </Button>
              </div>
            </div>

            {product.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-start gap-1.5 rounded-lg border border-border p-3"
                >
                  <Icon className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mt-12">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-muted p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "relative shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                tab === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === t && (
                <motion.span
                  layoutId="prebuilt-detail-tab"
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute inset-0 rounded-md bg-gradient-button shadow-glow"
                />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Overview" && (
            <div className="max-w-2xl">
              <p className="text-foreground/90 leading-relaxed">{product.description}</p>
            </div>
          )}

          {tab === "Full Specifications" && (
            <div className="overflow-hidden rounded-xl border border-border">
              {product.specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className={cn(
                    "flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6",
                    index % 2 === 1 && "bg-muted/50",
                    index !== product.specs.length - 1 && "border-b border-border"
                  )}
                >
                  <span className="w-full shrink-0 text-sm font-medium text-muted-foreground sm:w-48">
                    {spec.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "What's in the Box" && (
            <ul className="grid max-w-md gap-2.5">
              {product.whatsIncluded.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mt-12" id="reviews">
        <ReviewSection
          category="Pre-built PC"
          reference={product.slug}
          referenceLabel={product.name}
          reviews={reviews}
        />
      </Reveal>
    </div>
  );
}
