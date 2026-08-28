import { HeroCarousel, type HeroSlide } from "@/components/marketing/hero-carousel";
import { BrandMarquee } from "@/components/marketing/brand-marquee";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { WhyPcXpress } from "@/components/marketing/why-pc-xpress";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { VisitShop } from "@/components/marketing/visit-shop";
import { WhatWeFix } from "@/components/marketing/what-we-fix";
import { GamingPcPromo } from "@/components/marketing/gaming-pc-promo";
import { HomePickupService } from "@/components/marketing/home-pickup-service";
import { RepairDevicePicker } from "@/components/marketing/repair-device-picker";
import { toProductCardData } from "@/components/prebuilt/data";
import { listPrebuiltProducts } from "@/lib/data/prebuilt";
import { listDeviceTypes } from "@/lib/data/repair";

const HERO_SLIDES: HeroSlide[] = [
  {
    imageSrc: "/carousel/pc.png",
    imageAlt: "Technician repairing a PC",
    badge: "Trusted PC Repair Experts",
    heading: "Expert PC Repairs in Wimbledon",
    description: "Fast diagnostics, expert repairs. Your PC running like new.",
    primary: { label: "Book Your Repair", href: "/repair-a-device" },
    secondary: { label: "Build a PC", href: "/build-a-pc" },
  },
  {
    imageSrc: "/carousel/mobile.png",
    imageAlt: "Technician repairing a phone motherboard",
    badge: "Phone & Tablet Repairs",
    heading: "Cracked Screen? Dead Battery? Sorted.",
    description:
      "Same-day phone and tablet repairs — screens, batteries, charging ports and more, fixed by experts.",
    primary: { label: "Book Your Repair", href: "/repair-a-device?device=phone" },
    secondary: { label: "Build a PC", href: "/build-a-pc" },
  },
  {
    imageSrc: "/carousel/console.png",
    imageAlt: "Technician repairing a laptop and games console",
    badge: "Laptop & Console Repairs",
    heading: "Laptops and Consoles, Fixed Fast",
    description:
      "From MacBook fan swaps to PlayStation and Xbox repairs — we get your gear back up and running.",
    primary: { label: "Book Your Repair", href: "/repair-a-device?device=console" },
    secondary: { label: "Build a PC", href: "/build-a-pc" },
    contentAlign: "right",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [prebuiltProducts, deviceTypes] = await Promise.all([
    listPrebuiltProducts(),
    listDeviceTypes(),
  ]);
  const featuredPcs = prebuiltProducts.slice(0, 8).map(toProductCardData);

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
      <HomePickupService />
      <Testimonials />
      <CtaBanner />
      <VisitShop />
    </>
  );
}
