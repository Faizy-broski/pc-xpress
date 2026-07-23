import { NextResponse } from "next/server"

import { deletePart, getPart, updatePart } from "@/lib/data/build-a-pc"
import type { PartOption } from "@/components/build-a-pc/data"

interface RouteParams {
  params: Promise<{ categoryId: string; partId: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { categoryId, partId } = await params

  let body: Partial<PartOption>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const existing = await getPart(categoryId, partId)
  if (!existing) {
    return NextResponse.json({ error: "Part not found." }, { status: 404 })
  }

  const merged: PartOption = { ...existing, ...body, id: existing.id }

  try {
    const updated = await updatePart(categoryId, partId, merged)
    return NextResponse.json({ part: updated })
  } catch (error) {
    console.error("Failed to update part", error)
    return NextResponse.json({ error: "Could not update the part." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { categoryId, partId } = await params

  try {
    await deletePart(categoryId, partId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete part", error)
    return NextResponse.json({ error: "Could not delete the part." }, { status: 500 })
  }
}
