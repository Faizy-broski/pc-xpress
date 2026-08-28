"use client";

import type { CSSProperties, ReactNode } from "react";
import { Check, HardDrive, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { CatalogIcon } from "@/components/icons/icon-registry";
import type { Category, CategoryId, PartOption } from "@/components/build-a-pc/data";

const EASE = [0.22, 1, 0.36, 1] as const;

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
        selected ? "border-primary bg-primary/15" : "border-white/25",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-1.5 rounded-full border",
          selected ? "border-primary/50" : "border-white/20"
        )}
      />
      <span
        className={cn(
          "absolute inset-1.5 rotate-45 rounded-full border",
          selected ? "border-primary/50" : "border-white/20"
        )}
      />
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
        "group absolute flex rounded-lg border p-[clamp(0.25rem,1.6vw,0.75rem)] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
        layer === "background" ? "z-0" : "z-10",
        labelPosition === "center" && "flex-col items-center justify-center gap-[clamp(0.125rem,0.8vw,0.5rem)]",
        labelPosition === "bottom" && "flex-col items-center justify-between",
        isTopLeft && "flex-col items-start justify-start",
        layer === "background"
          ? selected
            ? "border-primary/45 bg-primary/5"
            : "border-white/15 hover:border-white/25"
          : selected
            ? "border-primary bg-primary/15"
            : "border-white/12 bg-white/3 hover:border-white/25 hover:bg-white/6",
        className
      )}
    >
      {/* Selected-option badge: kept INSIDE the box bounds (not floated above
          the border) so it can never be clipped by the diagram's
          overflow-hidden container, even on narrow/mobile widths.
          Top-left regions show the selected name in their static label
          chip instead (see Diagram), so the badge would just duplicate
          and visually overlap it in the same corner. */}
      {selected && option && !isTopLeft && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute top-1 left-1/2 z-20 flex max-w-[85%] -translate-x-1/2 items-center gap-1 truncate rounded-full bg-primary px-[clamp(0.3rem,1.1vw,0.55rem)] py-[clamp(0.0625rem,0.5vw,0.25rem)] text-[clamp(0.5rem,1.6vw,0.65rem)] font-medium text-primary-foreground shadow-glow sm:top-1.5"
        >
          <Check className="size-[clamp(0.55rem,1.4vw,0.7rem)] shrink-0" />
          <span className="truncate">{option.name}</span>
        </motion.span>
      )}
      {children}
      {!isTopLeft && (
        <span
          className={cn(
            "text-[clamp(0.45rem,1.4vw,0.6rem)] font-semibold uppercase tracking-wider whitespace-nowrap",
            selected ? "text-primary" : "text-white/45"
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
  const progressPct = (doneCount / categories.length) * 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-gradient-brand px-4 py-3 sm:px-5">
        <div>
          <h3 className="text-sm font-bold text-white sm:text-base">PC Internal Layout</h3>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase sm:text-[11px]">
            Side view
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/15 sm:w-28">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </div>
          <span className="font-mono text-xs font-semibold text-white" aria-live="polite">
            {doneCount}/{categories.length}
          </span>
        </div>
      </div>

      <div
        role="group"
        aria-label="Interactive PC build diagram — select a part in each highlighted region"
        className="relative aspect-4/5 sm:aspect-16/13 overflow-hidden bg-secondary"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        {/* ambient glow accents */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(55% 45% at 82% 12%, oklch(0.53 0.215 27.3 / 14%), transparent), radial-gradient(45% 40% at 12% 92%, oklch(0.53 0.215 27.3 / 8%), transparent)",
          }}
        />

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
              "flex max-w-full items-center gap-1 sm:gap-1.5 rounded-full border px-2 py-1 text-[clamp(0.45rem,1.4vw,0.6rem)] font-semibold tracking-wider",
              selections.motherboard
                ? "border-primary/30 bg-primary text-primary-foreground normal-case shadow-glow"
                : "border-white/15 bg-black/30 uppercase text-white/50"
            )}
          >
            <CatalogIcon name={motherboard.icon} className="size-[clamp(0.5rem,1.4vw,0.75rem)] shrink-0" />
            <span className="truncate">
              {selections.motherboard ? selections.motherboard.name : motherboard.label}
            </span>
          </span>
        </Region>

        {/* top radiator / cooler fan row */}
        <Region
          category={cooler}
          option={selections.cooler}
          onSelect={onSelect}
          style={{ top: "12%", left: "9%", width: "54%", height: "18%" }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {[0, 1, 2].map((i) => (
              <Fan
                key={i}
                selected={Boolean(selections.cooler)}
                className="size-[clamp(1.1rem,5vw,2rem)]"
              />
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
          <div
            className={cn(
              "relative flex size-[clamp(2rem,9vw,4rem)] items-center justify-center rounded-full border-2",
              selections.cpu ? "border-primary bg-primary/12" : "border-white/25"
            )}
          >
            <CatalogIcon
              name={cpu.icon}
              className={cn(
                "size-[clamp(1rem,4.5vw,1.5rem)]",
                selections.cpu ? "text-primary" : "text-white/40"
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
          <div className="flex h-[clamp(2rem,8vw,3.5rem)] items-stretch justify-center gap-1 sm:gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "w-[clamp(0.3rem,1.6vw,0.625rem)] rounded-sm border",
                  selections.ram ? "border-primary bg-primary/25" : "border-white/20 bg-white/5"
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
          <div className="flex w-full items-center justify-between gap-1">
            <div className="flex items-center gap-1 sm:gap-2">
              {[0, 1].map((i) => (
                <Fan
                  key={i}
                  selected={Boolean(selections.gpu)}
                  className="size-[clamp(1rem,4vw,1.75rem)]"
                />
              ))}
            </div>
            <span
              className={cn(
                "truncate font-mono text-[clamp(0.45rem,1.3vw,0.6rem)] font-bold tracking-wide sm:tracking-widest",
                selections.gpu ? "text-primary" : "text-white/40"
              )}
            >
              GRAPHICS CARD
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
            className={cn(
              "size-[clamp(0.9rem,3.5vw,1.25rem)]",
              selections.psu ? "text-primary" : "text-white/40"
            )}
          />
        </Region>

        {/* Storage bays */}
        <Region
          category={storage}
          option={selections.storage}
          onSelect={onSelect}
          style={{ top: "84%", left: "37%", width: "31%", height: "14%" }}
        >
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "flex size-[clamp(0.65rem,3vw,1.25rem)] items-center justify-center rounded-sm border",
                  selections.storage
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-white/20 text-white/40"
                )}
              >
                <HardDrive className="size-[clamp(0.4rem,1.8vw,0.625rem)]" />
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
              <Fan
                key={i}
                selected={Boolean(selections.case)}
                className="size-[clamp(1.4rem,6vw,2.5rem)]"
              />
            ))}
          </div>
        </Region>
      </div>

      {/* parts summary strip */}
      <div className="grid grid-cols-4 gap-px bg-border sm:grid-cols-8">
        {categories.map((category) => {
          const option = selections[category.id];
          return (
            <div
              key={category.id}
              className="flex flex-col items-center gap-1 bg-card px-1.5 py-2.5 text-center"
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border",
                  option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                )}
              >
                {option ? <Check className="size-3.5" /> : <CatalogIcon name={category.icon} className="size-3.5" />}
              </span>
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-wide uppercase",
                  option ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {category.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
