"use client";

import { useState } from "react";
import { ArrowRight, Clock, Pencil, PhoneCall } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { formatGBP } from "@/components/build-a-pc/data";
import { BookingModal } from "@/components/booking/booking-modal";
import type { Brand, DeviceType, Fault } from "@/components/repair/data";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RepairSummaryProps {
  device: DeviceType | null;
  brand: Brand | null;
  faults: Fault[];
  onEditDevice: () => void;
  onEditBrand: () => void;
  onEditFault: () => void;
}

export function RepairSummary({
  device,
  brand,
  faults,
  onEditDevice,
  onEditBrand,
  onEditFault,
}: RepairSummaryProps) {
  const issuesValue =
    faults.length === 0
      ? undefined
      : faults.length === 1
        ? faults[0].label
        : `${faults.length} issues selected`;

  const steps = [
    { label: "Device", value: device?.label, onEdit: onEditDevice },
    { label: "Brand", value: brand?.label, onEdit: onEditBrand },
    { label: "Issue", value: issuesValue, onEdit: onEditFault },
  ];
  const doneCount = steps.filter((s) => s.value).length;
  const ready = Boolean(device && brand && faults.length > 0);
  const totalFrom = faults.reduce((sum, f) => sum + f.priceFrom, 0);

  const [bookingOpen, setBookingOpen] = useState(false);

  const bookingSummary =
    device && brand && faults.length > 0
      ? [
          { label: "Device", value: device.label },
          { label: "Brand", value: brand.label },
          ...faults.map((f, i) => ({
            label: faults.length > 1 ? `Issue ${i + 1}` : "Issue",
            value: `${f.label} — from ${formatGBP(f.priceFrom)} (${f.etaLabel})`,
          })),
        ]
      : [];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold text-foreground">Your Repair Request</h2>
          <span className="text-xs text-muted-foreground">{doneCount}/3</span>
        </div>

        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
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
                    <div className="flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-3">
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          {step.label}
                        </p>
                        <p className="truncate text-sm font-medium text-foreground">{step.value}</p>
                      </div>
                      <button
                        type="button"
                        onClick={step.onEdit}
                        aria-label={`Change ${step.label}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>

          {doneCount === 0 && <p className="text-sm text-muted-foreground">No selections yet.</p>}
        </div>

        {faults.length > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
            {faults.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 text-muted-foreground">
                <span className="flex items-center gap-1.5 truncate">
                  <Clock className="size-3.5 shrink-0" />
                  <span className="truncate">{f.label}</span>
                </span>
                <span className="shrink-0 font-medium text-foreground">
                  {formatGBP(f.priceFrom)} · {f.etaLabel}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-1.5 text-muted-foreground">
              <span>Estimated total</span>
              <span className="font-semibold text-primary">From {formatGBP(totalFrom)}</span>
            </div>
          </div>
        )}

        <Button className="mt-4 w-full" disabled={!ready} onClick={() => setBookingOpen(true)}>
          {ready ? "Book This Repair" : "Complete all steps to continue"}
          {ready && <ArrowRight />}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Free diagnostics — final pricing confirmed before any work begins.
        </p>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        kind="repair"
        title="Confirm Your Repair Booking"
        description="Add your contact details and we'll confirm your booking by email."
        summary={bookingSummary}
        totalText={faults.length > 0 ? `From ${formatGBP(totalFrom)}` : undefined}
      />

      <div className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <PhoneCall className="size-4" />
          <h3 className="font-mono text-sm font-semibold">Not sure what&apos;s wrong?</h3>
        </div>
        <p className="mt-2.5 text-sm text-muted-foreground">
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
