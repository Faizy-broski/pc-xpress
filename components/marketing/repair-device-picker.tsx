import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { DEVICE_TYPES } from "@/components/repair/data";

export function RepairDevicePicker() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Badge variant="soft" className="mx-auto">
          <Sparkles className="size-3.5" />
          Book a Repair
        </Badge>

        <Reveal delay={0.1}>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What needs <span className="text-primary">fixing</span> today?
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-3 text-muted-foreground">
            Pick your device and we&apos;ll walk you through the brand and
            issue for an instant price estimate.
          </p>
        </Reveal>
      </Reveal>

      <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {DEVICE_TYPES.map((device) => (
          <RevealItem key={device.id}>
            <Link
              href={`/repair-a-device?device=${device.id}`}
              className="group flex h-full flex-col items-center gap-2.5 rounded border border-border bg-card p-4 text-center shadow-card transition-colors hover:border-primary/50"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform group-hover:scale-110">
                <device.icon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-foreground">{device.label}</span>
              <span className="text-xs text-muted-foreground">{device.description}</span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.15} className="mt-8 flex justify-center">
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/repair-a-device" />}
          className="rounded bg-gradient-button p-5 shadow-glow"
        >
          Start Your Repair
          <ArrowRight />
        </Button>
      </Reveal>
    </section>
  );
}
