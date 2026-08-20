import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Eye,
  Gauge,
  Heart,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { WhyPcXpress } from "@/components/marketing/why-pc-xpress";
import { Testimonials } from "@/components/marketing/testimonials";
import { VisitShop } from "@/components/marketing/visit-shop";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "About Us | PC Xpress",
  description:
    "Meet PC Xpress â€” Wimbledon's studio for honest PC and device repairs, custom builds, and pre-built PCs. Learn our story, values, and the team behind the bench.",
};

const VALUES = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every quote is upfront and every diagnosis explained in plain English â€” no jargon, no surprise charges.",
  },
  {
    icon: Gauge,
    title: "Speed",
    description:
      "Most repairs are done same-day. We respect your time as much as your device.",
  },
  {
    icon: Award,
    title: "Craft",
    description:
      "Board-level engineers who treat every repair and build like it's going in their own machine.",
  },
  {
    icon: Heart,
    title: "Care",
    description:
      "From first message to collection, you're a person to us â€” not a ticket number.",
  },
];

const TEAM = [
  {
    initials: "SA",
    name: "Saqalain Abid",
    role: "Founder & Lead Technician",
    bio: "10+ years fixing everything from cracked screens to dead motherboards.",
  },
  {
    initials: "RK",
    name: "Ravi Kumar",
    role: "Senior Repair Engineer",
    bio: "Board-level repairs and data recovery specialist.",
  },
  {
    initials: "EM",
    name: "Ella Morgan",
    role: "Build Specialist",
    bio: "Cable management perfectionist and custom PC benchmarking lead.",
  },
  {
    initials: "JT",
    name: "Jamie Turner",
    role: "Customer Care Lead",
    bio: "Keeps every booking, quote and collection running smoothly.",
  },
];

const MILESTONES = [
  { year: "2016", label: "PC Xpress opens on The Broadway" },
  { year: "2019", label: "5,000th repair completed" },
  { year: "2022", label: "Custom PC build service launches" },
  { year: "2026", label: "20,000+ devices repaired & counting" },
];

export default function AboutPage() {
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
        <div className="relative mx-auto max-w-screen-2xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <Badge variant="soft" className="mx-auto bg-white/10 text-white">
              <Sparkles className="size-3.5" />
              About Us
            </Badge>
          </Reveal>

          <TextReveal
            as="h1"
            text="A repair studio, not a repair shop"
            delay={0.1}
            className="mx-auto mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-4xl"
          />

          <Reveal delay={0.25}>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              We started PC Xpress in Wimbledon to prove that fast, honest
              device repairs and custom builds could feel like a boutique
              experience â€” not a gamble.
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
              render={<Link href="/services" />}
            >
              Explore services
            </Button>
          </Reveal> */}
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal className="relative">
            <div className="relative aspect-5/4 w-full overflow-hidden rounded shadow-card">
              <Image
                src="/hero.png"
                alt="PC Xpress repair studio"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <Badge variant="soft">
              <span className="size-1.5 rounded-full bg-primary" />
              Our story
            </Badge>

            <Reveal delay={0.1}>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Built on The Broadway,
                <br />
                <span className="text-primary">trusted</span> by thousands.
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-3 flex flex-col gap-3 text-muted-foreground">
                <p>
                  PC Xpress began as a single repair bench with one simple
                  rule: never quote a job we wouldn&apos;t trust with our own
                  devices. A decade later, that rule still runs the studio.
                </p>
                <p>
                  Today we repair phones, tablets, laptops, consoles and
                  desktops, recover data from drives written off elsewhere,
                  and hand-build custom PCs to spec â€” all from the same
                  Wimbledon storefront, with the same free diagnostics and
                  transparent pricing we started with.
                </p>
              </div>
            </Reveal>

            <RevealGroup className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MILESTONES.map((milestone) => (
                <RevealItem
                  key={milestone.year}
                  className="rounded border border-border bg-card p-3 text-center"
                >
                  <p className="text-lg font-bold text-primary">{milestone.year}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{milestone.label}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary py-14 text-secondary-foreground sm:py-16">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="soft" className="mx-auto">
              <ShieldCheck className="size-3.5" />
              What we stand for
            </Badge>
            <Reveal delay={0.1}>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Values that <span className="text-primary">outlast</span> the warranty.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-3 text-secondary-foreground/65">
                The same four principles guide every repair, build and
                conversation â€” whether it's a Â£20 fix or a Â£2,000 build.
              </p>
            </Reveal>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <RevealItem
                key={value.title}
                className="rounded border-2 border-border bg-card p-6 text-center transition-colors hover:border-primary"
              >
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent">
                  <value.icon className="size-5 text-primary" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <WhyPcXpress />

      {/* <section className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="soft" className="mx-auto">
            <Target className="size-3.5" />
            Meet the team
          </Badge>
          <Reveal delay={0.1}>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              The hands behind <span className="text-primary">the bench</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-3 text-muted-foreground">
              Certified technicians and build specialists who genuinely enjoy
              the puzzle of a hard fix.
            </p>
          </Reveal>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <RevealItem
              key={member.name}
              className="rounded border border-border bg-card p-5 text-center shadow-card"
            >
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-base font-semibold text-accent-foreground">
                {member.initials}
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-primary">{member.role}</p>
              <p className="mt-2 text-xs text-muted-foreground">{member.bio}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section> */}

      <Testimonials />

      <VisitShop />

      <CtaBanner />
    </div>
  );
}
