import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const PHONE = "+44 7307 093007";
const WHATSAPP_HREF = `https://wa.me/${PHONE.replace(/\D/g, "")}`;

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-10 lg:px-8">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded">
          <Image
            src="/footer.png"
            alt="Technician repairing a PC"
            fill
            sizes="(min-width: 1024px) 1152px, 100vw"
            className="object-cover"
          />

          <div className="relative flex flex-col gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <Badge
                variant="soft"
                className="border border-white/15 bg-white/10 text-white"
              >
                <SparklesIcon className="size-3.5" />
                Free diagnostics · No obligation
              </Badge>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to bring your device back to life?
              </h2>

              <p className="mt-4 text-white/70">
                Drop by the studio, book a same-day slot, or send us a
                message. We&apos;ll take it from there — quickly,
                transparently, and with the care your device deserves.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Button
                size="lg"
                className="rounded p-6"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                Book a repair
                <ArrowUpRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded border-white/15 bg-white/5 backdrop-blur-xl p-6 text-white hover:bg-white/10 hover:text-white"
                nativeButton={false}
                render={<Link href={WHATSAPP_HREF} />}
              >
                <MessageCircle />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
