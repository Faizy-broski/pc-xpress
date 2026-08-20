"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Cpu, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { useCart } from "@/components/cart/cart-provider";
import { formatGBP } from "@/components/prebuilt/data";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex h-screen max-w-screen-2xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <ShoppingCart className="size-8" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Browse our pre-built PCs and add one to get started.
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/prebuilt-pcs" />}
          className="mt-2 rounded-lg bg-gradient-button shadow-glow"
        >
          Shop Pre-built PCs
          <ArrowRight />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-32 sm:px-6 lg:pt-36 pb-26">
      <Reveal viewTrigger={false}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your Cart
        </h1>
        <p className="mt-1 text-muted-foreground">
          {items.length} item{items.length === 1 ? "" : "s"} in your cart.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Reveal viewTrigger={false} delay={0.05}>
          <RevealGroup viewTrigger={false} className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
            {items.map((item) => (
              <RevealItem key={item.slug} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain" />
                  ) : (
                    <Cpu className="size-8 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/prebuilt-pcs/${item.slug}`}
                    className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-medium text-primary">{formatGBP(item.price)}</p>
                </div>

                <div className="flex h-9 shrink-0 items-center rounded-lg border border-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(item.slug, item.quantity - 1)}
                    className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(item.slug, Math.min(9, item.quantity + 1))}
                    className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <span className="hidden w-20 shrink-0 text-right text-sm font-bold text-foreground sm:block">
                  {formatGBP(item.price * item.quantity)}
                </span>

                <button
                  type="button"
                  aria-label="Remove from cart"
                  onClick={() => removeItem(item.slug)}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        <Reveal viewTrigger={false} delay={0.1}>
          <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
            <h2 className="font-semibold text-foreground">Order summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatGBP(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Free UK delivery. VAT included.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/checkout")}
              className={cn("mt-5 w-full rounded-lg bg-gradient-button shadow-glow")}
            >
              Checkout
              <ArrowRight />
            </Button>
            <Link
              href="/prebuilt-pcs"
              className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
