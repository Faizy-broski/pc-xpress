import { HeroCarousel, type HeroSlide } from "@/components/marketing/hero-carousel";
import { BrandMarquee } from "@/components/marketing/brand-marquee";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { WhyPcXpress } from "@/components/marketing/why-pc-xpress";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { VisitShop } from "@/components/marketing/visit-shop";
import { WhatWeFix } from "@/components/marketing/what-we-fix";
import { GamingPcPromo } from "@/components/marketing/gaming-pc-promo";
import { RepairDevicePicker } from "@/components/marketing/repair-device-picker";
import { toProductCardData } from "@/components/prebuilt/data";
import { listPrebuiltProducts } from "@/lib/data/prebuilt";
import { listDeviceTypes } from "@/lib/data/repair";

const HERO_SLIDES: HeroSlide[] = [
  {
    imageSrc: "/hero.png",
    imageAlt: "Technician repairing a PC",
    badge: "Trusted PC Repair Experts",
    heading: "Expert PC Repairs in Wimbledon",
    description: "Fast diagnostics, expert repairs. Your PC running like new.",
    primary: { label: "Book Your Repair", href: "/repair-a-device" },
    secondary: { label: "Build a PC", href: "/build-a-pc" },
  },
  {
    imageSrc: "/hero.png",
    imageAlt: "Custom gaming PC build",
    badge: "Bespoke Builds",
    heading: "Custom Builds Made for You",
    description:
      "Tell us your budget and workload — we'll spec, build, and stress-test a PC to match.",
    primary: { label: "Build a PC", href: "/build-a-pc" },
    secondary: { label: "Book Your Repair", href: "/repair-a-device" },
  },
{
    imageSrc: "/hero.png",
    imageAlt: "Pre-built Gaming & Workstation PCs",
    badge: "Ready to Ship",
    heading: "Pre-Built PCs, Ready to Roll",
    description:
      "Hand-picked configs for gaming, creative work, and everyday power — tested and dispatched fast.",
    primary: { label: "Shop Pre-built PCs", href: "/prebuilt-pcs" },
    secondary: { label: "Build a PC", href: "/build-a-pc" },
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [prebuiltProducts, deviceTypes] = await Promise.all([
    listPrebuiltProducts(),
    listDeviceTypes(),
  ]);
  const featuredPcs = prebuiltProducts.slice(0, 4).map(toProductCardData);

  return (
    <>
      <HeroCarousel
        slides={HERO_SLIDES}
        className="h-[65dvh] sm:h-[80vh]"
      />

      <BrandMarquee />

      <FeaturedProducts heading="Featured Custom PC" products={featuredPcs} />

      <RepairDevicePicker deviceTypes={deviceTypes} />

      <WhatWeFix />

      <GamingPcPromo />
      
      <WhyPcXpress />

      <Testimonials />

      <CtaBanner />

      <VisitShop />
    </>
  );
}
