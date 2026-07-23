import { redirect } from "next/navigation"

import { Reveal } from "@/components/motion/reveal"
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form"
import { AdminUsersPanel } from "@/components/dashboard/admin-users-panel"
import { listAdminUsers } from "@/app/actions/admin-users"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function DashboardSettingsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const admins = await listAdminUsers()
  const name = user.user_metadata?.full_name ?? user.email!.split("@")[0]

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Shop Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile, notification preferences, and dashboard admins.
          </p>
        </div>
      </Reveal>

      <Reveal viewTrigger={false} delay={0.05}>
        <ProfileSettingsForm name={name} email={user.email!} />
      </Reveal>

      <Reveal viewTrigger={false} delay={0.1}>
        <AdminUsersPanel initialUsers={admins} currentUserEmail={user.email!} />
      </Reveal>
    </div>
  )
}
