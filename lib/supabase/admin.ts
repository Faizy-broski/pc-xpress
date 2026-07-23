import { createClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client — bypasses RLS and can call the Auth Admin
 * API (create/update/delete users). Server-only: never import this from a
 * Client Component or otherwise expose SUPABASE_SERVICE_ROLE_KEY to the
 * browser. Used exclusively by the Admin Users management Server Actions
 * (app/actions/admin-users.ts), which each re-check the caller is already an
 * authenticated admin before doing anything privileged.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase service role configuration. Set SUPABASE_SERVICE_ROLE_KEY in .env to manage admin users."
    )
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
