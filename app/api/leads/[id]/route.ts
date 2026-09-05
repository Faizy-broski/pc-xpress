import { NextResponse } from "next/server"

import { deleteLead, updateLeadStatus, type LeadStatus } from "@/lib/data/leads"

interface RouteParams {
  params: Promise<{ id: string }>
}

const STATUSES: LeadStatus[] = ["New", "Contacted", "Closed"]

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.status || !(STATUSES as string[]).includes(body.status)) {
    return NextResponse.json({ error: "A valid status is required." }, { status: 400 })
  }

  try {
    const lead = await updateLeadStatus(id, body.status as LeadStatus)
    return NextResponse.json({ lead })
  } catch (error) {
    console.error("Failed to update lead", error)
    return NextResponse.json({ error: "Could not update the lead." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params

  try {
    await deleteLead(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete lead", error)
    return NextResponse.json({ error: "Could not delete the lead." }, { status: 500 })
  }
}
