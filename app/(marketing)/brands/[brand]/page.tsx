import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { CatalogIcon } from "@/components/icons/icon-registry";
import { listBrandsByDevice, listDeviceTypes, listFaultsByDevice } from "@/lib/data/repair";
import { BRAND_COPY } from "@/lib/data/brand-copy";

export const dynamic = "force-dynamic";

interface PageParams {
  params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { brand } = await params;
  const copy = BRAND_COPY[brand];
  if (!copy) return {};

  return {
    title: `${copy.name} Repairs | PC Xpress`,
    description: copy.description,
  };
}

export default async function BrandPage({ params }: PageParams) {
  const { brand } = await params;
  const copy = BRAND_COPY[brand];
  if (!copy) notFound();

  const [deviceTypes, brandsByDevice, faultsByDevice] = await Promise.all([
    listDeviceTypes(),
    listBrandsByDevice(),
    listFaultsByDevice(),
  ]);

  const devicesForBrand = deviceTypes.filter((dt) =>
    (brandsByDevice[dt.id] ?? []).some((b) => b.id === brand)
  );

  if (devicesForBrand.length === 0) notFound();

  return (
    <div>
      <section className="relative overflow-hidden pt-34 pb-16 md:pt-40 md:pb-20">
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
              {copy.name} Repairs
            </Badge>
          </Reveal>

          <TextReveal
            as="h1"
            text={copy.tagline}
            delay={0.1}
            className="mx-auto mt-3 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-4xl"
          />

          <Reveal delay={0.25}>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/75 sm:text-base">
              {copy.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-12 text-foreground sm:py-16">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              Choose your {copy.name} device
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a device below to see repair options and get an instant price estimate.
            </p>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devicesForBrand.map((dt, index) => {
              const faults = (faultsByDevice[dt.id] ?? []).slice(0, 3);
              return (
                <Reveal key={dt.id} delay={index * 0.05}>
                  <Link
                    href={`/repair-a-device?device=${dt.id}&brand=${brand}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/60"
                  >
                    <CatalogIcon name={dt.icon} className="size-6 text-primary" />
                    <h3 className="mt-3 text-base font-semibold text-foreground">
                      {copy.name} {dt.label} Repair
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{dt.description}</p>

                    {faults.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {faults.map((f) => (
                          <li key={f.id}>&bull; {f.label}</li>
                        ))}
                      </ul>
                    )}

                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Book a repair
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
