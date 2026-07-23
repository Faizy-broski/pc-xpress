"use server"

import { revalidatePath } from "next/cache"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isAdminEmail, getAdminEmails } from "@/lib/auth/admin"

export interface AdminUsersActionState {
  error?: string
  success?: string
}

export interface AdminUserRow {
  id: string
  email: string
  createdAt: string
  isOwner: boolean
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdminEmail(supabase, user.email))) {
    throw new Error("Not authorized.")
  }

  return { supabase, user }
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const { supabase } = await requireAdmin()

  const { data } = await supabase
    .from("admin_users")
    .select("id, email, created_at")
    .order("created_at", { ascending: true })

  const rows: AdminUserRow[] = (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    isOwner: false,
  }))

  // Owners (ADMIN_EMAILS) don't have an admin_users row, but they're
  // permanent admins — surface them too, marked read-only.
  const ownerEmails = getAdminEmails().filter(
    (email) => !rows.some((row) => row.email.toLowerCase() === email)
  )
  for (const email of ownerEmails) {
    rows.unshift({ id: `owner:${email}`, email, createdAt: "", isOwner: true })
  }

  return rows
}

export async function addAdminUser(
  _prevState: AdminUsersActionState,
  formData: FormData
): Promise<AdminUsersActionState> {
  try {
    await requireAdmin()
  } catch {
    return { error: "Not authorized." }
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Enter an email and a temporary password." }
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error || !data.user) {
    return { error: error?.message ?? "Could not create the account." }
  }

  const { supabase } = await requireAdmin()
  const { error: insertError } = await supabase
    .from("admin_users")
    .insert({ id: data.user.id, email })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath("/dashboard/settings")
  return {
    success: `Added ${email}. Share the temporary password with them securely — they can change it after logging in.`,
  }
}

export async function resetAdminPassword(
  _prevState: AdminUsersActionState,
  formData: FormData
): Promise<AdminUsersActionState> {
  try {
    await requireAdmin()
  } catch {
    return { error: "Not authorized." }
  }

  const id = String(formData.get("id") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!id || id.startsWith("owner:")) {
    return { error: "Owner accounts can't be reset from here — they sign in with their own password." }
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }

  const admin = createSupabaseAdminClient()
  const { error } = await admin.auth.admin.updateUserById(id, { password })

  if (error) {
    return { error: error.message }
  }

  return { success: "Password updated." }
}

export async function removeAdminUser(id: string): Promise<void> {
  const { supabase } = await requireAdmin()

  if (id.startsWith("owner:")) {
    throw new Error("Owner accounts can't be removed from here — edit ADMIN_EMAILS instead.")
  }

  const admin = createSupabaseAdminClient()
  await admin.auth.admin.deleteUser(id)
  await supabase.from("admin_users").delete().eq("id", id)

  revalidatePath("/dashboard/settings")
}
