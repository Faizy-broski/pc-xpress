import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PREBUILT_PCS, type PrebuiltProduct, type PrebuiltSpec } from "@/components/prebuilt/data"

interface PrebuiltProductRow {
  slug: string
  sku: string
  name: string
  category: string
  badge: string | null
  tagline: string
  description: string
  images: string[]
  os: string
  rating: number
  review_count: number
  price: number
  was_price: number | null
  dispatch_date: string
  in_stock: boolean
  highlights: string[]
  specs: PrebuiltSpec[]
  whats_included: string[]
}

function fromRow(row: PrebuiltProductRow): PrebuiltProduct {
  return {
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category as PrebuiltProduct["category"],
    badge: (row.badge ?? undefined) as PrebuiltProduct["badge"],
    tagline: row.tagline,
    description: row.description,
    images: row.images ?? [],
    os: row.os,
    rating: row.rating,
    reviewCount: row.review_count,
    price: row.price,
    wasPrice: row.was_price ?? undefined,
    dispatchDate: row.dispatch_date,
    inStock: row.in_stock,
    highlights: row.highlights ?? [],
    specs: row.specs ?? [],
    whatsIncluded: row.whats_included ?? [],
  }
}

function toRow(product: PrebuiltProduct): PrebuiltProductRow {
  return {
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    category: product.category,
    badge: product.badge ?? null,
    tagline: product.tagline,
    description: product.description,
    images: product.images,
    os: product.os,
    rating: product.rating,
    review_count: product.reviewCount,
    price: product.price,
    was_price: product.wasPrice ?? null,
    dispatch_date: product.dispatchDate,
    in_stock: product.inStock,
    highlights: product.highlights,
    specs: product.specs,
    whats_included: product.whatsIncluded,
  }
}

/**
 * Falls back to the bundled static catalog if Supabase isn't reachable yet
 * (schema not applied, table not seeded, env vars missing). This lets the
 * site keep working today and switch over transparently once
 * supabase/schema.sql has been run and /api/admin/seed has been called.
 */
export async function listPrebuiltProducts(): Promise<PrebuiltProduct[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("prebuilt_products")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) throw new Error(error.message)
    return (data as PrebuiltProductRow[]).map(fromRow)
  } catch (error) {
    console.warn("Falling back to static prebuilt product catalog:", error)
    return PREBUILT_PCS
  }
}

export async function getPrebuiltProductBySlug(slug: string): Promise<PrebuiltProduct | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("prebuilt_products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? fromRow(data as PrebuiltProductRow) : null
  } catch (error) {
    console.warn("Falling back to static prebuilt product catalog:", error)
    return PREBUILT_PCS.find((product) => product.slug === slug) ?? null
  }
}

export async function createPrebuiltProduct(product: PrebuiltProduct): Promise<PrebuiltProduct> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("prebuilt_products")
    .insert(toRow(product))
    .select("*")
    .single()

  if (error) throw new Error(`Failed to create prebuilt product: ${error.message}`)
  return fromRow(data as PrebuiltProductRow)
}

export async function updatePrebuiltProduct(
  slug: string,
  product: PrebuiltProduct
): Promise<PrebuiltProduct> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("prebuilt_products")
    .update(toRow(product))
    .eq("slug", slug)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update prebuilt product: ${error.message}`)
  return fromRow(data as PrebuiltProductRow)
}

export async function deletePrebuiltProduct(slug: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("prebuilt_products").delete().eq("slug", slug)
  if (error) throw new Error(`Failed to delete prebuilt product: ${error.message}`)
}
