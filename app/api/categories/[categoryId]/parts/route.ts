import { NextResponse } from "next/server"

import { createPart } from "@/lib/data/build-a-pc"
import type { PartOption } from "@/components/build-a-pc/data"

interface RouteParams {
  params: Promise<{ categoryId: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { categoryId } = await params

  let body: Partial<PartOption>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.id || !body.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "id, name, and price are required." }, { status: 400 })
  }

  const part: PartOption = {
    id: body.id,
    name: body.name,
    price: body.price,
    specs: body.specs ?? [],
    inStock: body.inStock ?? true,
    badge: body.badge,
    socket: body.socket,
  }

  try {
    const created = await createPart(categoryId, part)
    return NextResponse.json({ part: created }, { status: 201 })
  } catch (error) {
    console.error("Failed to create part", error)
    return NextResponse.json({ error: "Could not create the part." }, { status: 500 })
  }
}
