"use client";

import { useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const textareaClass =
  "w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-3 focus-visible:ring-white/20";

interface LeadGenFormProps {
  className?: string;
}

export function LeadGenForm({ className }: LeadGenFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not submit your details.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-md border border-white/15 bg-black/40 p-4 shadow-card backdrop-blur-md sm:p-5",
        className
      )}
    >
      {submitted ? (
        <>
          <h3 className="text-base font-bold text-white">Thanks!</h3>
          <p className="mt-2 text-sm text-white/70">
            We&apos;ve got your details and will be in touch shortly.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-bold text-white">Get a free quote</h3>
          <p className="mt-1 text-xs text-white/60">
            Leave your details and our team will call you back.
          </p>
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2.5">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20 rounded"
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20 rounded"
            />
            <Input
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20 rounded"
            />
            <textarea
              placeholder="What do you need help with? (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className={textareaClass}
            />

            {error && <p className="text-sm text-red-300">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-1 rounded bg-gradient-button shadow-glow"
            >
              {submitting ? "Submitting…" : "Request a callback"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
