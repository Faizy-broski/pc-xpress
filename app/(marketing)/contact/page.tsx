import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Contact Us | PC Xpress",
  description:
    "Get in touch with PC Xpress in Wimbledon — call, WhatsApp, email or visit the studio for repairs, upgrades and custom PC builds.",
};

const PHONE = "+44 7307 093007";
const EMAIL = "info@pcxpress.co.uk";
const ADDRESS = "94 The Broadway, Wimbledon SW19 1RH";
const HOURS = "Mon – Sat: 9am – 6:30pm · Sun: Closed";
const WHATSAPP_HREF = `https://wa.me/${PHONE.replace(/\D/g, "")}`;
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  `PC Xpress, ${ADDRESS}`
)}&output=embed`;

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "Call us",
    value: PHONE,
    href: `tel:${PHONE.replace(/\s+/g, "")}`,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Chat in real time",
    href: WHATSAPP_HREF,
  },
  {
    icon: Mail,
    title: "Email us",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: MapPin,
    title: "Visit the studio",
    value: ADDRESS,
    href: MAP_SRC,
  },
];

const FAQS = [
  {
    question: "Do I need to book before coming in?",
    answer:
      "Walk-ins are welcome, but booking online or messaging ahead means we can have parts ready and get you seen faster.",
  },
  {
    question: "Is the initial diagnosis really free?",
    answer:
      "Yes — every device gets a free, no-obligation diagnosis before we quote any work.",
  },
  {
    question: "How long do most repairs take?",
    answer:
      "Many common repairs (screens, batteries, ports) are same-day. Board-level and data recovery work can take longer — we'll always give you a clear ETA upfront.",
  },
  {
    question: "Do custom builds and repairs come with a warranty?",
    answer:
      "Yes, all parts and workmanship are covered by a 12-month warranty.",
  },
];

const fieldClass =
  "w-full rounded border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default function ContactPage() {
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
              Contact Us
            </Badge>
          </Reveal>

          <TextReveal
            as="h1"
            text="Let's get your device sorted"
            delay={0.1}
            className="mx-auto mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-4xl"
          />

          <Reveal delay={0.25}>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              Call, message or drop by the studio — we usually reply within
              the hour during opening times.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-14 text-foreground sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_METHODS.map((method) => (
              <RevealItem key={method.title}>
                <Link
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col rounded border-2 border-border bg-secondary p-6 transition-colors hover:border-primary"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent">
                    <method.icon className="size-4.5 text-primary" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-secondary-foreground">
                    {method.title}
                  </h3>
                  <p className="mt-1 text-sm text-secondary-foreground/65">
                    {method.value}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:gap-1.5">
                    Get in touch
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-background pb-14 text-foreground sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <RevealItem className="rounded border border-border bg-card p-6 shadow-card sm:p-8">
              <h2 className="text-lg font-bold text-foreground">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us about your device and the issue — we'll get back to
                you with next steps.
              </p>

              <form className="mt-6 flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    className={fieldClass}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className={fieldClass}
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number (optional)"
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
                  rows={5}
                  placeholder="Tell us more..."
                  className={cn(fieldClass, "resize-none")}
                  required
                />

                <Button type="submit" size="lg" className="mt-2 w-full rounded">
                  Send Message
                  <ArrowRight />
                </Button>
              </form>
            </RevealItem>

            <RevealItem className="flex flex-col gap-5">
              <div className="h-56 overflow-hidden rounded border border-border sm:h-64">
                <iframe
                  src={MAP_SRC}
                  title="PC Xpress on Google Maps"
                  loading="lazy"
                  className="h-full w-full"
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

                <div className="relative flex h-full flex-col gap-3 p-6">
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
                    <a
                      href={`mailto:${EMAIL}`}
                      className="flex items-center gap-2 transition-colors hover:text-white"
                    >
                      <Mail className="size-4 shrink-0 text-white" />
                      {EMAIL}
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

      <section className="bg-secondary py-14 text-secondary-foreground sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <Badge variant="soft" className="mx-auto">
              <span className="size-1.5 rounded-full bg-primary" />
              FAQs
            </Badge>
            <Reveal delay={0.1}>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Questions? <span className="text-primary">Answered.</span>
              </h2>
            </Reveal>
          </Reveal>

          <RevealGroup className="mt-8 flex flex-col gap-3">
            {FAQS.map((faq) => (
              <RevealItem
                key={faq.question}
                className="rounded border border-border bg-card p-5 shadow-card"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
