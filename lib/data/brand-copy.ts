export const BRAND_SLUGS: Record<string, string> = {
  Apple: "apple",
  Samsung: "samsung",
  Google: "google",
  Dell: "dell",
  HP: "hp",
  Lenovo: "lenovo",
  Microsoft: "microsoft",
  PlayStation: "sony",
  Nintendo: "nintendo",
};

export interface BrandCopy {
  name: string;
  tagline: string;
  description: string;
}

export const BRAND_COPY: Record<string, BrandCopy> = {
  apple: {
    name: "Apple",
    tagline: "We fix Apple devices",
    description:
      "From cracked iPhone screens to MacBook battery swaps, our certified technicians repair the full Apple lineup — iPhone, iPad and MacBook — using quality parts, with same-day turnaround on most jobs.",
  },
  samsung: {
    name: "Samsung",
    tagline: "We fix Samsung devices",
    description:
      "Galaxy phone and tablet repairs done right — screens, batteries, charging ports and water damage, all handled by technicians who know Samsung hardware inside out.",
  },
  google: {
    name: "Google",
    tagline: "We fix Google devices",
    description:
      "Pixel phone and tablet repairs, from shattered displays to failing batteries, with genuine-quality parts and fast diagnostics.",
  },
  dell: {
    name: "Dell",
    tagline: "We fix Dell laptops",
    description:
      "Screen replacements, keyboard repairs, battery swaps and full diagnostics for Dell laptops — from XPS ultrabooks to Inspiron and Latitude models.",
  },
  hp: {
    name: "HP",
    tagline: "We fix HP laptops",
    description:
      "Hinge repairs, boot issues, water damage and more for HP laptops — Pavilion, EliteBook, Spectre and every model in between.",
  },
  lenovo: {
    name: "Lenovo",
    tagline: "We fix Lenovo laptops",
    description:
      "ThinkPad and IdeaPad repairs covering screens, keyboards, batteries and hinge damage, backed by our full diagnostic service.",
  },
  microsoft: {
    name: "Microsoft",
    tagline: "We fix Microsoft devices",
    description:
      "Surface tablet repairs and Xbox console servicing — screens, charging ports, disc drives and controller drift, all fixed in-house.",
  },
  sony: {
    name: "PlayStation",
    tagline: "We fix PlayStation consoles",
    description:
      "HDMI port faults, disc drive issues, overheating and controller drift — we repair PlayStation consoles and get you back to gaming fast.",
  },
  nintendo: {
    name: "Nintendo",
    tagline: "We fix Nintendo consoles",
    description:
      "Switch and console repairs covering overheating, disc and cartridge issues, controller drift and power faults.",
  },
};
