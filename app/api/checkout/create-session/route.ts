import { NextResponse } from "next/server"

import { getPrebuiltProductBySlug } from "@/lib/data/prebuilt"
import { createPendingOrder, attachStripeSession } from "@/lib/data/orders"
import { getStripe } from "@/lib/stripe"
import type { PrebuiltOrderItem } from "@/components/dashboard/data"

interface CheckoutRequestBody {
  items: { slug: string; quantity: number }[]
  customer: { name: string; email: string; phone: string }
  shipping: { line1: string; line2?: string; city: string; postcode: string; country: string }
}

interface StripeLineItem {
  price_data: {
    currency: string
    product_data: { name: string; images?: string[] }
    unit_amount: number
  }
  quantity: number
}

export async function POST(request: Request) {
  let body: CheckoutRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 })
  }
  if (!body.customer?.name || !body.customer?.email || !body.customer?.phone) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 })
  }
  if (!body.shipping?.line1 || !body.shipping?.city || !body.shipping?.postcode || !body.shipping?.country) {
    return NextResponse.json({ error: "A full shipping address is required." }, { status: 400 })
  }

  // Never trust client-supplied prices — look up the real price/name/stock
  // for every slug server-side before building the Stripe session.
  const orderItems: PrebuiltOrderItem[] = []
  const lineItems: StripeLineItem[] = []

  for (const { slug, quantity } of body.items) {
    const qty = Math.min(9, Math.max(1, Math.floor(quantity) || 1))
    const product = await getPrebuiltProductBySlug(slug)

    if (!product) {
      return NextResponse.json({ error: `A product in your cart is no longer available.` }, { status: 400 })
    }
    if (!product.inStock) {
      return NextResponse.json({ error: `${product.name} is currently out of stock.` }, { status: 400 })
    }

    orderItems.push({ slug: product.slug, name: product.name, price: product.price, quantity: qty })
    lineItems.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: product.name,
          images: product.images[0] ? [product.images[0]] : undefined,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: qty,
    })
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const productSummary = orderItems.map((item) => `${item.name} ×${item.quantity}`).join(", ")
  const shippingAddress = {
    line1: body.shipping.line1,
    line2: body.shipping.line2 ?? "",
    city: body.shipping.city,
    postcode: body.shipping.postcode,
    country: body.shipping.country,
  }

  let orderId: string
  try {
    orderId = await createPendingOrder({
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      shippingAddress,
      items: orderItems,
      productSummary,
      subtotal,
      total: subtotal,
    })
  } catch (error) {
    console.error("Failed to create pending order", error)
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: body.customer.email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    })

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.")
    }

    await attachStripeSession(orderId, session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Failed to create Stripe checkout session", error)
    return NextResponse.json(
      { error: "Could not start checkout. Please try again shortly." },
      { status: 500 }
    )
  }
}
