import { HeroCarousel, type HeroSlide } from "@/components/marketing/hero-carousel";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { WhyPcXpress } from "@/components/marketing/why-pc-xpress";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { VisitShop } from "@/components/marketing/visit-shop";
import { WhatWeFix } from "@/components/marketing/what-we-fix";
import { GamingPcPromo } from "@/components/marketing/gaming-pc-promo";
import type { ProductCardData } from "@/components/marketing/product-card";

const HERO_SLIDES: HeroSlide[] = [
  {
    imageSrc: "/hero.png",
    imageAlt: "Technician repairing a PC",
    badge: "Trusted PC Repair Experts",
    heading: "Expert PC Repairs in Wimbledon",
    description: "Fast diagnostics, expert repairs. Your PC running like new.",
    primary: { label: "Book Your Repair", href: "/contact" },
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
    secondary: { label: "Book Your Repair", href: "/contact" },
  },
];

const FEATURED_PCS: ProductCardData[] = [
  {
    href: "/build-a-pc/u87-xt-sy3111",
    imageAlt: "U87 XT Next Day PC with RGB tempered glass panel",
    os: "Windows 11 Home",
    title: "U87 XT Next Day PC SY3111",
    specs: [
      "AMD Ryzen 7 8700F",
      "NVIDIA GeForce RTX 5060 Ti 16GB",
      "32GB DDR5 4800MT/s",
      "MSI Pro A620M-A Evo",
      "1TB PCIe 4.0 NVMe",
    ],
    rating: 5,
    reviewCount: 40,
    price: "£1,399.00",
    priceExVat: "£1,165.83",
    wasPrice: "£1,499.00",
    dispatchDate: "Monday, 6/7/2026",
  },
  {
    href: "/build-a-pc/u87-xt-sy3112",
    imageAlt: "U87 XT Next Day PC in matte black case",
    os: "Windows 11 Home",
    title: "U87 XT Next Day PC SY3112",
    specs: [
      "AMD Ryzen 7 8700F",
      "NVIDIA GeForce RTX 5060 Ti 16GB",
      "32GB DDR5 4800MT/s",
      "MSI Pro A620M-A Evo",
      "1TB PCIe 4.0 NVMe",
    ],
    rating: 5,
    reviewCount: 40,
    price: "£1,399.00",
    priceExVat: "£1,165.83",
    wasPrice: "£1,499.00",
    dispatchDate: "Monday, 6/7/2026",
  },
  {
    href: "/build-a-pc/u87-xt-sy3113",
    imageAlt: "U87 XT Next Day PC in white case with blue accents",
    os: "Windows 11 Home",
    title: "U87 XT Next Day PC SY3113",
    specs: [
      "AMD Ryzen 7 8700F",
      "NVIDIA GeForce RTX 5060 Ti 16GB",
      "32GB DDR5 4800MT/s",
      "MSI Pro A620M-A Evo",
      "1TB PCIe 4.0 NVMe",
    ],
    rating: 5,
    reviewCount: 40,
    price: "£1,399.00",
    priceExVat: "£1,165.83",
    wasPrice: "£1,499.00",
    dispatchDate: "Monday, 6/7/2026",
  },
  {
    href: "/build-a-pc/u87-xt-sy3114",
    imageAlt: "U87 XT Next Day PC with dual chamber design",
    os: "Windows 11 Home",
    title: "U87 XT Next Day PC SY3114",
    specs: [
      "AMD Ryzen 7 8700F",
      "NVIDIA GeForce RTX 5060 Ti 16GB",
      "32GB DDR5 4800MT/s",
      "MSI Pro A620M-A Evo",
      "1TB PCIe 4.0 NVMe",
    ],
    rating: 5,
    reviewCount: 40,
    price: "£1,399.00",
    priceExVat: "£1,165.83",
    wasPrice: "£1,499.00",
    dispatchDate: "Monday, 6/7/2026",
  },
];

export default function Home() {
  return (
    <>
      <HeroCarousel slides={HERO_SLIDES} className="min-h-screen" />

      <FeaturedProducts heading="Featured Custom PC" products={FEATURED_PCS} />


      <WhatWeFix />

      <GamingPcPromo />
      
      <WhyPcXpress />

      <Testimonials />

      <CtaBanner />

      <VisitShop />
    </>
  );
}
