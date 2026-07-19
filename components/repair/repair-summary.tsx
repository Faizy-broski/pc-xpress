"use client";

import { ArrowRight, Clock, Pencil, PhoneCall } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { formatGBP } from "@/components/build-a-pc/data";
import type { Brand, DeviceType, Fault } from "@/components/repair/data";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RepairSummaryProps {
  device: DeviceType | null;
  brand: Brand | null;
  fault: Fault | null;
  onEditDevice: () => void;
  onEditBrand: () => void;
  onEditFault: () => void;
}

export function RepairSummary({
  device,
  brand,
  fault,
  onEditDevice,
  onEditBrand,
  onEditFault,
}: RepairSummaryProps) {
  const steps = [
    { label: "Device", value: device?.label, onEdit: onEditDevice },
    { label: "Brand", value: brand?.label, onEdit: onEditBrand },
    { label: "Issue", value: fault?.label, onEdit: onEditFault },
  ];
  const doneCount = steps.filter((s) => s.value).length;
  const ready = Boolean(device && brand && fault);

  const contactHref = `/contact${
    device && brand && fault
      ? `?device=${device.id}&brand=${brand.id}&issue=${fault.id}`
      : ""
  }`;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold text-white">Your Repair Request</h2>
          <span className="text-xs text-white/40">{doneCount}/3</span>
        </div>

        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${(doneCount / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>

        <div className="mt-3 space-y-2">
          <AnimatePresence initial={false}>
            {steps.map(
              (step) =>
                step.value && (
                  <motion.div
                    key={step.label}
                    layout
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-white/3 p-3">
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wide text-white/40">
                          {step.label}
                        </p>
                        <p className="truncate text-sm font-medium text-white">{step.value}</p>
                      </div>
                      <button
                        type="button"
                        onClick={step.onEdit}
                        aria-label={`Change ${step.label}`}
                        className="text-white/40 hover:text-white"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>

          {doneCount === 0 && <p className="text-sm text-white/40">No selections yet.</p>}
        </div>

        {fault && (
          <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-sm">
            <div className="flex justify-between text-white/50">
              <span>Estimated price</span>
              <span className="font-semibold text-primary">From {formatGBP(fault.priceFrom)}</span>
            </div>
            <div className="flex items-center justify-between text-white/50">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Typical turnaround
              </span>
              <span>{fault.etaLabel}</span>
            </div>
          </div>
        )}

        <Button
          className="mt-4 w-full"
          disabled={!ready}
          nativeButton={false}
          render={<a href={contactHref} />}
        >
          {ready ? "Book This Repair" : "Complete all steps to continue"}
          {ready && <ArrowRight />}
        </Button>
        <p className="mt-2 text-center text-xs text-white/40">
          Free diagnostics — final pricing confirmed before any work begins.
        </p>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/3 p-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <PhoneCall className="size-4" />
          <h3 className="font-mono text-sm font-semibold">Not sure what&apos;s wrong?</h3>
        </div>
        <p className="mt-2.5 text-sm text-white/50">
          Give us a call and our technicians will help you diagnose the issue
          over the phone — free of charge.
        </p>
        <a
          href="tel:+447307093007"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          +44 7307 093007
        </a>
      </div>
    </div>
  );
}
