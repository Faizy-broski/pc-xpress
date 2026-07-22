"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EASE = [0.22, 1, 0.36, 1] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "h-auto w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export interface BookingSummaryLine {
  label: string;
  value: string;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  kind: "repair" | "build";
  title: string;
  description: string;
  summary: BookingSummaryLine[];
  totalText?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function BookingModal({
  open,
  onClose,
  kind,
  title,
  description,
  summary,
  totalText,
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function resetAndClose() {
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setStatus("idle");
    setErrorMessage("");
    onClose();
  }

  function handleClose() {
    if (status === "submitting") return;
    resetAndClose();
  }

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, status]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isValid = name.trim().length > 0 && phone.trim().length > 0 && EMAIL_RE.test(email);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim() || undefined,
          summary,
          totalText,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          role="presentation"
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="max-h-[min(90vh,calc(100dvh-2rem))] w-full max-w-md overflow-y-auto rounded-2xl border border-border no-scrollbar bg-card p-5 shadow-card"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="size-10 text-primary" />
                <h3 className="mt-3 text-lg font-bold text-foreground">Booking received!</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We&apos;ve emailed our team your details. We&apos;ll be in touch shortly to confirm.
                </p>
                <Button size="lg" className="mt-5 w-full" onClick={resetAndClose}>
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    className="rounded-md border border-primary p-1 text-primary hover:bg-primary/10"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-1.5 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                  {summary.map((line) => (
                    <div key={line.label} className="flex justify-between gap-3">
                      <span className="text-muted-foreground">{line.label}</span>
                      <span className="truncate font-medium text-foreground">{line.value}</span>
                    </div>
                  ))}
                  {totalText && (
                    <div className="flex justify-between gap-3 border-t border-border pt-1.5 font-semibold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">{totalText}</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Full name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7307 093007"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Anything else we should know?"
                      className={fieldClass}
                    />
                  </div>

                  {status === "error" && <p className="text-sm text-destructive">{errorMessage}</p>}

                  <Button type="submit" size="lg" disabled={!isValid || status === "submitting"} className="mt-1 w-full">
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
