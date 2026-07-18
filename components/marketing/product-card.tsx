"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface ProductCardData {
  href: string;
  imageSrc?: string;
  imageAlt: string;
  os: string;
  title: string;
  specs: string[];
  rating: number;
  reviewCount: number;
  price: string;
  priceExVat: string;
  wasPrice?: string;
  dispatchDate: string;
}

export function ProductCard({
  href,
  imageSrc,
  imageAlt,
  os,
  title,
  specs,
  rating,
  reviewCount,
  price,
  priceExVat,
  wasPrice,
  dispatchDate,
  className,
}: ProductCardData & { className?: string }) {
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border border-border bg-card shadow-card transition-shadow rounded-sm",
        className
      )}
    >
      {wasPrice && (
        <Badge className="absolute left-4 top-4 z-10 bg-primary text-primary-foreground shadow-glow">
          Save {computeSaving(wasPrice, price)}
        </Badge>
      )}

      <motion.div
        variants={{ rest: { y: 0 }, hover: { y: -6 } }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative aspect-video w-full overflow-hidden bg-muted"
      >
        {imageSrc ? (
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative h-full w-full"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-6"
            />
          </motion.div>
        ) : (
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex h-full w-full items-center justify-center"
          >
            <span className="flex size-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Cpu className="size-10" />
            </span>
          </motion.div>
        )}

        <motion.div
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent"
        />
      </motion.div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-muted-foreground">{os}</span>

        <h3 className="text-base font-semibold leading-snug text-foreground">
          {title}
        </h3>

        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {specs.map((spec) => (
            <li key={spec} className="flex items-start gap-1.5">
              <span
                className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60"
                aria-hidden
              />
              <span>{spec}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-2.5",
                  i < rating
                    ? "fill-white text-white"
                    : "fill-white/30 text-white/30"
                )}
              />
            ))}
          </span>
          <Link
            href="#reviews"
            className="text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
          >
            {reviewCount} Reviews
          </Link>
        </div>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Link
              href={href}
              className="group/shop inline-flex items-center gap-1.5 rounded bg-gradient-button px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-[filter] hover:brightness-110"
            >
              Shop
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/shop:translate-x-1" />
            </Link>
          </motion.div>

          <div className="flex flex-col leading-tight">
            <span className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-primary">{price}</span>
              {wasPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {wasPrice}
                </span>
              )}
            </span>
            <span className="text-[0.7rem] text-muted-foreground">
              ({priceExVat} ex. VAT)
            </span>
          </div>
        </div>

        <p className="text-[0.7rem] text-muted-foreground">
          Estimated dispatch date: {dispatchDate}
        </p>
      </div>
    </motion.div>
  );
}

function computeSaving(was: string, now: string) {
  const toNum = (v: string) => Number(v.replace(/[^0-9.]/g, ""));
  const diff = toNum(was) - toNum(now);
  return diff > 0 ? `£${diff.toFixed(0)}` : "";
}
