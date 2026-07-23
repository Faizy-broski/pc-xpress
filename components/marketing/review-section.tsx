"use client";

import { useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating, StarRatingInput } from "@/components/marketing/star-rating";
import type { Review, ReviewCategory } from "@/lib/data/reviews";

const textareaClass =
  "w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

interface ReviewSectionProps {
  category: ReviewCategory;
  /** Fixed on the prebuilt product page (the product slug); omitted for the aggregated Custom Build / Repair feeds. */
  reference?: string;
  referenceLabel?: string;
  reviews: Review[];
  className?: string;
}

export function ReviewSection({
  category,
  reference,
  referenceLabel,
  reviews,
  className,
}: ReviewSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [itemLabel, setItemLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          reference,
          referenceLabel: referenceLabel ?? (itemLabel.trim() || undefined),
          customerName: name,
          customerEmail: email,
          rating,
          comment,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not submit your review.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("grid gap-10 lg:grid-cols-[1.1fr_0.9fr]", className)}>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRating value={average} size="md" />
              <span className="text-sm text-muted-foreground">
                {average.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? "" : "s"})
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to share your experience.
            </p>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} />
                  <span className="text-sm font-semibold text-foreground">{review.customerName}</span>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              {review.referenceLabel && !referenceLabel && (
                <p className="mt-1 text-xs font-medium text-muted-foreground">{review.referenceLabel}</p>
              )}
              <p className="mt-2 text-sm text-foreground/90">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-base font-bold text-foreground">Leave a review</h3>
        {submitted ? (
          <p className="mt-3 text-sm text-primary">
            Thanks for your feedback! It&apos;ll appear here once our team reviews it.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Your rating</label>
              <StarRatingInput value={rating} onChange={setRating} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!referenceLabel && (
              <Input
                placeholder={
                  category === "Repair" ? "What device did we repair?" : "What did we build for you?"
                }
                value={itemLabel}
                onChange={(e) => setItemLabel(e.target.value)}
              />
            )}

            <textarea
              placeholder="Tell us about your experience"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className={textareaClass}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="rounded bg-gradient-button shadow-glow">
              {submitting ? "Submitting…" : "Submit review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
