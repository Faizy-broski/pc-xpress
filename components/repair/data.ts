import {
  Computer,
  Gamepad2,
  Laptop,
  Smartphone,
  Tablet,
  // Watch,
  type LucideIcon,
} from "lucide-react";

export type DeviceTypeId = "phone" | "tablet" | "laptop" | "desktop" | "console" 
// | "watch";

export interface DeviceType {
  id: DeviceTypeId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface Brand {
  id: string;
  label: string;
}

export interface Fault {
  id: string;
  label: string;
  description: string;
  priceFrom: number;
  etaLabel: string;
}

export const DEVICE_TYPES: DeviceType[] = [
  { id: "phone", label: "Phone", icon: Smartphone, description: "iPhone, Samsung, Google & more" },
  { id: "tablet", label: "Tablet", icon: Tablet, description: "iPad, Galaxy Tab, Surface & more" },
  { id: "laptop", label: "Laptop", icon: Laptop, description: "MacBook & Windows laptops" },
  { id: "desktop", label: "Desktop PC", icon: Computer, description: "Custom builds & prebuilt towers" },
  { id: "console", label: "Console", icon: Gamepad2, description: "PlayStation, Xbox & Switch" },
  // { id: "watch", label: "Smartwatch", icon: Watch, description: "Apple Watch & Galaxy Watch" },
];

export const BRANDS: Record<DeviceTypeId, Brand[]> = {
  phone: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "google", label: "Google" },
    { id: "other", label: "Other" },
  ],
  tablet: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "microsoft", label: "Microsoft" },
    { id: "other", label: "Other" },
  ],
  laptop: [
    { id: "apple", label: "Apple" },
    { id: "dell", label: "Dell" },
    { id: "hp", label: "HP" },
    { id: "lenovo", label: "Lenovo" },
    { id: "other", label: "Other" },
  ],
  desktop: [
    { id: "custom", label: "Custom Build" },
    { id: "prebuilt", label: "Prebuilt / OEM" },
    { id: "other", label: "Other" },
  ],
  console: [
    { id: "sony", label: "PlayStation" },
    { id: "microsoft", label: "Xbox" },
    { id: "nintendo", label: "Nintendo" },
    { id: "other", label: "Other" },
  ],
  // watch: [
  //   { id: "apple", label: "Apple Watch" },
  //   { id: "samsung", label: "Galaxy Watch" },
  //   { id: "other", label: "Other" },
  // ],
};

export const FAULTS: Record<DeviceTypeId, Fault[]> = {
  phone: [
    { id: "screen", label: "Cracked Screen", description: "Full display & glass replacement", priceFrom: 59, etaLabel: "45 min" },
    { id: "battery", label: "Battery Replacement", description: "Restore full-day battery life", priceFrom: 39, etaLabel: "30 min" },
    { id: "charging-port", label: "Charging Port", description: "Won't charge or loose connection", priceFrom: 45, etaLabel: "1 hr" },
    { id: "water-damage", label: "Water Damage", description: "Liquid damage diagnostics & repair", priceFrom: 49, etaLabel: "1-2 days" },
    { id: "camera", label: "Camera Repair", description: "Blurry, cracked or faulty camera", priceFrom: 49, etaLabel: "1 hr" },
    { id: "software", label: "Software Issue", description: "Boot loops, frozen or slow performance", priceFrom: 29, etaLabel: "Same day" },
  ],
  tablet: [
    { id: "screen", label: "Cracked Screen", description: "Full display & digitizer replacement", priceFrom: 69, etaLabel: "Same day" },
    { id: "battery", label: "Battery Replacement", description: "Restore full-day battery life", priceFrom: 49, etaLabel: "Same day" },
    { id: "charging-port", label: "Charging Port", description: "Won't charge or loose connection", priceFrom: 49, etaLabel: "1-2 days" },
    { id: "water-damage", label: "Water Damage", description: "Liquid damage diagnostics & repair", priceFrom: 55, etaLabel: "1-2 days" },
    { id: "software", label: "Software Issue", description: "Boot loops, frozen or slow performance", priceFrom: 29, etaLabel: "Same day" },
  ],
  laptop: [
    { id: "screen", label: "Cracked Screen", description: "LCD/OLED panel replacement", priceFrom: 89, etaLabel: "1-2 days" },
    { id: "keyboard", label: "Keyboard Repair", description: "Sticky, missing or dead keys", priceFrom: 59, etaLabel: "Same day" },
    { id: "battery", label: "Battery Replacement", description: "Restore full-day battery life", priceFrom: 65, etaLabel: "Same day" },
    { id: "hinge", label: "Hinge & Casing", description: "Loose, cracked or broken hinges", priceFrom: 55, etaLabel: "1-2 days" },
    { id: "water-damage", label: "Water Damage", description: "Liquid damage diagnostics & repair", priceFrom: 69, etaLabel: "2-3 days" },
    { id: "boot-issue", label: "Won't Turn On", description: "Power, boot & motherboard diagnostics", priceFrom: 49, etaLabel: "1-2 days" },
    { id: "virus", label: "Virus & Slow Performance", description: "Malware clean-up & performance tune-up", priceFrom: 39, etaLabel: "Same day" },
  ],
  desktop: [
    { id: "boot-issue", label: "Won't Turn On", description: "Power, boot & component diagnostics", priceFrom: 49, etaLabel: "1-2 days" },
    { id: "upgrade", label: "Upgrade (RAM/SSD/GPU)", description: "Component upgrades & installation", priceFrom: 39, etaLabel: "Same day" },
    { id: "overheating", label: "Overheating / Noisy Fans", description: "Deep clean & thermal repaste", priceFrom: 45, etaLabel: "Same day" },
    { id: "virus", label: "Virus & Slow Performance", description: "Malware clean-up & performance tune-up", priceFrom: 39, etaLabel: "Same day" },
    { id: "data-recovery", label: "Data Recovery", description: "Rescue files from a failed drive", priceFrom: 79, etaLabel: "2-4 days" },
    { id: "build-rebuild", label: "Rebuild / Reinstall", description: "Fresh OS install & full setup", priceFrom: 49, etaLabel: "Same day" },
  ],
  console: [
    { id: "hdmi-port", label: "HDMI Port", description: "No signal or loose HDMI connection", priceFrom: 55, etaLabel: "1-2 days" },
    { id: "overheating", label: "Overheating / Shutting Down", description: "Deep clean & thermal repaste", priceFrom: 49, etaLabel: "Same day" },
    { id: "disc-drive", label: "Disc Drive", description: "Won't read, eject or grinding noise", priceFrom: 55, etaLabel: "1-2 days" },
    { id: "controller-drift", label: "Controller Drift", description: "Stick drift & button repair", priceFrom: 29, etaLabel: "Same day" },
    { id: "power-issue", label: "Won't Turn On", description: "Power supply & board diagnostics", priceFrom: 49, etaLabel: "1-2 days" },
  ],
  // watch: [
  //   { id: "screen", label: "Cracked Screen", description: "Display & glass replacement", priceFrom: 69, etaLabel: "Same day" },
  //   { id: "battery", label: "Battery Replacement", description: "Restore full-day battery life", priceFrom: 49, etaLabel: "Same day" },
  //   { id: "water-damage", label: "Water Damage", description: "Liquid damage diagnostics & repair", priceFrom: 55, etaLabel: "1-2 days" },
  //   { id: "software", label: "Software Issue", description: "Frozen, unresponsive or won't pair", priceFrom: 29, etaLabel: "Same day" },
  // ],
};
