import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const PHONE = "+44 7307 093007";
const ADDRESS = "94 The Broadway, Wimbledon SW19 1RH";
const HOURS = "Mon – Sat: 9am – 6:30pm · Sun: Closed";
const WHATSAPP_HREF = `https://wa.me/${PHONE.replace(/\D/g, "")}`;
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  `PC Xpress, ${ADDRESS}`
)}&output=embed`;

const fieldClass =
  "w-full rounded border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function VisitShop() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 hidden h-186 w-186 -translate-y-1/2 sm:block"
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
            Visit the studio
          </Badge>

          <Reveal delay={0.1}>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Visit <span className="text-primary">the</span> shop
            </h2>
          </Reveal>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-5 lg:grid-cols-2">
          <RevealItem className="rounded border border-border bg-card p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">
              Send us a message
            </h3>

            <form className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                className={fieldClass}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className={fieldClass}
              />
              <input
                type="text"
                name="issue"
                placeholder="Device & issue (e.g. iPhone 14 — cracked screen)"
                className={fieldClass}
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us more..."
                className={cn(fieldClass, "resize-none")}
              />

              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full rounded"
              >
                Send Message
              </Button>
            </form>
          </RevealItem>

          <RevealItem className="flex flex-col gap-5">
            <div className="h-44 overflow-hidden rounded border border-border sm:h-52">
              <iframe
                src={MAP_SRC}
                title="PC Xpress on Google Maps"
                loading="lazy"
                className="h-full w-full grayscale-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="relative flex-1 overflow-hidden rounded">
              <Image
                src="/pc-xpress-shop.png"
                alt="PC Xpress repair studio"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/75" />

              <div className="relative flex h-full flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold text-white">
                  PC Xpress Studio
                </h3>

                <div className="flex flex-col gap-2 text-sm text-white/70">
                  <span className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-white" />
                    {ADDRESS}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0 text-white" />
                    {HOURS}
                  </span>
                  <a
                    href={`tel:${PHONE.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <Phone className="size-4 shrink-0 text-white" />
                    {PHONE}
                  </a>
                </div>

                <Button
                  size="sm"
                  className="mt-auto w-fit rounded bg-[#25D366] text-white hover:bg-[#25D366]/90 p-4"
                  nativeButton={false}
                  render={<Link href={WHATSAPP_HREF} />}
                >
                  Chat on WhatsApp
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
