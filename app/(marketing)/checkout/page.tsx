"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircleIcon, ArrowRight, CheckCircle2, ChevronDownIcon, Cpu, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/motion/reveal";
import { useCart } from "@/components/cart/cart-provider";
import { formatGBP } from "@/components/prebuilt/data";
import { COUNTRIES } from "@/lib/countries";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const address = [
      String(formData.get("line1") ?? ""),
      String(formData.get("line2") ?? ""),
      String(formData.get("city") ?? ""),
      String(formData.get("postcode") ?? ""),
      String(formData.get("country") ?? ""),
    ]
      .filter(Boolean)
      .join(", ");

    const summary = [
      ...items.map((item) => ({
        label: item.name,
        value: `Qty ${item.quantity} Â· ${formatGBP(item.price * item.quantity)}`,
      })),
      { label: "Shipping address", value: address },
    ];

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "prebuilt",
          name,
          email,
          phone,
          summary,
          totalText: formatGBP(subtotal),
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Could not send your order.");
      }

      setSuccess(true);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-4 px-4 pt-36 pb-26 text-center sm:px-6">
        <CheckCircle2 className="size-12 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Order received!</h1>
        <p className="max-w-md text-muted-foreground">
          We&apos;ve emailed our team your order details. We&apos;ll be in touch shortly to confirm and arrange payment.
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/prebuilt-pcs" />}
          className="mt-2 rounded-lg bg-gradient-button shadow-glow"
        >
          Continue shopping
          <ArrowRight />
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-4 px-4 pt-36 pb-26 text-center sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground">Add a pre-built PC to your cart before checking out.</p>
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
    <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:pt-36 lg:pb-20">
      <Reveal viewTrigger={false}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Guest checkout â€” no account needed. Submit your order and our team will email you to confirm and arrange payment.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Reveal viewTrigger={false} delay={0.05}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="font-semibold text-foreground">Contact details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                  <span className="font-medium text-foreground">Full name</span>
                  <Input name="name" required autoComplete="name" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Email</span>
                  <Input type="email" name="email" required autoComplete="email" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Phone</span>
                  <Input type="tel" name="phone" required autoComplete="tel" />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="font-semibold text-foreground">Shipping address</h2>
              <div className="mt-4 grid gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Address line 1</span>
                  <Input name="line1" required autoComplete="address-line1" />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Address line 2 (optional)</span>
                  <Input name="line2" autoComplete="address-line2" />
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">City</span>
                    <Input name="city" required autoComplete="address-level2" />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">Postcode</span>
                    <Input name="postcode" required autoComplete="postal-code" />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Country</span>
                  <div className="relative">
                    <select
                      name="country"
                      required
                      autoComplete="country-name"
                      defaultValue="United Kingdom"
                      className="h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent px-2.5 pr-8 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="rounded-lg bg-gradient-button shadow-glow"
            >
              {submitting && <Loader2Icon className="animate-spin" />}
              {submitting ? "Sending orderâ€¦" : "Place order"}
              {!submitting && <ArrowRight />}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              We&apos;ll email you to confirm your order and arrange payment.
            </p>
          </form>
        </Reveal>

        <Reveal viewTrigger={false} delay={0.1} className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
            <h2 className="font-semibold text-foreground">Order summary</h2>
            <div className="mt-4 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.slug} className="flex items-center gap-3">
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain" />
                    ) : (
                      <Cpu className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-foreground">
                    {formatGBP(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-foreground">{formatGBP(subtotal)}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
