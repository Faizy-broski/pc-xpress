import type { StatusTone } from "@/components/dashboard/status-badge"

export interface RepairJob {
  id: string
  customer: string
  device: string
  issue: string
  tech: string
  due: string
  status: string
  tone: StatusTone
  price: number
}

export const REPAIR_JOBS: RepairJob[] = [
  { id: "JOB-2291", customer: "Marcus Levine", device: 'MacBook Pro 16"', issue: "Cracked screen", tech: "Alex R", due: "22 Jul 2026", status: "Completed", tone: "success", price: 320 },
  { id: "JOB-2292", customer: "Priya Anand", device: "iPhone 14 Pro", issue: "Camera module", tech: "Sam K", due: "22 Jul 2026", status: "In Progress", tone: "warning", price: 140 },
  { id: "JOB-2293", customer: "David Okafor", device: "Custom Gaming PC", issue: "GPU upgrade", tech: "Alex R", due: "18 Jul 2026", status: "Completed", tone: "success", price: 480 },
  { id: "JOB-2294", customer: "Emma Clarke", device: "Dell XPS 15", issue: "Battery replacement", tech: "Unassigned", due: "24 Jul 2026", status: "Pending", tone: "danger", price: 95 },
  { id: "JOB-2295", customer: "Tom Baker", device: "PS5", issue: "HDMI port repair", tech: "Jordan P", due: "21 Jul 2026", status: "In Progress", tone: "warning", price: 110 },
  { id: "JOB-2296", customer: "Alicia Chen", device: "Surface Pro 8", issue: "Motherboard fault", tech: "Sam K", due: "25 Jul 2026", status: "On Hold", tone: "neutral", price: 260 },
  { id: "JOB-2297", customer: "Ryan Osei", device: 'iMac 27"', issue: "Data recovery", tech: "Alex R", due: "15 Jul 2026", status: "Completed", tone: "success", price: 180 },
  { id: "JOB-2298", customer: "Nina Popescu", device: "HP Pavilion", issue: "Virus removal", tech: "Jordan P", due: "14 Jul 2026", status: "Completed", tone: "success", price: 65 },
  { id: "JOB-2299", customer: "Jack Sullivan", device: "Custom PC Build", issue: "Full system build", tech: "Sam K", due: "28 Jul 2026", status: "In Progress", tone: "warning", price: 1399 },
  { id: "JOB-2300", customer: "Sophie Marsh", device: "iPhone 13", issue: "Battery health", tech: "Unassigned", due: "23 Jul 2026", status: "Pending", tone: "danger", price: 55 },
]

export interface Customer {
  id: string
  name: string
  initials: string
  email: string
  devices: number
  spent: number
  lastVisit: string
  rating: number
}

export const CUSTOMERS: Customer[] = [
  { id: "cus-1", name: "Marcus Levine", initials: "ML", email: "marcus.levine@mail.com", devices: 3, spent: 890, lastVisit: "12 Jul 2026", rating: 4.9 },
  { id: "cus-2", name: "Priya Anand", initials: "PA", email: "priya.anand@mail.com", devices: 2, spent: 410, lastVisit: "22 Jul 2026", rating: 5.0 },
  { id: "cus-3", name: "David Okafor", initials: "DO", email: "d.okafor@mail.com", devices: 4, spent: 1620, lastVisit: "18 Jul 2026", rating: 4.8 },
  { id: "cus-4", name: "Emma Clarke", initials: "EC", email: "emma.clarke@mail.com", devices: 1, spent: 95, lastVisit: "24 Jul 2026", rating: 4.6 },
  { id: "cus-5", name: "Tom Baker", initials: "TB", email: "tom.baker@mail.com", devices: 2, spent: 340, lastVisit: "21 Jul 2026", rating: 4.7 },
  { id: "cus-6", name: "Alicia Chen", initials: "AC", email: "alicia.chen@mail.com", devices: 3, spent: 705, lastVisit: "25 Jul 2026", rating: 4.9 },
]

export interface InventoryPart {
  id: string
  name: string
  category: string
  sku: string
  stock: number
  price: number
  statusLabel: string
  tone: StatusTone
}

export const INVENTORY: InventoryPart[] = [
  { id: "inv-1", name: "iPhone 14 Pro Screen (OEM)", category: "Screens", sku: "SC-IP14P-01", stock: 14, price: 89, statusLabel: "In Stock", tone: "success" },
  { id: "inv-2", name: 'MacBook Pro 16" Battery', category: "Batteries", sku: "BT-MBP16-02", stock: 3, price: 65, statusLabel: "Low Stock", tone: "warning" },
  { id: "inv-3", name: "RTX 4070 Graphics Card", category: "Upgrades", sku: "GP-RTX4070", stock: 6, price: 520, statusLabel: "In Stock", tone: "success" },
  { id: "inv-4", name: "Surface Pro 8 Motherboard", category: "Motherboards", sku: "MB-SP8-04", stock: 0, price: 210, statusLabel: "Out of Stock", tone: "danger" },
  { id: "inv-5", name: "PS5 HDMI Port Module", category: "Consoles", sku: "HD-PS5-01", stock: 9, price: 28, statusLabel: "In Stock", tone: "success" },
  { id: "inv-6", name: "Dell XPS 15 Battery", category: "Batteries", sku: "BT-XPS15-03", stock: 2, price: 58, statusLabel: "Low Stock", tone: "warning" },
  { id: "inv-7", name: "1TB NVMe SSD", category: "Upgrades", sku: "SS-NVME1TB", stock: 22, price: 74, statusLabel: "In Stock", tone: "success" },
  { id: "inv-8", name: 'iMac 27" Data Recovery Kit', category: "Data Recovery", sku: "DR-IM27-01", stock: 4, price: 40, statusLabel: "In Stock", tone: "success" },
]

export interface CustomBuildOrder {
  id: string
  customer: string
  build: string
  date: string
  status: string
  tone: StatusTone
  total: number
}

export const CUSTOM_BUILD_ORDERS: CustomBuildOrder[] = [
  { id: "#OD-2214", customer: "David Okafor", build: "U87 XT Next Day PC SV3111", date: "18 Jul 2026", status: "Delivered", tone: "success", total: 1399 },
  { id: "#OD-2215", customer: "Jack Sullivan", build: "U87 XT Next Day PC SV3111", date: "19 Jul 2026", status: "Processing", tone: "warning", total: 1399 },
  { id: "#OD-2216", customer: "Nina Popescu", build: "U87 XT Next Day PC SY3111", date: "15 Jul 2026", status: "Shipped", tone: "info", total: 1099 },
  { id: "#OD-2217", customer: "Ryan Osei", build: "U87 XT Next Day PC SY3111", date: "14 Jul 2026", status: "Delivered", tone: "success", total: 1099 },
  { id: "#OD-2218", customer: "Sophie Marsh", build: "U87 XT Next Day PC SV3111", date: "23 Jul 2026", status: "Processing", tone: "warning", total: 1399 },
  { id: "#OD-2219", customer: "Tom Baker", build: "U87 XT Next Day PC SY3111", date: "21 Jul 2026", status: "Shipped", tone: "info", total: 1099 },
]

export interface PrebuiltOrder {
  id: string
  customer: string
  product: string
  date: string
  status: string
  tone: StatusTone
  total: number
}

export const PREBUILT_ORDERS: PrebuiltOrder[] = [
  { id: "#PB-3301", customer: "Alicia Chen", product: "U87 XT Next Day PC", date: "20 Jul 2026", status: "Dispatched", tone: "info", total: 1399 },
  { id: "#PB-3302", customer: "Marcus Levine", product: "Apex i7 RTX 4070", date: "19 Jul 2026", status: "Processing", tone: "warning", total: 1649 },
  { id: "#PB-3303", customer: "Emma Clarke", product: "Forge R5 RTX 4060", date: "17 Jul 2026", status: "Delivered", tone: "success", total: 899 },
  { id: "#PB-3304", customer: "David Okafor", product: "Vortex R9 RTX 4080 Super", date: "22 Jul 2026", status: "Awaiting Payment", tone: "danger", total: 2799 },
  { id: "#PB-3305", customer: "Nina Popescu", product: "Nova i5 Home & Office", date: "21 Jul 2026", status: "Building", tone: "neutral", total: 549 },
  { id: "#PB-3306", customer: "Ryan Osei", product: "U87 XT Next Day PC — Matte Black", date: "16 Jul 2026", status: "Delivered", tone: "success", total: 1399 },
]

export interface RevenuePoint {
  label: string
  value: number
}

export const REVENUE_HISTORY: RevenuePoint[] = [
  { label: "Aug", value: 14200 },
  { label: "Sep", value: 15100 },
  { label: "Oct", value: 13400 },
  { label: "Nov", value: 16800 },
  { label: "Dec", value: 19200 },
  { label: "Jan", value: 17900 },
  { label: "Feb", value: 20600 },
  { label: "Mar", value: 23100 },
  { label: "Apr", value: 21800 },
  { label: "May", value: 25400 },
  { label: "Jun", value: 24200 },
  { label: "Jul", value: 24860 },
]

export interface RepairTypeShare {
  label: string
  percent: number
}

export const REPAIR_TYPE_BREAKDOWN: RepairTypeShare[] = [
  { label: "Screens", percent: 32 },
  { label: "Batteries", percent: 18 },
  { label: "Motherboard", percent: 15 },
  { label: "Virus removal", percent: 13 },
  { label: "Data recovery", percent: 12 },
  { label: "Upgrades", percent: 10 },
]
