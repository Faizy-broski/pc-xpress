import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getPrebuiltProductBySlug, updatePrebuiltProduct } from "@/lib/data/prebuilt"

export type ReviewCategory = "Pre-built PC" | "Custom Build" | "Repair"
export type ReviewStatus = "Pending" | "Published" | "Rejected"

export interface Review {
  id: string
  category: ReviewCategory
  reference?: string
  referenceLabel?: string
  customerName: string
  customerEmail: string
  rating: number
  comment: string
  status: ReviewStatus
  date: string
}

interface ReviewRow {
  id: string
  category: string
  reference: string | null
  reference_label: string | null
  customer_name: string
  customer_email: string
  rating: number
  comment: string
  status: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function fromRow(row: ReviewRow): Review {
  return {
    id: row.id,
    category: row.category as ReviewCategory,
    reference: row.reference ?? undefined,
    referenceLabel: row.reference_label ?? undefined,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    rating: row.rating,
    comment: row.comment,
    status: row.status as ReviewStatus,
    date: formatDate(row.created_at),
  }
}

/**
 * Admin dashboard read. Falls back to an empty list if Supabase isn't
 * reachable yet (schema not applied) — same convention as lib/data/orders.ts.
 */
export async function listReviews(): Promise<Review[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return (data as ReviewRow[]).map(fromRow)
  } catch (error) {
    console.warn("Could not load reviews from Supabase:", error)
    return []
  }
}

/**
 * Public read. RLS restricts unauthenticated callers to status='Published'
 * regardless of what's requested — this function never needs to filter on
 * status itself. `reference` narrows to one product (Pre-built PC); omit it
 * for the aggregated Custom Build / Repair feeds.
 */
export async function listPublishedReviews(
  category: ReviewCategory,
  reference?: string
): Promise<Review[]> {
  try {
    const supabase = await createSupabaseServerClient()
    let query = supabase.from("reviews").select("*").eq("category", category).eq("status", "Published")
    if (reference) query = query.eq("reference", reference)

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw new Error(error.message)
    return (data as ReviewRow[]).map(fromRow)
  } catch (error) {
    console.warn("Could not load reviews from Supabase:", error)
    return []
  }
}

export interface CreateReviewInput {
  category: ReviewCategory
  reference?: string
  referenceLabel?: string
  customerName: string
  customerEmail: string
  rating: number
  comment: string
}

/**
 * Public submission. There's no customer auth (see supabase/orders.sql), so
 * this always runs through the service-role client — mirrors
 * createPendingOrder in lib/data/orders.ts. Status is hardcoded to "Pending"
 * here rather than taken from the caller, so a review can never self-publish.
 */
export async function createReview(input: CreateReviewInput): Promise<Review> {
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from("reviews")
    .insert({
      category: input.category,
      reference: input.reference ?? null,
      reference_label: input.referenceLabel ?? null,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      rating: input.rating,
      comment: input.comment,
      status: "Pending",
    })
    .select("*")
    .single()

  if (error) throw new Error(`Failed to submit review: ${error.message}`)
  return fromRow(data as ReviewRow)
}

/**
 * Recomputes a Pre-built PC's aggregate rating/reviewCount from its Published
 * reviews, so the existing star UI (which just renders
 * product.rating/reviewCount) reflects real moderated feedback instead of an
 * admin-typed number. Leaves the product's rating untouched if it has no
 * published reviews, rather than zeroing out an admin-seeded baseline.
 */
async function recomputePrebuiltRating(slug: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("category", "Pre-built PC")
    .eq("reference", slug)
    .eq("status", "Published")

  if (error) throw new Error(`Failed to recompute product rating: ${error.message}`)

  const ratings = (data as { rating: number }[]).map((r) => r.rating)
  if (ratings.length === 0) return

  const product = await getPrebuiltProductBySlug(slug)
  if (!product) return

  const reviewCount = ratings.length
  const rating = Math.round(ratings.reduce((sum, r) => sum + r, 0) / reviewCount)

  await updatePrebuiltProduct(slug, { ...product, rating, reviewCount })
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<Review> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update review: ${error.message}`)
  const review = fromRow(data as ReviewRow)

  if (review.category === "Pre-built PC" && review.reference) {
    await recomputePrebuiltRating(review.reference)
  }

  return review
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { data, error: fetchError } = await supabase.from("reviews").select("*").eq("id", id).single()
  if (fetchError) throw new Error(`Failed to load review: ${fetchError.message}`)
  const review = fromRow(data as ReviewRow)

  const { error } = await supabase.from("reviews").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete review: ${error.message}`)

  if (review.category === "Pre-built PC" && review.reference) {
    await recomputePrebuiltRating(review.reference)
  }
}
