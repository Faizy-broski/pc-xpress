import { NextResponse } from "next/server"

import { createDeviceType, listBrandsByDevice, listDeviceTypes, listFaultsByDevice } from "@/lib/data/repair"
import type { DeviceType } from "@/components/repair/data"

export async function GET() {
  try {
    const [deviceTypes, brands, faults] = await Promise.all([
      listDeviceTypes(),
      listBrandsByDevice(),
      listFaultsByDevice(),
    ])
    return NextResponse.json({ deviceTypes, brands, faults })
  } catch (error) {
    console.error("Failed to list device types", error)
    return NextResponse.json({ error: "Could not load the repair catalog." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let body: Partial<DeviceType>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.id || !body.label || !body.icon || !body.description) {
    return NextResponse.json(
      { error: "id, label, icon, and description are required." },
      { status: 400 }
    )
  }

  try {
    const created = await createDeviceType(body as DeviceType)
    return NextResponse.json({ deviceType: created }, { status: 201 })
  } catch (error) {
    console.error("Failed to create device type", error)
    return NextResponse.json({ error: "Could not create the device type." }, { status: 500 })
  }
}
