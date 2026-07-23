"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatGBP } from "@/components/build-a-pc/data";
import { CatalogIcon } from "@/components/icons/icon-registry";
import { RepairSummary } from "@/components/repair/repair-summary";
import type { Brand, DeviceType, DeviceTypeId, Fault } from "@/components/repair/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_LABELS = ["Device", "Brand", "Issue"] as const;

interface RepairWizardProps {
  initialDevice?: DeviceTypeId;
  deviceTypes: DeviceType[];
  brands: Record<DeviceTypeId, Brand[]>;
  faults: Record<DeviceTypeId, Fault[]>;
}

export function RepairWizard({ initialDevice, deviceTypes, brands, faults }: RepairWizardProps) {
  const [deviceId, setDeviceId] = useState<DeviceTypeId | null>(initialDevice ?? null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [faultId, setFaultId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(initialDevice ? 2 : 1);

  const device = deviceTypes.find((d) => d.id === deviceId) ?? null;
  const deviceBrands = deviceId ? (brands[deviceId] ?? []) : [];
  const brand = deviceBrands.find((b) => b.id === brandId) ?? null;
  const deviceFaults = deviceId ? (faults[deviceId] ?? []) : [];
  const fault = deviceFaults.find((f) => f.id === faultId) ?? null;

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
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6">
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
                      active ? "text-primary" : reachable ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-semibold",
                        active && "border-primary bg-primary/15 text-primary",
                        complete && "border-primary bg-primary text-primary-foreground",
                        !active && !complete && "border-border text-muted-foreground"
                      )}
                    >
                      {complete ? <Check className="size-3" /> : n}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                  {n < 3 && <span className="h-px w-5 bg-border sm:w-10" />}
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
                  <h2 className="text-lg font-bold text-foreground">What needs fixing?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose the type of device you&apos;d like repaired.</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {deviceTypes.map((dt) => (
                      <motion.button
                        key={dt.id}
                        type="button"
                        onClick={() => selectDevice(dt.id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-colors hover:border-primary/60",
                          deviceId === dt.id ? "border-primary bg-primary/10" : "border-border bg-card"
                        )}
                      >
                        <CatalogIcon name={dt.icon} className={cn("size-5", deviceId === dt.id ? "text-primary" : "text-muted-foreground")} />
                        <p className="mt-2.5 text-sm font-semibold text-foreground">{dt.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{dt.description}</p>
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
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </button>

                  <h2 className="mt-3 text-lg font-bold text-foreground">Which brand is your {device.label.toLowerCase()}?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">This helps us quote the right parts.</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {deviceBrands.map((b) => (
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
                            : "border-border bg-card text-foreground"
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
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </button>

                  <h2 className="mt-3 text-lg font-bold text-foreground">What&apos;s the issue?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Select the problem that best matches your device.</p>

                  <div className="mt-5 space-y-2.5">
                    {deviceFaults.map((f) => {
                      const selected = faultId === f.id;
                      return (
                        <motion.button
                          key={f.id}
                          type="button"
                          onClick={() => setFaultId(f.id)}
                          whileHover={{ y: -1 }}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-lg border p-3.5 text-left transition-colors",
                            selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-semibold text-foreground">{f.label}</span>
                              {selected && (
                                <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-medium text-primary-foreground">
                                  <Check className="size-3" />
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">{f.description}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-semibold text-primary">From {formatGBP(f.priceFrom)}</p>
                            <p className="mt-0.5 flex items-center justify-end gap-1 text-[0.7rem] text-muted-foreground">
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
