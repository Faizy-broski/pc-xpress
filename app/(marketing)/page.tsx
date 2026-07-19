import { HeroCarousel, type HeroSlide } from "@/components/marketing/hero-carousel";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { WhyPcXpress } from "@/components/marketing/why-pc-xpress";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { VisitShop } from "@/components/marketing/visit-shop";
import { WhatWeFix } from "@/components/marketing/what-we-fix";
import { GamingPcPromo } from "@/components/marketing/gaming-pc-promo";
import { RepairDevicePicker } from "@/components/marketing/repair-device-picker";
import { PREBUILT_PCS, toProductCardData } from "@/components/prebuilt/data";

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
];

const FEATURED_PCS = PREBUILT_PCS.slice(0, 4).map(toProductCardData);

export default function Home() {
  return (
    <>
      <HeroCarousel slides={HERO_SLIDES} className="h-[60vh] md:min-h-screen sm:h-[80vh]" />

      <FeaturedProducts heading="Featured Custom PC" products={FEATURED_PCS} />

      <RepairDevicePicker />

      <WhatWeFix />

      <GamingPcPromo />
      
      <WhyPcXpress />

      <Testimonials />

      <CtaBanner />

      <VisitShop />
    </>
  );
}
