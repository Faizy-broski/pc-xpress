import { NextResponse } from "next/server"

import { deleteBrand, getBrand, updateBrand } from "@/lib/data/repair"
import type { Brand } from "@/components/repair/data"

interface RouteParams {
  params: Promise<{ deviceId: string; brandId: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { deviceId, brandId } = await params

  let body: Partial<Brand>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const existing = await getBrand(deviceId, brandId)
  if (!existing) {
    return NextResponse.json({ error: "Brand not found." }, { status: 404 })
  }

  const merged: Brand = { ...existing, ...body, id: existing.id }

  try {
    const updated = await updateBrand(deviceId, brandId, merged)
    return NextResponse.json({ brand: updated })
  } catch (error) {
    console.error("Failed to update brand", error)
    return NextResponse.json({ error: "Could not update the brand." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { deviceId, brandId } = await params

  try {
    await deleteBrand(deviceId, brandId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete brand", error)
    return NextResponse.json({ error: "Could not delete the brand." }, { status: 500 })
  }
}
