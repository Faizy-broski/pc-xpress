import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { isAdminEmail } from "@/lib/auth/admin"

// Next.js 16 renamed Middleware to Proxy — same file convention/runtime,
// see node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
//
// Real authorization also happens again in app/dashboard/layout.tsx as a
// second line of defense, per Next.js's own auth guidance.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    // Supabase isn't configured yet — don't lock everyone out of a
    // half-set-up project.
    return response
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isAuthRoute = pathname === "/login"
  const isAuthorized = Boolean(user) && (await isAdminEmail(supabase, user?.email))

  if (isDashboardRoute && !isAuthorized) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && isAuthorized) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
