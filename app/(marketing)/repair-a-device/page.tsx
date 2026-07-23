import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { RepairWizard } from "@/components/repair/repair-wizard";
import { ReviewSection } from "@/components/marketing/review-section";
import { type DeviceTypeId } from "@/components/repair/data";
import { listBrandsByDevice, listDeviceTypes, listFaultsByDevice } from "@/lib/data/repair";
import { listPublishedReviews } from "@/lib/data/reviews";

export const metadata: Metadata = {
  title: "Book a Repair | PC Xpress",
  description:
    "Select your device and issue to get an instant price estimate and book a repair with PC Xpress.",
};

export const dynamic = "force-dynamic";

interface PageParams {
  searchParams: Promise<{ device?: string }>;
}

export default async function RepairADevicePage({ searchParams }: PageParams) {
  const { device } = await searchParams;
  const [deviceTypes, brands, faults, reviews] = await Promise.all([
    listDeviceTypes(),
    listBrandsByDevice(),
    listFaultsByDevice(),
    listPublishedReviews("Repair"),
  ]);

  function isDeviceTypeId(value: string | undefined): value is DeviceTypeId {
    return deviceTypes.some((d) => d.id === value);
  }

  const initialDevice = isDeviceTypeId(device) ? device : undefined;

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
              Book a Repair
            </Badge>
          </Reveal>

          <TextReveal
            as="h1"
            text="Tell us what's broken"
            delay={0.1}
            className="mx-auto mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-4xl"
          />

          <Reveal delay={0.25}>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              Pick your device, brand, and issue for an instant price estimate
              — free diagnostics, no obligation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-8 text-foreground sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RepairWizard
            initialDevice={initialDevice}
            deviceTypes={deviceTypes}
            brands={brands}
            faults={faults}
          />
        </div>
      </section>

      <section id="reviews" className="bg-background pb-16 text-foreground sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <ReviewSection category="Repair" reviews={reviews} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
