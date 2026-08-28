import { NextResponse } from "next/server"

import { createFault } from "@/lib/data/repair"
import type { Fault } from "@/components/repair/data"

interface RouteParams {
  params: Promise<{ deviceId: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const { deviceId } = await params

  let body: Partial<Fault>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.id || !body.label || !body.description || typeof body.priceFrom !== "number" || !body.etaLabel) {
    return NextResponse.json(
      { error: "id, label, description, priceFrom, and etaLabel are required." },
      { status: 400 }
    )
  }

  try {
    const created = await createFault(deviceId, body as Fault)
    return NextResponse.json({ fault: created }, { status: 201 })
  } catch (error) {
    console.error("Failed to create fault", error)
    return NextResponse.json({ error: "Could not create the fault." }, { status: 500 })
  }
}
