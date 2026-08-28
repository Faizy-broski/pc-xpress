"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Battery,
  Bug,
  Camera,
  Check,
  Disc,
  Droplets,
  Gamepad2,
  HardDrive,
  Keyboard,
  MonitorSmartphone,
  PanelTop,
  Plug,
  Power,
  RefreshCw,
  ShieldAlert,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DeviceType, DeviceTypeId, Fault } from "@/components/repair/data";

const FAULT_ICONS: Record<string, LucideIcon> = {
  screen: MonitorSmartphone,
  battery: Battery,
  "charging-port": Plug,
  "water-damage": Droplets,
  camera: Camera,
  software: Bug,
  keyboard: Keyboard,
  hinge: PanelTop,
  "boot-issue": Power,
  virus: ShieldAlert,
  upgrade: Zap,
  overheating: Wind,
  "data-recovery": HardDrive,
  "build-rebuild": RefreshCw,
  "hdmi-port": Plug,
  "disc-drive": Disc,
  "controller-drift": Gamepad2,
  "power-issue": Power,
};

function faultIcon(id: string): LucideIcon {
  return FAULT_ICONS[id] ?? Wrench;
}

type HotspotMap = Record<string, { top: string; left: string }>;

const FAULT_POSITIONS: Record<DeviceTypeId, HotspotMap> = {
  phone: {
    camera: { top: "13%", left: "50%" },
    screen: { top: "36%", left: "50%" },
    battery: { top: "56%", left: "50%" },
    "water-damage": { top: "46%", left: "32%" },
    software: { top: "46%", left: "68%" },
    "charging-port": { top: "89%", left: "50%" },
  },
  tablet: {
    camera: { top: "11%", left: "50%" },
    screen: { top: "45%", left: "50%" },
    battery: { top: "68%", left: "38%" },
    "water-damage": { top: "50%", left: "14%" },
    software: { top: "26%", left: "86%" },
    "charging-port": { top: "91%", left: "50%" },
  },
  laptop: {
    screen: { top: "24%", left: "45%" },
    virus: { top: "18%", left: "70%" },
    hinge: { top: "45%", left: "50%" },
    keyboard: { top: "62%", left: "45%" },
    "water-damage": { top: "66%", left: "68%" },
    battery: { top: "80%", left: "30%" },
    "boot-issue": { top: "53%", left: "83%" },
  },
  desktop: {
    "boot-issue": { top: "12%", left: "50%" },
    overheating: { top: "27%", left: "50%" },
    upgrade: { top: "45%", left: "50%" },
    "data-recovery": { top: "63%", left: "50%" },
    virus: { top: "78%", left: "50%" },
    "build-rebuild": { top: "91%", left: "50%" },
  },
  console: {
    "hdmi-port": { top: "30%", left: "18%" },
    overheating: { top: "14%", left: "32%" },
    "power-issue": { top: "40%", left: "44%" },
    "disc-drive": { top: "30%", left: "48%" },
    "controller-drift": { top: "70%", left: "62%" },
  },
};

function fallbackPositions(faults: Fault[], deviceTop = 60): HotspotMap {
  const map: HotspotMap = {};
  faults.forEach((f, i) => {
    const cols = 3;
    const row = Math.floor(i / cols);
    const col = i % cols;
    map[f.id] = {
      top: `${deviceTop + row * 12}%`,
      left: `${20 + col * 30}%`,
    };
  });
  return map;
}

function Shape({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-xl border-2 border-white/20 bg-white/3",
        className
      )}
    >
      {children}
    </div>
  );
}

function PhoneSilhouette() {
  return (
    <div className="absolute top-[5%] left-1/2 h-[90%] w-[34%] -translate-x-1/2">
      {/* metal frame */}
      <div className="absolute inset-0 rounded-[2.1rem] border border-white/25 bg-linear-to-b from-white/10 via-white/4 to-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]">
        {/* side buttons */}
        <span className="absolute top-[16%] left-[-3%] h-[5%] w-[3%] rounded-l-sm bg-white/20" />
        <span className="absolute top-[24%] left-[-3%] h-[9%] w-[3%] rounded-l-sm bg-white/20" />
        <span className="absolute top-[18%] right-[-3%] h-[7%] w-[3%] rounded-r-sm bg-white/20" />

        {/* screen */}
        <div className="absolute inset-[6%] overflow-hidden rounded-[1.5rem] bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(60% 40% at 50% 0%, oklch(0.6 0.19 260 / 30%), transparent)",
            }}
          />
          {/* punch-hole camera */}
          <span className="absolute top-[2.5%] left-1/2 size-[3.5%] -translate-x-1/2 rounded-full border border-white/15 bg-black" />
          {/* home indicator */}
          <span className="absolute bottom-[1.5%] left-1/2 h-[0.6%] w-[24%] -translate-x-1/2 rounded-full bg-white/25" />
        </div>

        {/* rear camera hint (subtle, top corner) */}
        <span className="absolute top-[3%] right-[10%] size-[7%] rounded-xl border border-white/15 bg-black/40" />
      </div>
    </div>
  );
}

function TabletSilhouette() {
  return (
    <Shape className="top-1/2 left-1/2 h-[68%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem]">
      <span className="absolute top-[4%] left-1/2 size-[3.5%] -translate-x-1/2 rounded-full border border-white/20 bg-black/30" />
    </Shape>
  );
}

function LaptopSilhouette() {
  return (
    <>
      <Shape className="top-[6%] left-1/2 h-[38%] w-[62%] -translate-x-1/2 rounded-t-xl rounded-b-sm" />
      <span className="absolute top-[44%] left-1/2 h-[2%] w-[68%] -translate-x-1/2 rounded-full bg-white/15" />
      <Shape className="top-[48%] left-1/2 h-[30%] w-[76%] -translate-x-1/2 rounded-b-xl rounded-t-sm" />
    </>
  );
}

function DesktopSilhouette() {
  return (
    <Shape className="top-[6%] left-1/2 h-[88%] w-[30%] -translate-x-1/2 rounded-lg">
      <span className="absolute top-[6%] left-1/2 size-[9%] -translate-x-1/2 rounded-full border border-white/20 bg-black/30" />
      <span className="absolute top-[35%] left-[15%] h-[1.5%] w-[70%] rounded-full bg-white/10" />
      <span className="absolute top-[40%] left-[15%] h-[1.5%] w-[70%] rounded-full bg-white/10" />
      <span className="absolute top-[45%] left-[15%] h-[1.5%] w-[70%] rounded-full bg-white/10" />
    </Shape>
  );
}

function ConsoleSilhouette() {
  return (
    <>
      <Shape className="top-[16%] left-[15%] h-[32%] w-[50%] rounded-lg" />
      <Shape className="top-[58%] left-[48%] h-[24%] w-[34%] rounded-2xl">
        <span className="absolute top-1/2 left-[22%] size-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <span className="absolute top-1/2 left-[78%] size-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
      </Shape>
    </>
  );
}

function silhouetteFor(id: DeviceTypeId) {
  switch (id) {
    case "phone":
      return <PhoneSilhouette />;
    case "tablet":
      return <TabletSilhouette />;
    case "laptop":
      return <LaptopSilhouette />;
    case "desktop":
      return <DesktopSilhouette />;
    case "console":
      return <ConsoleSilhouette />;
    default:
      return null;
  }
}

interface DeviceDiagramProps {
  device: DeviceType;
  faults: Fault[];
  selectedFaultIds: string[];
  onToggle: (id: string) => void;
}

export function DeviceDiagram({ device, faults, selectedFaultIds, onToggle }: DeviceDiagramProps) {
  const positions = FAULT_POSITIONS[device.id] ?? {};
  const fallback = fallbackPositions(faults.filter((f) => !positions[f.id]));

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between gap-3 bg-gradient-brand px-4 py-3 sm:px-5">
        <div>
          <h3 className="text-sm font-bold text-white sm:text-base">{device.label} Diagram</h3>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase sm:text-[11px]">
            Tap hotspots to select one or more issues
          </p>
        </div>
        <span className="font-mono text-xs font-semibold text-white" aria-live="polite">
          {selectedFaultIds.length}/{faults.length}
        </span>
      </div>

      <div
        role="group"
        aria-label={`Interactive ${device.label.toLowerCase()} diagram — select where the issues are`}
        className="relative aspect-4/5 sm:aspect-16/12 overflow-hidden bg-secondary"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(55% 45% at 82% 12%, oklch(0.53 0.215 27.3 / 14%), transparent), radial-gradient(45% 40% at 12% 92%, oklch(0.53 0.215 27.3 / 8%), transparent)",
          }}
        />

        {silhouetteFor(device.id)}

        {faults.map((fault) => {
          const pos = positions[fault.id] ?? fallback[fault.id];
          if (!pos) return null;
          const Icon = faultIcon(fault.id);
          const selected = selectedFaultIds.includes(fault.id);

          return (
            <motion.button
              key={fault.id}
              type="button"
              onClick={() => onToggle(fault.id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={selected}
              aria-label={`${fault.label}${selected ? " — selected" : ""}`}
              style={{ top: pos.top, left: pos.left }}
              className={cn(
                "group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border px-2 py-1.5 shadow-lg backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-white/20 bg-black/50 text-white/80 hover:border-primary/60 hover:text-white"
              )}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full">
                {selected ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
              </span>
              <span className="hidden max-w-24 truncate text-[0.65rem] font-semibold whitespace-nowrap sm:inline">
                {fault.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
