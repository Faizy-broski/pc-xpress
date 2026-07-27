import { redirect } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardStoreProvider } from "@/components/dashboard/store"
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme-provider"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/auth/admin"
import { listDeviceTypes, listBrandsByDevice, listFaultsByDevice } from "@/lib/data/repair"
import { listCategories } from "@/lib/data/build-a-pc"
import { listPrebuiltProducts } from "@/lib/data/prebuilt"
import { listOrders } from "@/lib/data/orders"
import { listReviews } from "@/lib/data/reviews"

// Admin-editable catalogs are Supabase-backed (see supabase/schema.sql);
// fetched here, server-side, so the dashboard never renders with an empty
// list while the client fetches on mount.
export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // proxy.ts already redirects unauthenticated/non-admin requests away from
  // /dashboard — this is the second line of defense Next.js recommends,
  // since proxy only does a fast "optimistic" check.
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdminEmail(supabase, user.email))) {
    redirect("/login")
  }

  const [deviceTypes, brands, faults, categories, prebuiltProducts, prebuiltOrders, reviews] =
    await Promise.all([
      listDeviceTypes(),
      listBrandsByDevice(),
      listFaultsByDevice(),
      listCategories(),
      listPrebuiltProducts(),
      listOrders(),
      listReviews(),
    ])

  const sidebarUser = {
    name: user.user_metadata?.full_name ?? user.email!.split("@")[0],
    email: user.email!,
  }

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar user={sidebarUser} />
          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 sm:px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <span className="text-sm font-medium text-muted-foreground">
                Admin Dashboard
              </span>
              {/* <div className="relative ml-auto hidden w-56 sm:block">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="h-8 rounded-lg pl-8" />
              </div> */}
            </header>
            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6 lg:p-8">
              <DashboardStoreProvider
                initialDeviceTypes={deviceTypes}
                initialBrands={brands}
                initialFaults={faults}
                initialCategories={categories}
                initialPrebuiltProducts={prebuiltProducts}
                initialPrebuiltOrders={prebuiltOrders}
                initialReviews={reviews}
              >
                {children}
              </DashboardStoreProvider>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  )
}
