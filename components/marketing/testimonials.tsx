import Image from "next/image";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Walked in at noon, walked out at 12:40 with a perfect screen. Genuinely the smoothest repair I've ever had.",
    name: "Marcus Levine",
    detail: "iPhone 15 Pro screen",
  },
  {
    quote:
      "They rescued four years of my photography portfolio from a dead MacBook. Zero drama, fair price, glorious result.",
    name: "Priya Anand",
    detail: "MacBook Pro logic board",
  },
  {
    quote:
      "The build quality is on another level. Cable management, thermal paste application, benchmarking — all documented.",
    name: "David Okafor",
    detail: "Custom PC build",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-184 w-155 -translate-y-1/2 sm:block lg:-right-10"
      >
        <Image
          src="/large-white-pc.png"
          alt=""
          fill
          className="object-contain object-right"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="soft" className="mx-auto">
            <span className="size-1.5 rounded-full bg-primary" />
            Loved by locals
          </Badge>

          <Reveal delay={0.1}>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Trusted by 20,000+
              <br />
              <span className="gradient-text-brand">device</span> owners.
            </h2>
          </Reveal>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <RevealItem
              key={testimonial.name}
              className="rounded border border-border bg-card p-5 shadow-card"
            >
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary gradient-text-brand"
                  />
                ))}
              </span>

              <p className="mt-3 text-sm text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-border pt-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.detail}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
