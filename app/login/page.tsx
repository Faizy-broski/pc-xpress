import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ClipboardListIcon, CpuIcon, ShieldCheckIcon, WrenchIcon } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "Admin Login | PC Xpress",
}

const HIGHLIGHTS = [
  { icon: WrenchIcon, label: "Track every repair job from intake to pickup" },
  { icon: CpuIcon, label: "Manage prebuilt and custom-build catalogs" },
  { icon: ClipboardListIcon, label: "Keep bookings and stock in one place" },
]

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-brand lg:flex lg:flex-col lg:justify-between lg:p-10 lg:text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero [--gradient-hero-pos:20%_10%]" />

        <Link href="/" className="relative z-10 w-fit transition-transform hover:scale-[1.02]">
          <Image
            src="/pc-xpress.png"
            alt="PC Xpress"
            width={404}
            height={110}
            className="h-9 w-auto brightness-0 invert"
          />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Run the whole shop from one dashboard.
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Bookings, catalogs, inventory, and customers — everything your team needs to
            keep PC Xpress moving.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 flex items-center gap-1.5 text-xs text-white/50">
          <ShieldCheckIcon className="size-3.5" />
          Access is restricted to authorized shop admins.
        </p>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden bg-muted/30 px-4 py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-60 [--gradient-hero-pos:50%_0%] lg:hidden" />

        <Reveal viewTrigger={false} className="relative w-full max-w-sm">
          <div className="mb-7 flex flex-col items-center gap-3 text-center lg:hidden">
            <Link
              href="/"
              className="rounded bg-gradient-brand px-6 py-3.5 shadow-glow transition-transform hover:scale-[1.02]"
            >
              <Image
                src="/pc-xpress.png"
                alt="PC Xpress"
                width={404}
                height={110}
                className="h-8 w-auto"
              />
            </Link>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheckIcon className="size-3.5" />
              Access is restricted to authorized shop admins.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="mb-6">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to manage bookings and catalogs.
              </p>
            </div>
            <LoginForm />
          </div>
        </Reveal>
      </div>
    </div>
  )
}
