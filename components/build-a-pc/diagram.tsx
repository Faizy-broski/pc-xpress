"use client";

import type { CSSProperties, ReactNode } from "react";
import { HardDrive, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { Category, CategoryId, PartOption } from "@/components/build-a-pc/data";

interface DiagramProps {
  categories: Category[];
  selections: Partial<Record<CategoryId, PartOption>>;
  onSelect: (id: CategoryId) => void;
}

function byId(categories: Category[], id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

function Fan({ selected, className }: { selected: boolean; className?: string }) {
  return (
    <motion.span
      animate={selected ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
      transition={
        selected
          ? { duration: 0.3 }
          : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      }
      className={cn(
        "relative shrink-0 rounded-full border-2",
        selected ? "border-primary shadow-glow" : "border-border",
        className
      )}
    >
      <span className="absolute inset-[6px] rounded-full border border-border" />
      <span className="absolute inset-[6px] rotate-45 rounded-full border border-border" />
    </motion.span>
  );
}

interface RegionProps {
  category: Category;
  option?: PartOption;
  onSelect: (id: CategoryId) => void;
  style: CSSProperties;
  className?: string;
  labelPosition?: "center" | "bottom" | "top-left";
  layer?: "background" | "foreground";
  children: ReactNode;
}

function Region({
  category,
  option,
  onSelect,
  style,
  className,
  labelPosition = "center",
  layer = "foreground",
  children,
}: RegionProps) {
  const selected = Boolean(option);
  const isTopLeft = labelPosition === "top-left";

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(category.id)}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      aria-label={
        selected
          ? `${category.label}: ${option!.name} selected. Click to change.`
          : `${category.label}: not selected. Click to choose.`
      }
      style={style}
      className={cn(
        "group absolute flex rounded-lg border p-3 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
        layer === "background" ? "z-0" : "z-10",
        labelPosition === "center" && "flex-col items-center justify-center gap-2",
        labelPosition === "bottom" && "flex-col items-center justify-between",
        isTopLeft && "flex-col items-start justify-start",
        selected
          ? "border-primary bg-primary/10 shadow-glow"
          : "border-border bg-card hover:border-primary/40 hover:bg-primary/5",
        className
      )}
    >
      {/* Selected-option badge: kept INSIDE the box bounds (not floated above
          the border) so it can never be clipped by the diagram's
          overflow-hidden container, even on narrow/mobile widths. */}
      {selected && option && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "pointer-events-none absolute z-20 max-w-[85%] truncate rounded-md bg-primary px-2 py-1 text-[0.6rem] font-medium text-primary-foreground shadow-glow sm:text-[0.65rem]",
            isTopLeft ? "top-1.5 left-1.5" : "top-1.5 left-1/2 -translate-x-1/2"
          )}
        >
          {option.name}
        </motion.span>
      )}
      {children}
      {!isTopLeft && (
        <span
          className={cn(
            "text-[0.6rem] font-semibold uppercase tracking-wider whitespace-nowrap",
            selected ? "text-primary" : "text-muted-foreground"
          )}
        >
          {category.label}
        </span>
      )}
    </motion.button>
  );
}

export function Diagram({ categories, selections, onSelect }: DiagramProps) {
  const cpu = byId(categories, "cpu");
  const cooler = byId(categories, "cooler");
  const motherboard = byId(categories, "motherboard");
  const ram = byId(categories, "ram");
  const gpu = byId(categories, "gpu");
  const storage = byId(categories, "storage");
  const psu = byId(categories, "psu");
  const kase = byId(categories, "case");

  const doneCount = Object.keys(selections).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
      <div className="flex items-center justify-between px-1 pb-2.5 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground">
        <span>PC INTERNAL LAYOUT — SIDE VIEW</span>
        <span className="text-primary" aria-live="polite">
          {doneCount}/8 MAPPED
        </span>
      </div>

      <div
        role="group"
        aria-label="Interactive PC build diagram — select a part in each highlighted region"
        className="relative aspect-16/13 overflow-hidden rounded-lg border border-border"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          backgroundColor: "var(--muted)",
        }}
      >
        {/* motherboard tray — sits behind the cooler/cpu/ram cluster */}
        <Region
          category={motherboard}
          option={selections.motherboard}
          onSelect={onSelect}
          labelPosition="top-left"
          layer="background"
          style={{ top: "8%", left: "4%", width: "64%", height: "74%" }}
          className="border-dashed"
        >
          <span
            className={cn(
              "flex items-center gap-1.5 rounded border border-border bg-background/90 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wider",
              selections.motherboard ? "text-primary" : "text-muted-foreground"
            )}
          >
            <motherboard.icon className="size-3" />
            {motherboard.label}
          </span>
        </Region>

        {/* top radiator / cooler fan row */}
        <Region
          category={cooler}
          option={selections.cooler}
          onSelect={onSelect}
          style={{ top: "12%", left: "9%", width: "54%", height: "18%" }}
        >
          <div className="flex items-center justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <Fan key={i} selected={Boolean(selections.cooler)} className="size-7 sm:size-8" />
            ))}
          </div>
        </Region>

        {/* CPU socket */}
        <Region
          category={cpu}
          option={selections.cpu}
          onSelect={onSelect}
          style={{ top: "32%", left: "9%", width: "22%", height: "32%" }}
        >
          <div className="relative flex size-12 items-center justify-center rounded-full border-2 border-border sm:size-16">
            <cpu.icon
              className={cn(
                "size-6",
                selections.cpu ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
        </Region>

        {/* RAM DIMM slots */}
        <Region
          category={ram}
          option={selections.ram}
          onSelect={onSelect}
          style={{ top: "32%", left: "37%", width: "26%", height: "32%" }}
        >
          <div className="flex h-12 items-stretch justify-center gap-2 sm:h-14">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "w-2 rounded-sm border sm:w-2.5",
                  selections.ram
                    ? "border-primary bg-primary/20"
                    : "border-border bg-background"
                )}
              />
            ))}
          </div>
        </Region>

        {/* GPU */}
        <Region
          category={gpu}
          option={selections.gpu}
          onSelect={onSelect}
          labelPosition="bottom"
          style={{ top: "66%", left: "4%", width: "64%", height: "16%" }}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {[0, 1].map((i) => (
                <Fan key={i} selected={Boolean(selections.gpu)} className="size-6 sm:size-7" />
              ))}
            </div>
            <span
              className={cn(
                "font-mono text-[0.6rem] font-bold tracking-widest",
                selections.gpu ? "text-primary" : "text-muted-foreground"
              )}
            >
              GEFORCE RTX
            </span>
          </div>
        </Region>

        {/* PSU */}
        <Region
          category={psu}
          option={selections.psu}
          onSelect={onSelect}
          style={{ top: "84%", left: "4%", width: "29%", height: "14%" }}
        >
          <Zap
            className={cn("size-5", selections.psu ? "text-primary" : "text-muted-foreground")}
          />
        </Region>

        {/* Storage bays */}
        <Region
          category={storage}
          option={selections.storage}
          onSelect={onSelect}
          style={{ top: "84%", left: "37%", width: "31%", height: "14%" }}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "flex size-4 items-center justify-center rounded-sm border sm:size-5",
                  selections.storage
                    ? "border-primary/60 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                <HardDrive className="size-2.5" />
              </span>
            ))}
          </div>
        </Region>

        {/* case / side fans */}
        <Region
          category={kase}
          option={selections.case}
          onSelect={onSelect}
          style={{ top: "8%", left: "72%", width: "24%", height: "89%" }}
        >
          <div className="flex h-[75%] flex-col items-center justify-between">
            {[0, 1, 2].map((i) => (
              <Fan key={i} selected={Boolean(selections.case)} className="size-9 sm:size-10" />
            ))}
          </div>
        </Region>
      </div>
    </div>
  );
}