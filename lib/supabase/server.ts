import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Cookie-aware Supabase client for Server Components, Route Handlers, and
 * Server Actions. Used for both data access (catalog CRUD, public reads) and
 * auth (reading/refreshing the admin's session) — the same client works for
 * both since actual permissions come from Postgres RLS / Storage policies,
 * not from how the client was constructed.
 *
 * Must be awaited: reading cookies is an async, per-request operation in
 * this Next.js version.
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env."
    )
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component that can't set cookies — safe to
          // ignore since proxy.ts refreshes the session on every request.
        }
      },
    },
  })
}
