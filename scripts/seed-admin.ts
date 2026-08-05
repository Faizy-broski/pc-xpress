/**
 * Creates or updates the Supabase auth user for the ADMIN_EMAILS owner
 * account, using ADMIN_PASSWORD from .env. Run with `npm run seed:admin`.
 */
import { createClient } from "@supabase/supabase-js"

process.loadEnvFile(".env")

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const email = process.env.ADMIN_EMAILS?.split(",")[0]?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
  }
  if (!email) {
    throw new Error("Missing ADMIN_EMAILS in .env")
  }
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD in .env")
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: list, error: listError } = await admin.auth.admin.listUsers()
  if (listError) throw listError

  const existing = list.users.find((u) => u.email?.toLowerCase() === email)

  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, { password })
    if (error) throw error
    console.log(`Updated password for ${email}.`)
  } else {
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error) throw error
    console.log(`Created admin user ${email}.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
