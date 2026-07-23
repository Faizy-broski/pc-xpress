"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5",
        className
      )}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size === "sm" ? "size-2.5" : "size-3",
            i < Math.round(value) ? "fill-white text-white" : "fill-white/30 text-white/30"
          )}
        />
      ))}
    </span>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${starValue} out of 5`}
            onMouseEnter={() => setHovered(starValue)}
            onClick={() => onChange(starValue)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "size-5 transition-colors",
                starValue <= active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
