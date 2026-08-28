import Image from "next/image";
import { Zap, ShieldCheck, Wrench, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

interface Stat {
  icon: typeof Zap;
  title: string;
  description: string;
}

const STATS: Stat[] = [
  {
    icon: Zap,
    title: "45 min",
    description: "Express repairs on most iPhone screens & batteries.",
  },
  {
    icon: ShieldCheck,
    title: "12 months",
    description: "Full warranty on parts and workmanship.",
  },
  {
    icon: Wrench,
    title: "Master techs",
    description: "Board-level engineers with 10+ years' experience.",
  },
  {
    icon: Star,
    title: "4.9 rating",
    description: "Consistently top-reviewed studio in the city.",
  },
];

export function WhyPcXpress() {
  return (
    <section className="relative mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                  <div className="absolute -left-14 top-40 hidden w-2/5 -translate-y-1/2 sm:block">
              <Image
                src="/white-pc.png"
                alt="Custom white PC build"
                width={400}
                height={400}
                className="w-full opacity-90"
              />
            </div>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <Badge variant="soft">
            <span className="size-1.5 rounded-full bg-primary" />
            Why PC Xpress
          </Badge>

          <Reveal delay={0.1}>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Precision. Speed.
              <br />
              <span className="text-primary">Zero</span> guesswork.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-3 max-w-md text-muted-foreground">
              We built PC Xpress around a simple idea: professional
              diagnostics, transparent pricing, and a studio experience that
              feels closer to a boutique than a repair shop.
            </p>
          </Reveal>

          <RevealGroup className="mt-6 grid grid-cols-2 gap-3">
            {STATS.map((stat) => (
              <RevealItem
                key={stat.title}
                className="rounded border border-border bg-card p-4"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-accent">
                  <stat.icon className="size-4 text-primary" />
                </span>
                <h3 className="mt-3 font-semibold text-foreground">
                  {stat.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none">

            <div className="relative aspect-5/5 w-full overflow-hidden rounded shadow-card">
              <Image
                src="/pc-xpress-shop.png"
                alt="PC Xpress repair shop storefront"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
