import type { StatusTone } from "@/components/dashboard/status-badge"

export const REPAIR_STEPS = [
  "Received",
  "Diagnosing",
  "Repairing",
  "Testing",
  "Ready for pickup",
] as const

export interface Repair {
  id: string
  device: string
  issue: string
  submitted: string
  eta: string
  currentStep: number
  tone: StatusTone
}

export const REPAIRS: Repair[] = [
  {
    id: "RPR-2291",
    device: "ASUS ROG Strix G17",
    issue: "GPU running hot & throttling under load",
    submitted: "14 Jul 2026",
    eta: "22 Jul 2026",
    currentStep: 2,
    tone: "warning",
  },
  {
    id: "RPR-2287",
    device: "iPhone 14 Pro",
    issue: "Cracked screen replacement",
    submitted: "10 Jul 2026",
    eta: "Ready now",
    currentStep: 4,
    tone: "success",
  },
  {
    id: "RPR-2265",
    device: "Custom Ryzen Desktop",
    issue: "No display output, suspected PSU fault",
    submitted: "16 Jul 2026",
    eta: "21 Jul 2026",
    currentStep: 1,
    tone: "info",
  },
]

export interface Order {
  id: string
  date: string
  items: string
  total: number
  status: string
  tone: StatusTone
}

export const ORDERS: Order[] = [
  {
    id: "ORD-10432",
    date: "12 Jul 2026",
    items: "Custom Build — 1440p Ryzen Rig",
    total: 1749,
    status: "Processing",
    tone: "info",
  },
  {
    id: "ORD-10298",
    date: "28 Jun 2026",
    items: "Samsung 990 Pro 2TB SSD",
    total: 139,
    status: "Delivered",
    tone: "success",
  },
  {
    id: "ORD-10176",
    date: "09 Jun 2026",
    items: "Corsair HX1500i PSU",
    total: 339,
    status: "Delivered",
    tone: "success",
  },
  {
    id: "ORD-10041",
    date: "22 May 2026",
    items: "NZXT H9 Flow Case",
    total: 149,
    status: "Shipped",
    tone: "warning",
  },
]

export interface SavedBuild {
  id: string
  name: string
  updated: string
  total: number
  parts: string[]
}

export const SAVED_BUILDS: SavedBuild[] = [
  {
    id: "build-1",
    name: "1440p Ryzen Rig",
    updated: "17 Jul 2026",
    total: 1749,
    parts: ["AMD Ryzen 9 7950X", "RTX 4080 Super", "32GB DDR5", "2TB NVMe"],
  },
  {
    id: "build-2",
    name: "Compact Streaming PC",
    updated: "10 Jul 2026",
    total: 1120,
    parts: ["Ryzen 5 7600", "RTX 4060", "16GB DDR5", "1TB NVMe"],
  },
  {
    id: "build-3",
    name: "Budget Office Rig",
    updated: "02 Jul 2026",
    total: 640,
    parts: ["Ryzen 5 7600", "Integrated Graphics", "16GB DDR5", "1TB NVMe"],
  },
]
