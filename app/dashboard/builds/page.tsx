import Link from "next/link"
import { ArrowUpRightIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { SAVED_BUILDS } from "@/components/dashboard/data"
import { formatGBP } from "@/components/build-a-pc/data"

export default function DashboardBuildsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              My Builds
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configurations you&apos;ve saved from the PC builder.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/build-a-pc" />}
            className="rounded"
          >
            <PlusIcon />
            New build
          </Button>
        </div>
      </Reveal>

      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SAVED_BUILDS.map((build) => (
          <RevealItem
            key={build.id}
            className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <p className="font-semibold text-foreground">{build.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Updated {build.updated}
            </p>

            <ul className="mt-4 flex flex-1 flex-col gap-1.5 text-sm text-muted-foreground">
              {build.parts.map((part) => (
                <li key={part} className="flex items-start gap-1.5">
                  <span
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60"
                    aria-hidden
                  />
                  <span>{part}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-lg font-bold text-primary">
                {formatGBP(build.total)}
              </span>
              <Link
                href="/build-a-pc"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Continue editing
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
          </RevealItem>
        ))}

        <RevealItem>
          <Link
            href="/build-a-pc"
            className="flex h-full min-h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <PlusIcon className="size-5" />
            <span className="text-sm font-medium">Start a new build</span>
          </Link>
        </RevealItem>
      </RevealGroup>
    </div>
  )
}
