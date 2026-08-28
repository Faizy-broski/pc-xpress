"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "w-full rounded border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isValid = name.trim().length > 0 && EMAIL_RE.test(email) && message.trim().length > 0;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h3 className="mt-3 text-lg font-bold text-foreground">Message sent!</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
        <Button size="lg" className="mt-5 w-full" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className={fieldClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <input
        type="tel"
        name="phone"
        placeholder="Phone number (optional)"
        className={fieldClass}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        name="subject"
        placeholder="Device & issue (e.g. iPhone 14 — cracked screen)"
        className={fieldClass}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        name="message"
        rows={5}
        placeholder="Tell us more..."
        className={cn(fieldClass, "resize-none")}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      {status === "error" && <p className="text-sm text-destructive">{errorMessage}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={!isValid || status === "submitting"}
        className="mt-2 w-full rounded"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <ArrowRight />
          </>
        )}
      </Button>
    </form>
  );
}
