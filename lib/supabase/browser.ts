import { createBrowserClient } from "@supabase/ssr"

/**
 * Browser-side Supabase client, used only for auth (sign in/up/out) from
 * Client Components. Data access still goes through the Next.js API routes,
 * not this client.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env."
    )
  }

  return createBrowserClient(url, key)
}
