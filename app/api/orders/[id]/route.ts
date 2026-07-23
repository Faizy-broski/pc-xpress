import { NextResponse } from "next/server"

import { deleteOrder, updateOrder } from "@/lib/data/orders"
import type { PrebuiltOrder } from "@/components/dashboard/data"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params

  let body: Partial<PrebuiltOrder>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  try {
    const updated = await updateOrder(decodeURIComponent(id), body)
    return NextResponse.json({ order: updated })
  } catch (error) {
    console.error("Failed to update order", error)
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params

  try {
    await deleteOrder(decodeURIComponent(id))
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete order", error)
    return NextResponse.json({ error: "Could not delete the order." }, { status: 500 })
  }
}
