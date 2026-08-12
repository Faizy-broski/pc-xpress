import Link from "next/link";
import { ArrowRight, Home, Unplug } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Prebuilt PCs", href: "/prebuilt-pcs" },
  { label: "Build a PC", href: "/build-a-pc" },
  { label: "Contact Us", href: "/contact" },
];

export function NotFoundPanel() {
  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <Reveal>
        <span className="relative flex size-20 items-center justify-center rounded-3xl bg-accent text-accent-foreground shadow-glow">
          <Unplug className="size-9" />
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="gradient-text-brand mt-6 text-7xl font-black tracking-tight sm:text-8xl">
          404
        </p>
      </Reveal>

      <TextReveal
        as="h1"
        text="This page got unplugged"
        delay={0.15}
        className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      />

      <Reveal delay={0.3}>
        <p className="mt-3 max-w-sm text-muted-foreground">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          been moved, renamed, or it never existed on our bench.
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/" />}
            className="rounded-lg bg-gradient-button p-5 shadow-glow"
          >
            <Home />
            Back to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/prebuilt-pcs" />}
            className="rounded-lg p-5"
          >
            Shop Prebuilt PCs
            <ArrowRight />
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.5}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
