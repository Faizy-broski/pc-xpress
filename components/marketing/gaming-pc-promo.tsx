import Image from "next/image";
import Link from "next/link";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";

interface Promo {
  title: string;
  image: string;
  href: string;
}

const PROMOS: Promo[] = [
  {
    title: "Custom Gaming PCs",
    image: "/custom-gaming-pc.png",
    href: "/build-a-pc",
  },
  {
    title: "Prebuilt Gaming PCs",
    image: "/pre-built-gaming-pc.png",
    href: "/prebuilt-pcs",
  },
];

export function GamingPcPromo() {
  return (
    <section className="relative isolate z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <RevealGroup className="grid gap-5 sm:grid-cols-2">
        {PROMOS.map((promo) => (
          <RevealItem key={promo.title}>
            <Link
              href={promo.href}
              className="group relative z-10 block aspect-square overflow-hidden rounded"
            >
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {promo.title}
                </h3>
                <span className="mt-3 inline-flex items-center rounded bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors group-hover:bg-white/90">
                  Shop Now
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
