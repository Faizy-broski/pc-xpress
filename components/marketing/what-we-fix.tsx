import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

interface Service {
  icon: string;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: "/svg/SVG.svg",
    title: "Laptop Repair",
    description:
      "Screen replacements, keyboard fixes, battery swaps & full diagnostics.",
  },
  {
    icon: "/svg/SVG-1.svg",
    title: "PC Repair",
    description:
      "Component swaps, cooling fixes, boot issues & performance tuning.",
  },
  {
    icon: "/svg/SVG-2.svg",
    title: "Console Repair",
    description:
      "HDMI ports, overheating, disc drives & controller drift fixes.",
  },
  {
    icon: "/svg/SVG-3.svg",
    title: "Data Recovery",
    description:
      "Rescuing photos, files & documents from failed or corrupted drives.",
  },
  {
    icon: "/svg/SVG-4.svg",
    title: "Virus Removal",
    description: "Malware clean-up, security hardening & safe browsing setup.",
  },
  {
    icon: "/svg/SVG-5.svg",
    title: "Upgrade & Maintenance",
    description:
      "RAM, storage & GPU upgrades plus deep cleans and thermal repaste.",
  },
];

const TRUST_POINTS = [
  { icon: "/svg/SVG-6.svg", label: "Certified Technicians" },
  { icon: "/svg/SVG-7.svg", label: "Same-Day Repairs" },
  { icon: "/svg/SVG-8.svg", label: "Warranty Included" },
];

export function WhatWeFix() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      <div className="relative mx-auto max-w-screen-2xl px-4">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 sm:-bottom-16 sm:-left-14 sm:h-96 sm:w-96 lg:h-112 lg:w-md"
        >
          <Image
            src="/what-we-fix-bg-left.png"
            alt=""
            fill
            className="object-contain object-bottom-left"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 sm:right-4 sm:-top-6 sm:h-96 sm:w-96 lg:h-112 lg:w-md"
        >
          <Image
            src="/what-we-fix-bg-right.png"
            alt=""
            fill
            loading="eager"
            className="object-contain object-top-right"
          />
        </div>

        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="soft" className="mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image blocks local .svg sources by default */}
            <img src="/svg/SVG-10.svg" alt="" className="size-3.5" />
            What we fix
          </Badge>

          <Reveal delay={0.1}>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Every device, <span className="text-primary">handled</span>
              <br />
              like our own.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-3 text-muted-foreground">
              From cracked screens to dead motherboards â€” six specialist repair
              lines, one meticulous studio.
            </p>
          </Reveal>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <RevealItem
              key={service.title}
              className="group relative isolate overflow-hidden rounded border-2 border-border bg-secondary p-6 text-center transition-colors hover:border-primary hover:shadow-glow"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-hero opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent">
                {/* eslint-disable-next-line @next/next/no-img-element -- next/image blocks local .svg sources by default */}
                <img src={service.icon} alt="" className="size-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-secondary-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-secondary-foreground/65">
                {service.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal
          delay={0.1}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {TRUST_POINTS.map((point) => (
            <span
              key={point.label}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image blocks local .svg sources by default */}
              <img src={point.icon} alt="" className="size-4" />
              {point.label}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
