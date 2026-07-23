"use server"

import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/auth/admin"

export interface AuthFormState {
  error?: string
  info?: string
}

export async function login(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Enter your email and password." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "Invalid email or password." }
  }

  if (!(await isAdminEmail(supabase, email))) {
    await supabase.auth.signOut()
    return { error: "This account isn't authorized for the admin dashboard." }
  }

  redirect("/dashboard")
}

export async function logout() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}
