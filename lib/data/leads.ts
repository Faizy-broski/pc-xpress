import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export type LeadStatus = "New" | "Contacted" | "Closed"

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  status: LeadStatus
  date: string
}

interface LeadRow {
  id: string
  name: string
  email: string
  phone: string | null
  message: string | null
  status: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function fromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    message: row.message ?? undefined,
    status: row.status as LeadStatus,
    date: formatDate(row.created_at),
  }
}

/**
 * Admin dashboard read. Falls back to an empty list if Supabase isn't
 * reachable yet (schema not applied) — same convention as lib/data/orders.ts.
 */
export async function listLeads(): Promise<Lead[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return (data as LeadRow[]).map(fromRow)
  } catch (error) {
    console.warn("Could not load leads from Supabase:", error)
    return []
  }
}

export interface CreateLeadInput {
  name: string
  email: string
  phone?: string
  message?: string
}

/**
 * Public submission from the homepage hero form. There's no customer auth
 * (see supabase/orders.sql), so this always runs through the service-role
 * client — mirrors createReview in lib/data/reviews.ts. No email is sent;
 * the row just becomes visible in the admin dashboard's Leads table.
 */
export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from("leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message ?? null,
      status: "New",
    })
    .select("*")
    .single()

  if (error) throw new Error(`Failed to submit lead: ${error.message}`)
  return fromRow(data as LeadRow)
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update lead: ${error.message}`)
  return fromRow(data as LeadRow)
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await (await createSupabaseServerClient()).from("leads").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete lead: ${error.message}`)
}
