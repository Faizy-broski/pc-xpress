import { NextResponse } from "next/server"

import { createLead, listLeads } from "@/lib/data/leads"
import { sendLeadEmail } from "@/lib/mail"

// Admin dashboard read only — there is no public feed for leads.
export async function GET() {
  try {
    const leads = await listLeads()
    return NextResponse.json({ leads })
  } catch (error) {
    console.error("Failed to list leads", error)
    return NextResponse.json({ error: "Could not load leads." }, { status: 500 })
  }
}

interface CreateLeadBody {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export async function POST(request: Request) {
  let body: CreateLeadBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "name and email are required." }, { status: 400 })
  }

  try {
    const lead = await createLead({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || undefined,
      message: body.message?.trim() || undefined,
    })

    try {
      await sendLeadEmail({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        source: "Homepage Form",
      })
    } catch (error) {
      console.error("Failed to send lead notification email", error)
    }

    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    console.error("Failed to submit lead", error)
    return NextResponse.json({ error: "Could not submit your details." }, { status: 500 })
  }
}
