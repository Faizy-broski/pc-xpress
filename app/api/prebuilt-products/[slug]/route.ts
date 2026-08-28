import { NextResponse } from "next/server"

import { deletePrebuiltProduct, getPrebuiltProductBySlug, updatePrebuiltProduct } from "@/lib/data/prebuilt"
import type { PrebuiltProduct } from "@/components/prebuilt/data"

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { slug } = await params

  let body: Partial<PrebuiltProduct>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const existing = await getPrebuiltProductBySlug(slug)
  if (!existing) {
    return NextResponse.json({ error: "Prebuilt product not found." }, { status: 404 })
  }

  const merged: PrebuiltProduct = { ...existing, ...body, slug: existing.slug }

  try {
    const updated = await updatePrebuiltProduct(slug, merged)
    return NextResponse.json({ product: updated })
  } catch (error) {
    console.error("Failed to update prebuilt product", error)
    return NextResponse.json({ error: "Could not update the prebuilt product." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug } = await params

  try {
    await deletePrebuiltProduct(slug)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete prebuilt product", error)
    return NextResponse.json({ error: "Could not delete the prebuilt product." }, { status: 500 })
  }
}
