import { NextResponse } from "next/server"

import { deleteFault, getFault, updateFault } from "@/lib/data/repair"
import type { Fault } from "@/components/repair/data"

interface RouteParams {
  params: Promise<{ deviceId: string; faultId: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { deviceId, faultId } = await params

  let body: Partial<Fault>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const existing = await getFault(deviceId, faultId)
  if (!existing) {
    return NextResponse.json({ error: "Fault not found." }, { status: 404 })
  }

  const merged: Fault = { ...existing, ...body, id: existing.id }

  try {
    const updated = await updateFault(deviceId, faultId, merged)
    return NextResponse.json({ fault: updated })
  } catch (error) {
    console.error("Failed to update fault", error)
    return NextResponse.json({ error: "Could not update the fault." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { deviceId, faultId } = await params

  try {
    await deleteFault(deviceId, faultId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete fault", error)
    return NextResponse.json({ error: "Could not delete the fault." }, { status: 500 })
  }
}
