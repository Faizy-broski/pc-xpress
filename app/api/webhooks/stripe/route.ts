import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { getStripe } from "@/lib/stripe"
import { markOrderPaidBySessionId } from "@/lib/data/orders"

/**
 * Stripe webhook — flips a pending order to "Processing" once payment is
 * confirmed. Point your Stripe webhook endpoint (or `stripe listen` in dev)
 * at this route for the `checkout.session.completed` event; see
 * .env.example for STRIPE_WEBHOOK_SECRET.
 *
 * Reads the raw body via request.text() rather than request.json() — Stripe
 * signature verification requires the exact raw bytes that were sent.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set — rejecting webhook.")
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error)
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    try {
      await markOrderPaidBySessionId(session.id)
    } catch (error) {
      console.error("Failed to mark order paid", error)
      return NextResponse.json({ error: "Failed to update order." }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
