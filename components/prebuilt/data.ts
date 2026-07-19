import type { ProductCardData } from "@/components/marketing/product-card";

export type PrebuiltCategory = "Gaming" | "Creator" | "Office";

export interface PrebuiltSpec {
  label: string;
  value: string;
}

export interface PrebuiltProduct {
  slug: string;
  sku: string;
  name: string;
  category: PrebuiltCategory;
  badge?: "Best Seller" | "New" | "Editor's Pick";
  tagline: string;
  description: string;
  images: string[];
  os: string;
  rating: number;
  reviewCount: number;
  price: number;
  wasPrice?: number;
  dispatchDate: string;
  inStock: boolean;
  highlights: string[];
  /** Ordered core specs — first five are shown on the product card. */
  specs: PrebuiltSpec[];
  whatsIncluded: string[];
}

export function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** UK VAT is 20% — the ex-VAT price is the figure retailers show underneath the headline price. */
export function formatExVat(value: number) {
  return formatGBP(value / 1.2);
}

export const PREBUILT_PCS: PrebuiltProduct[] = [
  {
    slug: "u87-xt-sy3111",
    sku: "SY3111",
    name: "U87 XT Next Day PC",
    category: "Gaming",
    badge: "Best Seller",
    tagline: "1440p-ready gaming rig with RGB tempered glass panel",
    description:
      "The U87 XT pairs an 8-core Ryzen 7 with an RTX 5060 Ti for smooth 1440p gaming at high frame rates. Every unit is hand-built in our Wimbledon studio, cable-managed, stress-tested for 8 hours, and ready to dispatch the next working day.",
    images: [],
    os: "Windows 11 Home",
    rating: 5,
    reviewCount: 40,
    price: 1399,
    wasPrice: 1499,
    dispatchDate: "Monday, 6/7/2026",
    inStock: true,
    highlights: ["1440p 144fps ready", "Ray tracing capable", "Quiet under load", "RGB tempered glass"],
    specs: [
      { label: "Processor", value: "AMD Ryzen 7 8700F" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 5060 Ti 16GB" },
      { label: "Memory", value: "32GB DDR5 4800MT/s" },
      { label: "Motherboard", value: "MSI Pro A620M-A Evo" },
      { label: "Storage", value: "1TB PCIe 4.0 NVMe SSD" },
      { label: "Power Supply", value: "650W 80+ Gold, Fully Modular" },
      { label: "Case", value: "Mid Tower, Tempered Glass, RGB Fans" },
      { label: "Cooling", value: "240mm ARGB Liquid Cooler" },
      { label: "Warranty", value: "12 months parts & labour" },
    ],
    whatsIncluded: ["Pre-built PC", "Power cable", "Driver USB stick", "Quick start guide"],
  },
  {
    slug: "u87-xt-sy3112",
    sku: "SY3112",
    name: "U87 XT Next Day PC — Matte Black",
    category: "Gaming",
    tagline: "Same firepower as the SY3111, in a stealth matte black case",
    description:
      "Identical internals to our best-selling U87 XT, wrapped in a matte black chassis for a more understated look on the desk. An 8-core Ryzen 7 and RTX 5060 Ti handle 1440p gaming with headroom to spare.",
    images: [],
    os: "Windows 11 Home",
    rating: 5,
    reviewCount: 40,
    price: 1399,
    wasPrice: 1499,
    dispatchDate: "Monday, 6/7/2026",
    inStock: true,
    highlights: ["1440p 144fps ready", "Ray tracing capable", "Quiet under load", "Stealth matte finish"],
    specs: [
      { label: "Processor", value: "AMD Ryzen 7 8700F" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 5060 Ti 16GB" },
      { label: "Memory", value: "32GB DDR5 4800MT/s" },
      { label: "Motherboard", value: "MSI Pro A620M-A Evo" },
      { label: "Storage", value: "1TB PCIe 4.0 NVMe SSD" },
      { label: "Power Supply", value: "650W 80+ Gold, Fully Modular" },
      { label: "Case", value: "Mid Tower, Matte Black, High Airflow" },
      { label: "Cooling", value: "240mm ARGB Liquid Cooler" },
      { label: "Warranty", value: "12 months parts & labour" },
    ],
    whatsIncluded: ["Pre-built PC", "Power cable", "Driver USB stick", "Quick start guide"],
  },
  {
    slug: "apex-i7-rtx4070",
    sku: "APX-4070",
    name: "Apex i7 RTX 4070",
    category: "Gaming",
    badge: "Editor's Pick",
    tagline: "Intel horsepower with an RTX 4070 for high-refresh 1440p",
    description:
      "Built around a 20-core Intel Core i7 and an RTX 4070, the Apex is tuned for high-refresh 1440p esports and AAA titles alike. A 360mm AIO keeps thermals in check even during long sessions.",
    images: [],
    os: "Windows 11 Home",
    rating: 5,
    reviewCount: 27,
    price: 1649,
    wasPrice: 1799,
    dispatchDate: "Wednesday, 8/7/2026",
    inStock: true,
    highlights: ["165Hz+ ready", "360mm AIO cooling", "WiFi 6E onboard", "Tool-less side panel"],
    specs: [
      { label: "Processor", value: "Intel Core i7-14700K" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 4070 12GB" },
      { label: "Memory", value: "32GB DDR5 6000MT/s" },
      { label: "Motherboard", value: "Gigabyte Z790 Gaming X WiFi" },
      { label: "Storage", value: "1TB PCIe 4.0 NVMe SSD" },
      { label: "Power Supply", value: "750W 80+ Gold, Fully Modular" },
      { label: "Case", value: "Mid Tower, Tempered Glass, High Airflow" },
      { label: "Cooling", value: "360mm ARGB Liquid Cooler" },
      { label: "Warranty", value: "12 months parts & labour" },
    ],
    whatsIncluded: ["Pre-built PC", "Power cable", "Driver USB stick", "Quick start guide"],
  },
  {
    slug: "forge-r5-rtx4060",
    sku: "FRG-4060",
    name: "Forge R5 RTX 4060",
    category: "Gaming",
    tagline: "The value pick for smooth 1080p gaming",
    description:
      "The Forge is our entry point into PC gaming done properly — a Ryzen 5 and RTX 4060 combo that comfortably drives 1080p at high settings, with room to upgrade later.",
    images: [],
    os: "Windows 11 Home",
    rating: 4,
    reviewCount: 63,
    price: 899,
    dispatchDate: "Tuesday, 7/7/2026",
    inStock: true,
    highlights: ["1080p high-refresh", "Upgrade-friendly build", "Compact micro-ATX case", "Whisper-quiet fans"],
    specs: [
      { label: "Processor", value: "AMD Ryzen 5 7600" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 4060 8GB" },
      { label: "Memory", value: "16GB DDR5 6000MT/s" },
      { label: "Motherboard", value: "ASUS TUF B850M-Plus" },
      { label: "Storage", value: "500GB PCIe 4.0 NVMe SSD" },
      { label: "Power Supply", value: "600W 80+ Gold" },
      { label: "Case", value: "Micro-ATX, High Airflow" },
      { label: "Cooling", value: "Air Cooler, Dual Tower" },
      { label: "Warranty", value: "12 months parts & labour" },
    ],
    whatsIncluded: ["Pre-built PC", "Power cable", "Driver USB stick", "Quick start guide"],
  },
  {
    slug: "vortex-r9-rtx4080",
    sku: "VTX-4080S",
    name: "Vortex R9 RTX 4080 Super",
    category: "Creator",
    badge: "New",
    tagline: "Rendering, streaming, and 4K gaming without compromise",
    description:
      "The Vortex is built for creators who edit, render, and stream in the same breath. A 16-core Ryzen 9 and RTX 4080 Super chew through timelines and exports, while 64GB of RAM keeps every app open at once.",
    images: [],
    os: "Windows 11 Pro",
    rating: 5,
    reviewCount: 18,
    price: 2799,
    wasPrice: 2999,
    dispatchDate: "Friday, 10/7/2026",
    inStock: true,
    highlights: ["4K capable", "16-core productivity", "64GB multitasking", "10Gb-ready networking"],
    specs: [
      { label: "Processor", value: "AMD Ryzen 9 7950X" },
      { label: "Graphics", value: "NVIDIA GeForce RTX 4080 Super 16GB" },
      { label: "Memory", value: "64GB DDR5 6000MT/s" },
      { label: "Motherboard", value: "MSI MPG B850 Edge WiFi" },
      { label: "Storage", value: "2TB PCIe 4.0 NVMe SSD" },
      { label: "Power Supply", value: "1000W 80+ Platinum, Fully Modular" },
      { label: "Case", value: "Mid Tower, Dual Chamber Airflow" },
      { label: "Cooling", value: "360mm ARGB Liquid Cooler" },
      { label: "Warranty", value: "24 months parts & labour" },
    ],
    whatsIncluded: ["Pre-built PC", "Power cable", "Driver USB stick", "Quick start guide"],
  },
  {
    slug: "nova-i5-office",
    sku: "NVA-I5",
    name: "Nova i5 Home & Office",
    category: "Office",
    tagline: "Quiet, compact, and ready for work from the first boot",
    description:
      "The Nova is built for everyday computing — browsing, spreadsheets, video calls, and light photo editing. A compact case and near-silent cooling make it just as at home on a desk as under one.",
    images: [],
    os: "Windows 11 Home",
    rating: 4,
    reviewCount: 51,
    price: 549,
    dispatchDate: "Tuesday, 7/7/2026",
    inStock: true,
    highlights: ["Near-silent operation", "Compact footprint", "Fast NVMe boot drive", "Wi-Fi included"],
    specs: [
      { label: "Processor", value: "Intel Core i5-13400" },
      { label: "Graphics", value: "Intel UHD Graphics 730" },
      { label: "Memory", value: "16GB DDR4 3200MT/s" },
      { label: "Motherboard", value: "ASUS Prime B760M-A" },
      { label: "Storage", value: "500GB PCIe 4.0 NVMe SSD" },
      { label: "Power Supply", value: "450W 80+ Bronze" },
      { label: "Case", value: "Compact Micro-Tower" },
      { label: "Cooling", value: "Stock Air Cooler" },
      { label: "Warranty", value: "12 months parts & labour" },
    ],
    whatsIncluded: ["Pre-built PC", "Power cable", "Driver USB stick", "Quick start guide"],
  },
];

export function getPrebuiltProduct(slug: string) {
  return PREBUILT_PCS.find((product) => product.slug === slug);
}

export function toProductCardData(product: PrebuiltProduct): ProductCardData {
  return {
    href: `/prebuilt-pcs/${product.slug}`,
    imageSrc: product.images[0],
    imageAlt: product.name,
    os: product.os,
    title: product.name,
    specs: product.specs.slice(0, 5).map((spec) => spec.value),
    rating: product.rating,
    reviewCount: product.reviewCount,
    price: formatGBP(product.price),
    priceExVat: formatExVat(product.price),
    wasPrice: product.wasPrice ? formatGBP(product.wasPrice) : undefined,
    dispatchDate: product.dispatchDate,
  };
}
