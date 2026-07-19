import {
  Cpu,
  Gamepad2,
  CircuitBoard,
  Layers,
  HardDrive,
  Zap,
  Box,
  Fan,
  type LucideIcon,
} from "lucide-react";

export type CategoryId =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "case"
  | "cooler";

export type Socket = "AM5" | "LGA1700";

export interface PartOption {
  id: string;
  name: string;
  price: number;
  specs: string[];
  inStock: boolean;
  badge?: "Best Value" | "Recommended" | "Enthusiast";
  socket?: Socket;
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  description: string;
  options: PartOption[];
}

export const CATEGORIES: Category[] = [
  {
    id: "cpu",
    label: "CPU",
    icon: Cpu,
    description: "The brain of your PC.",
    options: [
      {
        id: "i9-14900k",
        name: "Intel Core i9-14900K",
        price: 489,
        specs: ["24 Cores", "LGA1700", "6.0GHz Boost"],
        inStock: true,
        badge: "Enthusiast",
        socket: "LGA1700",
      },
      {
        id: "r9-7950x",
        name: "AMD Ryzen 9 7950X",
        price: 549,
        specs: ["16 Cores", "AM5", "5.7GHz Boost"],
        inStock: true,
        badge: "Recommended",
        socket: "AM5",
      },
      {
        id: "i7-14700k",
        name: "Intel Core i7-14700K",
        price: 369,
        specs: ["20 Cores", "LGA1700", "5.6GHz Boost"],
        inStock: true,
        socket: "LGA1700",
      },
      {
        id: "r5-7600",
        name: "AMD Ryzen 5 7600",
        price: 199,
        specs: ["6 Cores", "AM5", "5.1GHz Boost"],
        inStock: true,
        badge: "Best Value",
        socket: "AM5",
      },
    ],
  },
  {
    id: "motherboard",
    label: "Motherboard",
    icon: CircuitBoard,
    description: "Connects every component — must match your CPU socket.",
    options: [
      {
        id: "asus-z890",
        name: "ASUS ROG Maximus Z890",
        price: 549,
        specs: ["LGA1700", "ATX", "PCIe 5.0", "WiFi 7"],
        inStock: true,
        badge: "Enthusiast",
        socket: "LGA1700",
      },
      {
        id: "msi-b850",
        name: "MSI MPG B850 Edge WiFi",
        price: 259,
        specs: ["AM5", "ATX", "PCIe 5.0", "WiFi 6E"],
        inStock: true,
        badge: "Recommended",
        socket: "AM5",
      },
      {
        id: "gigabyte-z890",
        name: "Gigabyte Z890 Master",
        price: 399,
        specs: ["LGA1700", "ATX", "PCIe 5.0", "WiFi 7"],
        inStock: true,
        socket: "LGA1700",
      },
      {
        id: "asus-b850m",
        name: "ASUS TUF B850M-Plus",
        price: 169,
        specs: ["AM5", "Micro-ATX", "PCIe 5.0", "WiFi 6E"],
        inStock: true,
        badge: "Best Value",
        socket: "AM5",
      },
    ],
  },
  {
    id: "gpu",
    label: "GPU",
    icon: Gamepad2,
    description: "Drives your frame rate and visual fidelity.",
    options: [
      {
        id: "rtx4090",
        name: "NVIDIA RTX 4090",
        price: 1599,
        specs: ["24GB GDDR6X", "PCIe 4.0", "450W TDP"],
        inStock: true,
        badge: "Enthusiast",
      },
      {
        id: "rtx4080s",
        name: "NVIDIA RTX 4080 Super",
        price: 899,
        specs: ["16GB GDDR6X", "PCIe 4.0", "320W TDP"],
        inStock: true,
        badge: "Recommended",
      },
      {
        id: "rx7900xtx",
        name: "AMD RX 7900 XTX",
        price: 799,
        specs: ["24GB GDDR6", "PCIe 4.0", "355W TDP"],
        inStock: false,
      },
      {
        id: "rtx4060",
        name: "NVIDIA RTX 4060",
        price: 259,
        specs: ["8GB GDDR6", "PCIe 4.0", "115W TDP"],
        inStock: true,
        badge: "Best Value",
      },
    ],
  },
  {
    id: "ram",
    label: "RAM",
    icon: Layers,
    description: "More memory keeps games and heavy apps running smoothly.",
    options: [
      {
        id: "corsair-32",
        name: "Corsair Vengeance 32GB",
        price: 99,
        specs: ["DDR5", "6000MT/s", "2x16GB"],
        inStock: true,
        badge: "Recommended",
      },
      {
        id: "gskill-64",
        name: "G.Skill Trident Z5 64GB",
        price: 199,
        specs: ["DDR5", "6400MT/s", "2x32GB"],
        inStock: true,
        badge: "Enthusiast",
      },
      {
        id: "corsair-16",
        name: "Corsair Vengeance 16GB",
        price: 54,
        specs: ["DDR5", "6000MT/s", "2x8GB"],
        inStock: true,
        badge: "Best Value",
      },
    ],
  },
  {
    id: "storage",
    label: "Storage",
    icon: HardDrive,
    description: "NVMe SSDs for near-instant boot and load times.",
    options: [
      {
        id: "samsung-2tb",
        name: "Samsung 990 Pro 2TB",
        price: 139,
        specs: ["NVMe Gen4", "7450MB/s"],
        inStock: true,
        badge: "Recommended",
      },
      {
        id: "wd-1tb",
        name: "WD Black SN850X 1TB",
        price: 79,
        specs: ["NVMe Gen4", "7300MB/s"],
        inStock: true,
        badge: "Best Value",
      },
      {
        id: "samsung-4tb",
        name: "Samsung 990 Pro 4TB",
        price: 269,
        specs: ["NVMe Gen4", "7450MB/s"],
        inStock: true,
        badge: "Enthusiast",
      },
    ],
  },
  {
    id: "psu",
    label: "Power Supply",
    icon: Zap,
    description: "Clean, reliable power sized to your components.",
    options: [
      {
        id: "corsair-1500",
        name: "Corsair HX1500i",
        price: 339,
        specs: ["1500W", "80+ Platinum", "Fully Modular"],
        inStock: true,
        badge: "Enthusiast",
      },
      {
        id: "seasonic-850",
        name: "Seasonic Focus GX-850",
        price: 129,
        specs: ["850W", "80+ Gold", "Fully Modular"],
        inStock: true,
        badge: "Recommended",
      },
      {
        id: "corsair-650",
        name: "Corsair RM650",
        price: 79,
        specs: ["650W", "80+ Gold", "Fully Modular"],
        inStock: true,
        badge: "Best Value",
      },
    ],
  },
  {
    id: "case",
    label: "Case",
    icon: Box,
    description: "Airflow, aesthetics, and room to grow.",
    options: [
      {
        id: "lianli-o11",
        name: "Lian Li O11 Dynamic EVO",
        price: 179,
        specs: ["Mid Tower", "Tempered Glass"],
        inStock: true,
        badge: "Recommended",
      },
      {
        id: "nzxt-h9",
        name: "NZXT H9 Flow",
        price: 149,
        specs: ["Mid Tower", "Dual Chamber"],
        inStock: true,
      },
      {
        id: "nzxt-h510",
        name: "NZXT H510 Flow",
        price: 79,
        specs: ["Mid Tower", "High Airflow"],
        inStock: true,
        badge: "Best Value",
      },
    ],
  },
  {
    id: "cooler",
    label: "CPU Cooler",
    icon: Fan,
    description: "Keeps thermals in check so your CPU can boost higher.",
    options: [
      {
        id: "arctic-lf2",
        name: "Arctic Liquid Freezer II 360",
        price: 119,
        specs: ["360mm AIO", "Universal Socket"],
        inStock: true,
        badge: "Recommended",
      },
      {
        id: "noctua-nhd15",
        name: "Noctua NH-D15",
        price: 99,
        specs: ["Air Cooler", "Dual Tower"],
        inStock: true,
      },
      {
        id: "stock-cooler",
        name: "Stock Cooler",
        price: 0,
        specs: ["Air Cooler", "Included in the box"],
        inStock: true,
        badge: "Best Value",
      },
    ],
  },
];

export const BUILD_TIPS = [
  "Match your CPU and motherboard socket type",
  "Ensure your PSU has enough headroom for the GPU",
  "Faster RAM helps most with AMD Ryzen platforms",
  "Liquid cooling lets high-end CPUs boost for longer",
];

export const ASSEMBLY_FEE = 49;

export function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPartPrice(value: number) {
  return value === 0 ? "Included" : formatGBP(value);
}
