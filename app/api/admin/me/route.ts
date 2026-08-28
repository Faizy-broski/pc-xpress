import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/auth/admin"

// Lets client components (e.g. the public navbar) check "is the current
// visitor a signed-in admin?" without forcing every marketing page into
// dynamic rendering — only this tiny route reads cookies, not the pages.
export async function GET() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdminEmail(supabase, user.email))) {
    return NextResponse.json({ admin: null })
  }

  return NextResponse.json({
    admin: {
      name: user.user_metadata?.full_name ?? user.email!.split("@")[0],
      email: user.email!,
    },
  })
}
