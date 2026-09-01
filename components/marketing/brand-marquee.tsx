import Link from "next/link";
import { Apple } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { BRAND_SLUGS } from "@/lib/data/brand-copy";

interface Brand {
  name: string;
  icon?: typeof Apple;
}

const BRANDS: Brand[] = [
  { name: "Apple" },
  { name: "Samsung" },
  { name: "Google" },
  { name: "Dell" },
  { name: "HP" },
  { name: "Lenovo" },
  { name: "Microsoft" },
  { name: "PlayStation" },
  { name: "Nintendo" },
];

function BrandLogo({ brand }: { brand: Brand }) {
  const Icon = brand.icon;
  const slug = BRAND_SLUGS[brand.name];

  return (
    <Link
      href={slug ? `/brands/${slug}` : "/repair-a-device"}
      className="flex shrink-0 items-center gap-2 text-secondary-foreground/40 grayscale transition-all duration-300 hover:text-secondary-foreground hover:grayscale-0"
    >
      {Icon && <Icon className="size-5" strokeWidth={1.75} />}
      <span className="text-xl font-bold tracking-tight whitespace-nowrap sm:text-2xl">
        {brand.name}
      </span>
    </Link>
  );
}

export function BrandMarquee() {
  const track = [...BRANDS, ...BRANDS];

  return (
    <section className="relative isolate z-10 overflow-hidden border-y border-white/10 bg-secondary py-8 sm:py-10">
      <Reveal className="mx-auto flex max-w-screen-2xl flex-col items-center gap-5 px-4 sm:px-6 lg:flex-row lg:gap-10 lg:px-8">
        <p className="shrink-0 text-center text-xs font-semibold tracking-widest text-secondary-foreground/50 uppercase lg:text-left lg:text-sm">
          Certified to repair
          <br className="hidden lg:block" /> every major brand
        </p>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-x-12 hover:[animation-play-state:paused] motion-reduce:animate-none sm:gap-x-16">
            {track.map((brand, index) => (
              <BrandLogo key={`${brand.name}-${index}`} brand={brand} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
