import type { Metadata } from "next";
import Image from "next/image";
import { MonitorCheck, ShieldCheck, Truck, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { PrebuiltCatalog } from "@/components/prebuilt/prebuilt-catalog";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { listPrebuiltProducts } from "@/lib/data/prebuilt";

export const metadata: Metadata = {
  title: "Prebuilt PCs | PC Xpress",
  description:
    "Hand-built, stress-tested prebuilt gaming, creator, and office PCs â€” dispatched next working day with a 12-month warranty.",
};

const TRUST_STRIP = [
  { icon: Wrench, label: "Hand-built & stress-tested in our Wimbledon studio" },
  { icon: Truck, label: "Free UK delivery, dispatched next working day" },
  { icon: ShieldCheck, label: "12+ month parts & labour warranty" },
  { icon: MonitorCheck, label: "Every build benchmarked before it ships" },
];

export const dynamic = "force-dynamic";

export default async function PrebuiltPcsPage() {
  const products = await listPrebuiltProducts();

  return (
    <div>
      <section className="relative overflow-hidden py-14 md:pt-40 md:pb-20">
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
              <span className="size-1.5 rounded-full bg-primary" />
              Ready to Ship
            </Badge>
          </Reveal>

          <TextReveal
            as="h1"
            text="Prebuilt PCs, built right the first time"
            delay={0.1}
            className="mx-auto mt-3 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-4xl"
          />

          <Reveal delay={0.25}>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              Every system is assembled, cable-managed, and benchmarked by our
              technicians before it leaves the studio â€” pick a build and it
              ships next working day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border py-6">
        <RevealGroup className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {TRUST_STRIP.map(({ icon: Icon, label }) => (
            <RevealItem key={label} className="flex items-start gap-2.5">
              <Icon className="size-4 shrink-0 text-primary" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <PrebuiltCatalog products={products} />
      </section>

      <CtaBanner />
    </div>
  );
}
