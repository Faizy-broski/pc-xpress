import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Bootstrap allowlist, set via ADMIN_EMAILS in .env (comma-separated). These
 * are permanent "owner" admins — they can't be removed or reset from the
 * dashboard's Admin Users panel (see app/actions/admin-users.ts), only by
 * editing .env directly.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function isEnvAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email)
}

/**
 * True if `email` is authorized for the admin dashboard: either it's an
 * ADMIN_EMAILS owner, or it's been added as a team admin via the dashboard
 * (stored in the admin_users table — see supabase/admin-users.sql). There is
 * no public sign-up anymore, so this is the only way to gain access. Checked
 * in proxy.ts (optimistic) and again in app/dashboard/layout.tsx (defense in
 * depth).
 */
export async function isAdminEmail(
  supabase: SupabaseClient,
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  if (isEnvAdminEmail(normalized)) return true

  const { data } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", normalized)
    .maybeSingle()

  return Boolean(data)
}
