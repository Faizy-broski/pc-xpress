"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatGBP } from "@/components/build-a-pc/data";
import { RepairSummary } from "@/components/repair/repair-summary";
import {
  BRANDS,
  DEVICE_TYPES,
  FAULTS,
  type DeviceTypeId,
} from "@/components/repair/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_LABELS = ["Device", "Brand", "Issue"] as const;

interface RepairWizardProps {
  initialDevice?: DeviceTypeId;
}

export function RepairWizard({ initialDevice }: RepairWizardProps) {
  const [deviceId, setDeviceId] = useState<DeviceTypeId | null>(initialDevice ?? null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [faultId, setFaultId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(initialDevice ? 2 : 1);

  const device = DEVICE_TYPES.find((d) => d.id === deviceId) ?? null;
  const brands = deviceId ? BRANDS[deviceId] : [];
  const brand = brands.find((b) => b.id === brandId) ?? null;
  const faults = deviceId ? FAULTS[deviceId] : [];
  const fault = faults.find((f) => f.id === faultId) ?? null;

  function selectDevice(id: DeviceTypeId) {
    setDeviceId(id);
    setBrandId(null);
    setFaultId(null);
    setStep(2);
  }

  function selectBrand(id: string) {
    setBrandId(id);
    setStep(3);
  }

  function canReach(n: 1 | 2 | 3) {
    if (n === 1) return true;
    if (n === 2) return Boolean(deviceId);
    return Boolean(deviceId && brandId);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-white/10 bg-white/2 p-4 shadow-card sm:p-6">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3">
            {STEP_LABELS.map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3;
              const reachable = canReach(n);
              const active = step === n;
              const complete = step > n;

              return (
                <div key={label} className="flex items-center gap-1.5 sm:gap-3">
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => setStep(n)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium transition-colors sm:text-sm",
                      active ? "text-primary" : reachable ? "text-white/60 hover:text-white" : "text-white/25",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold",
                        active && "border-primary bg-primary/15 text-primary",
                        complete && "border-primary bg-primary text-primary-foreground",
                        !active && !complete && "border-white/20 text-white/40"
                      )}
                    >
                      {complete ? <Check className="size-3" /> : n}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                  {n < 3 && <span className="h-px w-5 bg-white/10 sm:w-10" />}
                </div>
              );
            })}
          </div>

          <div className="mt-6 min-h-80">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <h2 className="text-lg font-bold text-white">What needs fixing?</h2>
                  <p className="mt-1 text-sm text-white/50">Choose the type of device you&apos;d like repaired.</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {DEVICE_TYPES.map((dt) => (
                      <motion.button
                        key={dt.id}
                        type="button"
                        onClick={() => selectDevice(dt.id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-colors hover:border-primary/60",
                          deviceId === dt.id ? "border-primary bg-primary/10" : "border-white/10 bg-white/3"
                        )}
                      >
                        <dt.icon className={cn("size-5", deviceId === dt.id ? "text-primary" : "text-white/50")} />
                        <p className="mt-2.5 text-sm font-semibold text-white">{dt.label}</p>
                        <p className="mt-0.5 text-xs text-white/40">{dt.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && device && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </button>

                  <h2 className="mt-3 text-lg font-bold text-white">Which brand is your {device.label.toLowerCase()}?</h2>
                  <p className="mt-1 text-sm text-white/50">This helps us quote the right parts.</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {brands.map((b) => (
                      <motion.button
                        key={b.id}
                        type="button"
                        onClick={() => selectBrand(b.id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "rounded-xl border p-4 text-center text-sm font-semibold transition-colors hover:border-primary/60",
                          brandId === b.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 bg-white/3 text-white"
                        )}
                      >
                        {b.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && device && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </button>

                  <h2 className="mt-3 text-lg font-bold text-white">What&apos;s the issue?</h2>
                  <p className="mt-1 text-sm text-white/50">Select the problem that best matches your device.</p>

                  <div className="mt-5 space-y-2.5">
                    {faults.map((f) => {
                      const selected = faultId === f.id;
                      return (
                        <motion.button
                          key={f.id}
                          type="button"
                          onClick={() => setFaultId(f.id)}
                          whileHover={{ y: -1 }}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-lg border p-3.5 text-left transition-colors",
                            selected ? "border-primary bg-primary/10" : "border-white/10 bg-white/3 hover:border-primary/40"
                          )}
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-semibold text-white">{f.label}</span>
                              {selected && (
                                <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-medium text-primary-foreground">
                                  <Check className="size-3" />
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-white/50">{f.description}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-semibold text-primary">From {formatGBP(f.priceFrom)}</p>
                            <p className="mt-0.5 flex items-center justify-end gap-1 text-[0.7rem] text-white/40">
                              <Clock className="size-3" />
                              {f.etaLabel}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <RepairSummary
        device={device}
        brand={brand}
        fault={fault}
        onEditDevice={() => setStep(1)}
        onEditBrand={() => canReach(2) && setStep(2)}
        onEditFault={() => canReach(3) && setStep(3)}
      />
    </div>
  );
}
