import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { PrebuiltOrder, PrebuiltOrderItem } from "@/components/dashboard/data"

interface OrderRow {
  id: string
  stripe_session_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: Record<string, string>
  items: PrebuiltOrderItem[]
  product_summary: string
  subtotal: number
  total: number
  status: string
  created_at: string
}

const STATUS_TONE: Record<string, PrebuiltOrder["tone"]> = {
  "Awaiting Payment": "danger",
  Building: "neutral",
  Processing: "warning",
  Dispatched: "info",
  Delivered: "success",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function formatAddress(address: Record<string, string>) {
  return [address.line1, address.line2, address.city, address.postcode, address.country]
    .filter(Boolean)
    .join(", ")
}

function fromRow(row: OrderRow): PrebuiltOrder {
  return {
    id: row.id,
    customer: row.customer_name,
    product: row.product_summary,
    date: formatDate(row.created_at),
    status: row.status,
    tone: STATUS_TONE[row.status] ?? "neutral",
    total: row.total,
    email: row.customer_email,
    phone: row.customer_phone ?? undefined,
    address: formatAddress(row.shipping_address ?? {}),
    items: row.items,
  }
}

/**
 * Falls back to an empty list if Supabase isn't reachable yet (schema not
 * applied). Unlike the catalog tables, there's no static seed data to fall
 * back to here — orders only exist once real checkouts happen.
 */
export async function listOrders(): Promise<PrebuiltOrder[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return (data as OrderRow[]).map(fromRow)
  } catch (error) {
    console.warn("Could not load orders from Supabase:", error)
    return []
  }
}

export async function updateOrder(id: string, patch: Partial<PrebuiltOrder>): Promise<PrebuiltOrder> {
  const supabase = await createSupabaseServerClient()

  const update: Partial<OrderRow> = {}
  if (patch.customer !== undefined) update.customer_name = patch.customer
  if (patch.product !== undefined) update.product_summary = patch.product
  if (patch.status !== undefined) update.status = patch.status
  if (patch.total !== undefined) update.total = patch.total

  const { data, error } = await supabase.from("orders").update(update).eq("id", id).select("*").single()

  if (error) throw new Error(`Failed to update order: ${error.message}`)
  return fromRow(data as OrderRow)
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("orders").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete order: ${error.message}`)
}

export interface CreateOrderInput {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: Record<string, string>
  items: PrebuiltOrderItem[]
  productSummary: string
  subtotal: number
  total: number
}

/**
 * Called from the checkout API route, server-side, before redirecting to
 * Stripe. Uses the service-role client since the customer has no session for
 * RLS to authenticate — this is the one legitimate un-authenticated write
 * path into the orders table.
 */
export async function createPendingOrder(input: CreateOrderInput): Promise<string> {
  const admin = createSupabaseAdminClient()
  const id = `#PB-${crypto.randomUUID().slice(0, 6).toUpperCase()}`

  const { error } = await admin.from("orders").insert({
    id,
    customer_name: input.customerName,
    customer_email: input.customerEmail,
    customer_phone: input.customerPhone ?? null,
    shipping_address: input.shippingAddress,
    items: input.items,
    product_summary: input.productSummary,
    subtotal: input.subtotal,
    total: input.total,
    status: "Awaiting Payment",
  })

  if (error) throw new Error(`Failed to create order: ${error.message}`)
  return id
}

export async function attachStripeSession(orderId: string, sessionId: string): Promise<void> {
  const admin = createSupabaseAdminClient()
  const { error } = await admin.from("orders").update({ stripe_session_id: sessionId }).eq("id", orderId)
  if (error) throw new Error(`Failed to attach Stripe session: ${error.message}`)
}

/** Called from the Stripe webhook once payment is confirmed. */
export async function markOrderPaidBySessionId(sessionId: string): Promise<void> {
  const admin = createSupabaseAdminClient()
  const { error } = await admin
    .from("orders")
    .update({ status: "Processing" })
    .eq("stripe_session_id", sessionId)

  if (error) throw new Error(`Failed to mark order paid: ${error.message}`)
}
