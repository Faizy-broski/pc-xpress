"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-card">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={images[active]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative h-full w-full"
            >
              <Image
                src={images[active]}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent to-muted">
            <span className="flex size-28 items-center justify-center rounded-3xl bg-accent text-accent-foreground shadow-glow">
              <Cpu className="size-14" />
            </span>
          </div>
        )}
      </div>

      {hasImages && images.length > 1 && (
        <div className="flex gap-2.5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${name}`}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border transition-colors",
                index === active
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
