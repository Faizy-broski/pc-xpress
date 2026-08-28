import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  MessageCircle,
  PackageCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const PHONE = "+44 7307 093007";
const WHATSAPP_HREF = `https://wa.me/${PHONE.replace(/\D/g, "")}`;

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Book a pickup slot",
    description: "Choose a time that works for you when you book your repair.",
  },
  {
    icon: Truck,
    title: "We collect your device",
    description: "Our courier picks it up from your home or office — free of charge.",
  },
  {
    icon: Wrench,
    title: "We repair it in-studio",
    description: "Certified techs diagnose and fix it, with photo updates along the way.",
  },
  {
    icon: PackageCheck,
    title: "We drop it back off",
    description: "Fully repaired and tested, delivered straight back to your door.",
  },
];

export function HomePickupService() {
  return (
    <section className="relative mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Reveal>
        <div className="dark relative isolate overflow-hidden rounded-2xl bg-gradient-brand text-foreground shadow-card">
          <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-60" />

          <div className="relative grid gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-12 lg:py-14">
            <div>
              <Badge
                variant="soft"
                className="border border-white/15 bg-white/10 text-white"
              >
                <Truck className="size-3.5" />
                Now Available
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Can&apos;t get to us? We&apos;ll come to you.
              </h2>

              <p className="mt-4 max-w-lg text-sm text-white/70 sm:text-base">
                Skip the trip to the studio — book our free home pickup &
                drop-off service and we&apos;ll collect your phone, laptop,
                console or PC in and around Wimbledon, repair it, and bring
                it right back to your door.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded p-4"
                  nativeButton={false}
                  render={<Link href="/repair-a-device" />}
                >
                  Book a Pickup
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded border-white/15 bg-white/5 p-4 text-white backdrop-blur-xl hover:bg-white/10 hover:text-white"
                  nativeButton={false}
                  render={<Link href={WHATSAPP_HREF} />}
                >
                  <MessageCircle />
                  Ask on WhatsApp
                </Button>
              </div>
            </div>

            <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {STEPS.map((step) => (
                <RevealItem
                  key={step.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <step.icon className="size-4 text-white" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/65">
                      {step.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
