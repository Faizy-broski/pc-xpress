import { NextResponse } from "next/server"

import { createPrebuiltProduct, listPrebuiltProducts } from "@/lib/data/prebuilt"
import type { PrebuiltProduct } from "@/components/prebuilt/data"

export async function GET() {
  try {
    const products = await listPrebuiltProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Failed to list prebuilt products", error)
    return NextResponse.json({ error: "Could not load prebuilt products." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let body: Partial<PrebuiltProduct>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.slug || !body.name || !body.category || typeof body.price !== "number") {
    return NextResponse.json(
      { error: "slug, name, category, and price are required." },
      { status: 400 }
    )
  }

  const product: PrebuiltProduct = {
    slug: body.slug,
    sku: body.sku ?? "",
    name: body.name,
    category: body.category,
    badge: body.badge,
    tagline: body.tagline ?? "",
    description: body.description ?? "",
    images: body.images ?? [],
    os: body.os ?? "",
    rating: body.rating ?? 5,
    reviewCount: body.reviewCount ?? 0,
    price: body.price,
    wasPrice: body.wasPrice,
    dispatchDate: body.dispatchDate ?? "",
    inStock: body.inStock ?? true,
    highlights: body.highlights ?? [],
    specs: body.specs ?? [],
    whatsIncluded: body.whatsIncluded ?? [],
  }

  try {
    const created = await createPrebuiltProduct(product)
    return NextResponse.json({ product: created }, { status: 201 })
  } catch (error) {
    console.error("Failed to create prebuilt product", error)
    return NextResponse.json({ error: "Could not create the prebuilt product." }, { status: 500 })
  }
}
