import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Gamepad2,
  HardDrive,
  Laptop,
  MessageCircle,
  Search,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tablet,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { WhyPcXpress } from "@/components/marketing/why-pc-xpress";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Services | PC Xpress",
  description:
    "Repairs, upgrades, custom builds and pre-built PCs — explore everything PC Xpress offers, from same-day device fixes to bespoke gaming rigs.",
};

const PHONE = "+44 7307 093007";
const WHATSAPP_HREF = `https://wa.me/${PHONE.replace(/\D/g, "")}`;

interface ServiceCard {
  icon: typeof Wrench;
  title: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
}

const REPAIR_SERVICES: ServiceCard[] = [
  {
    icon: Smartphone,
    title: "Phone Repair",
    description:
      "Cracked screens, drained batteries, water damage & camera faults — fixed while you wait.",
    points: ["Screen & battery swaps", "Charging port fixes", "Water damage recovery"],
    href: "/repair-a-device?device=phone",
    cta: "Book phone repair",
  },
  {
    icon: Tablet,
    title: "Tablet Repair",
    description:
      "iPad, Galaxy Tab & Surface repairs — display, digitiser and battery work by certified techs.",
    points: ["Digitiser & glass repair", "Battery replacement", "Charging & button faults"],
    href: "/repair-a-device?device=tablet",
    cta: "Book tablet repair",
  },
  {
    icon: Laptop,
    title: "Laptop Repair",
    description:
      "MacBook & Windows laptops — screen replacements, keyboard fixes, battery swaps & full diagnostics.",
    points: ["Screen & keyboard replacement", "Battery & hinge repair", "Boot & performance issues"],
    href: "/repair-a-device?device=laptop",
    cta: "Book laptop repair",
  },
  {
    icon: Cpu,
    title: "Desktop PC Repair",
    description:
      "Custom builds & prebuilt towers — component swaps, cooling fixes, boot issues & tuning.",
    points: ["Component diagnostics & swaps", "Cooling & thermal fixes", "Boot & POST failures"],
    href: "/repair-a-device?device=desktop",
    cta: "Book PC repair",
  },
  {
    icon: Gamepad2,
    title: "Console Repair",
    description:
      "PlayStation, Xbox & Switch — HDMI ports, overheating, disc drives & controller drift fixes.",
    points: ["HDMI & port repair", "Overheating & fan noise", "Disc drive & drift fixes"],
    href: "/repair-a-device?device=console",
    cta: "Book console repair",
  },
  {
    icon: HardDrive,
    title: "Data Recovery",
    description:
      "Rescuing photos, files & documents from failed, corrupted or water-damaged drives.",
    points: ["Failed HDD/SSD recovery", "Corrupted file rescue", "Secure, confidential handling"],
    href: "/repair-a-device",
    cta: "Ask about data recovery",
  },
  {
    icon: Shield,
    title: "Virus & Malware Removal",
    description:
      "Deep malware clean-up, security hardening and safe browsing setup for every device.",
    points: ["Full malware clean-up", "Security hardening", "Safe browsing setup"],
    href: "/repair-a-device",
    cta: "Ask about virus removal",
  },
  {
    icon: Wrench,
    title: "Upgrade & Maintenance",
    description:
      "RAM, storage & GPU upgrades plus deep cleans and thermal repaste to keep devices running fast.",
    points: ["RAM, storage & GPU upgrades", "Deep clean & repaste", "Preventative maintenance"],
    href: "/repair-a-device",
    cta: "Ask about an upgrade",
  },
];

const BUILD_SERVICES: ServiceCard[] = [
  {
    icon: Cpu,
    title: "Custom PC Builds",
    description:
      "Tell us your budget and workload — we spec, build, cable-manage and stress-test a PC to match.",
    points: ["Free consultation & spec", "Cable management included", "Full stress-test & benchmarking"],
    href: "/build-a-pc",
    cta: "Start a custom build",
  },
  {
    icon: ShoppingBag,
    title: "Pre-Built PCs",
    description:
      "Hand-picked configs for gaming, creative work and everyday power — tested and ready to ship.",
    points: ["Gaming & workstation configs", "Tested before dispatch", "Warranty included"],
    href: "/prebuilt-pcs",
    cta: "Shop pre-built PCs",
  },
];

const PROCESS_STEPS = [
  {
    icon: Search,
    title: "Free diagnostics",
    description: "Bring it in or book online — we assess the issue and confirm the fix, at no cost.",
  },
  {
    icon: Sparkles,
    title: "Transparent quote",
    description: "You get a clear, upfront price before any work begins. No surprises, no obligation.",
  },
  {
    icon: Wrench,
    title: "Expert work",
    description: "Certified technicians repair, upgrade or build using quality parts and careful process.",
  },
  {
    icon: Shield,
    title: "Warranty & collection",
    description: "Every job ships with a warranty — collect in-studio or arrange delivery.",
  },
];

function ServiceCardItem({ service }: { service: ServiceCard }) {
  const Icon = service.icon;
  return (
    <RevealItem className="group relative isolate flex h-full flex-col overflow-hidden rounded border-2 border-border bg-secondary p-6 transition-colors hover:border-primary hover:shadow-glow">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-hero opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <span className="flex size-12 items-center justify-center rounded-full bg-accent">
        <Icon className="size-5 text-primary" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-secondary-foreground">
        {service.title}
      </h3>
      <p className="mt-2 text-sm text-secondary-foreground/65">
        {service.description}
      </p>
      <ul className="mt-4 flex flex-col gap-1.5">
        {service.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2 text-xs text-secondary-foreground/70"
          >
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
            {point}
          </li>
        ))}
      </ul>
      <Link
        href={service.href}
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary transition-colors group-hover:gap-1.5"
      >
        {service.cta}
        <ArrowRight className="size-3.5" />
      </Link>
    </RevealItem>
  );
}

export default function ServicesPage() {
  return (
    <div>
      <section className="relative overflow-hidden pt-34 pb-20 md:pt-40 md:pb-20">
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <Badge variant="soft" className="mx-auto bg-white/10 text-white">
              <Sparkles className="size-3.5" />
              Our Services
            </Badge>
          </Reveal>

          <TextReveal
            as="h1"
            text="Everything your devices need"
            delay={0.1}
            className="mx-auto mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-4xl"
          />

          <Reveal delay={0.25}>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              From same-day repairs to bespoke gaming rigs — one studio for
              diagnostics, fixes, upgrades and builds.
            </p>
          </Reveal>

          {/* <Reveal delay={0.35} className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded p-4"
              nativeButton={false}
              render={<Link href="/repair-a-device" />}
            >
              Book a repair
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded border-white/15 bg-white/5 p-4 text-white backdrop-blur-xl hover:bg-white/10 hover:text-white"
              nativeButton={false}
              render={<Link href="/build-a-pc" />}
            >
              Build a PC
            </Button>
          </Reveal> */}
        </div>
      </section>

      <section className="relative overflow-hidden bg-background py-14 text-foreground sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 opacity-60 sm:-bottom-16 sm:-left-14 sm:h-96 sm:w-96 lg:h-112 lg:w-md"
        >
          <Image
            src="/what-we-fix-bg-left.png"
            alt=""
            fill
            className="object-contain object-bottom-left"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="soft" className="mx-auto">
              <span className="size-1.5 rounded-full bg-primary" />
              Repairs
            </Badge>
            <Reveal delay={0.1}>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Every device, <span className="text-primary">handled</span> with care.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-3 text-muted-foreground">
                Free diagnostics, certified technicians and warranty-backed
                repairs across every device we touch.
              </p>
            </Reveal>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REPAIR_SERVICES.map((service) => (
              <ServiceCardItem key={service.title} service={service} />
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-background pb-14 text-foreground sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="soft" className="mx-auto">
              <span className="size-1.5 rounded-full bg-primary" />
              Builds
            </Badge>
            <Reveal delay={0.1}>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Built to <span className="text-primary">spec</span>, ready to run.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-3 text-muted-foreground">
                Whether you want it configured from scratch or shipped ready
                to go, we've got a build for your budget.
              </p>
            </Reveal>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
            {BUILD_SERVICES.map((service) => (
              <ServiceCardItem key={service.title} service={service} />
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary py-14 text-secondary-foreground sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/2 hidden h-140 w-120 -translate-y-1/2 opacity-40 sm:block lg:-left-10"
        >
          <Image
            src="/large-white-pc-left.png"
            alt=""
            fill
            className="object-contain object-left"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="soft" className="mx-auto">
              <span className="size-1.5 rounded-full bg-primary" />
              How it works
            </Badge>
            <Reveal delay={0.1}>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                From drop-off to <span className="text-primary">done</span>.
              </h2>
            </Reveal>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <RevealItem
                key={step.title}
                className="relative rounded border border-border bg-card p-5 shadow-card"
              >
                <span className="text-xs font-semibold text-primary">
                  Step {index + 1}
                </span>
                <span className="mt-3 flex size-10 items-center justify-center rounded-full bg-accent">
                  <step.icon className="size-4.5 text-primary" />
                </span>
                <h3 className="mt-3 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <WhyPcXpress />

      <Testimonials />

      <CtaBanner />
    </div>
  );
}
