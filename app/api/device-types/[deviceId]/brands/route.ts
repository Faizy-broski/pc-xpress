import { NextResponse } from "next/server"

import { createBrand } from "@/lib/data/repair"
import type { Brand } from "@/components/repair/data"

interface RouteParams {
  params: Promise<{ deviceId: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { deviceId } = await params

  let body: Partial<Brand>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.id || !body.label) {
    return NextResponse.json({ error: "id and label are required." }, { status: 400 })
  }

  try {
    const created = await createBrand(deviceId, body as Brand)
    return NextResponse.json({ brand: created }, { status: 201 })
  } catch (error) {
    console.error("Failed to create brand", error)
    return NextResponse.json({ error: "Could not create the brand." }, { status: 500 })
  }
}
