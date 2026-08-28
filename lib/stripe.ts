import Stripe from "stripe"

/**
 * Server-only Stripe client. Lazily constructed (not at module load) so the
 * rest of the app keeps working — including `next dev` startup — before
 * STRIPE_SECRET_KEY is set; only the checkout/webhook routes that actually
 * need it will throw, with a clear message pointing at .env.example.
 */
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Add it to .env — see .env.example for where to get a test key."
    )
  }

  return new Stripe(secretKey)
}
