"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { TextReveal } from "@/components/motion/text-reveal";
import { ProductCard, type ProductCardData } from "@/components/marketing/product-card";

const AUTOPLAY_DELAY = 5000;
const EASE = [0.22, 1, 0.36, 1] as const;

export interface FeaturedProductsProps {
  heading: string;
  products: ProductCardData[];
  className?: string;
}

export function FeaturedProducts({
  heading,
  products,
  className,
}: FeaturedProductsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!emblaApi || products.length < 2) return;
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_DELAY);
  }, [emblaApi, products.length, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className={cn("py-12 sm:py-16 max-w-6xl mx-auto px-4", className)}>
      <div
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        {/* Colored promo panel — only tall enough for the heading + top half of the cards */}
        <div className="relative overflow-hidden rounded bg-gradient-brand px-6 pt-10 pb-32 sm:px-10 sm:pt-12 sm:pb-40 lg:pb-60">
          <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-60" />

          <div className="relative mx-auto max-w-5xl">
            <TextReveal
              as="h2"
              text={heading}
              className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"
            />
          </div>
        </div>

        {/* Cards pulled up so their top half overlaps the panel and the bottom half sits on the page bg */}
        <div className="relative mx-auto -mt-28 max-w-5xl px-6 sm:-mt-34 sm:px-10 lg:-mt-52">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product, index) => (
                <motion.div
                  key={product.title + index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
                  className="min-w-0 flex-[0_0_100%] px-2 py-2 sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%]"
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          </div>

          {products.length > 1 && (
            <>
              <NavButton
                direction="prev"
                disabled={!canPrev}
                onClick={() => scrollTo(selectedIndex - 1)}
                className="top-1/4 left-2 -translate-y-1/2 sm:-left-5"
              />
              <NavButton
                direction="next"
                disabled={!canNext}
                onClick={() => scrollTo(selectedIndex + 1)}
                className="top-1/4 right-2 -translate-y-1/2 sm:-right-5"
              />
            </>
          )}
        </div>
      </div>

      {/* Pagination dots — sit on the page background, below the panel */}
      {products.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {products.map((product, index) => (
            <button
              key={product.title + index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full bg-border transition-all duration-300",
                index === selectedIndex ? "w-8 bg-gradient-brand" : "w-2.5"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      type="button"
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.2, ease: EASE }}
      className={cn(
        "absolute z-10 flex size-11 items-center justify-center rounded-full bg-white text-foreground shadow-glow transition-colors hover:bg-white/90 disabled:opacity-40 disabled:hover:bg-white",
        className
      )}
    >
      <Icon className="size-5" />
    </motion.button>
  );
}