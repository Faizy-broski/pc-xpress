import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { formatGBP } from "@/components/prebuilt/data";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order Confirmed | PC Xpress",
};

interface PageParams {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageParams) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  let amountTotal: number | null = null;

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? session.customer_email ?? null;
      amountTotal = session.amount_total;
    } catch (error) {
      console.warn("Could not retrieve Stripe session for the success page:", error);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 pt-34 pb-26 text-center sm:px-6">
      <ClearCartOnMount />
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Order confirmed</h1>
      <p className="text-muted-foreground">
        Thanks{email ? `, we've sent a confirmation to ${email}` : ""}! We'll email you again
        once your PC is built and ready for dispatch.
      </p>
      {amountTotal !== null && (
        <p className="text-lg font-bold text-primary">{formatGBP(amountTotal / 100)}</p>
      )}
      <Button
        size="lg"
        nativeButton={false}
        render={<Link href="/" />}
        className="mt-2 rounded bg-gradient-button shadow-glow"
      >
        Back to home
        <ArrowRight />
      </Button>
    </div>
  );
}
