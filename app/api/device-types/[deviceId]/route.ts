import { NextResponse } from "next/server"

import { deleteDeviceType, getDeviceType, updateDeviceType } from "@/lib/data/repair"
import type { DeviceType } from "@/components/repair/data"

interface RouteParams {
  params: Promise<{ deviceId: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { deviceId } = await params

  let body: Partial<DeviceType>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const existing = await getDeviceType(deviceId)
  if (!existing) {
    return NextResponse.json({ error: "Device type not found." }, { status: 404 })
  }

  const merged: DeviceType = { ...existing, ...body, id: existing.id }

  try {
    const updated = await updateDeviceType(deviceId, merged)
    return NextResponse.json({ deviceType: updated })
  } catch (error) {
    console.error("Failed to update device type", error)
    return NextResponse.json({ error: "Could not update the device type." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { deviceId } = await params

  try {
    await deleteDeviceType(deviceId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete device type", error)
    return NextResponse.json({ error: "Could not delete the device type." }, { status: 500 })
  }
}
