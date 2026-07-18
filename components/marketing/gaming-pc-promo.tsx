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
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <RevealGroup className="grid gap-6 sm:grid-cols-2">
        {PROMOS.map((promo) => (
          <RevealItem key={promo.title}>
            <Link
              href={promo.href}
              className="group relative block aspect-square overflow-hidden rounded"
            >
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  {promo.title}
                </h3>
                <span className="mt-4 inline-flex items-center rounded bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors group-hover:bg-white/90">
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
