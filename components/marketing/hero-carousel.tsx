"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { CtaButtonGroup } from "@/components/marketing/cta-button-group";

interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  imageSrc: string;
  imageAlt: string;
  badge: string;
  heading: string;
  description: string;
  primary: HeroCta;
  secondary?: HeroCta;
  /** Which side of the image the copy should sit on. Defaults to "left". */
  contentAlign?: "left" | "right";
}

const AUTOPLAY_DELAY = 5000;

export function HeroCarousel({
  slides,
  className,
}: {
  slides: HeroSlide[];
  className?: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    if (!emblaApi || slides.length < 2) return;
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_DELAY);
  }, [emblaApi, slides.length, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => {
            const alignRight = slide.contentAlign === "right";
            return (
              <div key={slide.heading} className="relative min-w-0 flex-[0_0_100%]">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className="object-cover"
                />

                <div
                  className={cn(
                    "relative mx-auto flex h-full max-w-screen-2xl flex-col justify-center px-4 pt-16 pb-4 sm:px-6 sm:pt-20 sm:pb-32 md:pt-40 md:pb-20 lg:px-8",
                    alignRight && "items-end text-right"
                  )}
                >
                  <Reveal>
                    <Badge variant="soft" className="bg-white/10 text-white">
                      <Sparkles />
                      {slide.badge}
                    </Badge>
                  </Reveal>

                  <TextReveal
                    as="h1"
                    text={slide.heading}
                    delay={0.1}
                    className="mt-4 max-w-xs text-2xl font-bold tracking-tight text-white sm:max-w-sm sm:text-4xl lg:max-w-xl lg:text-5xl"
                  />

                  <Reveal delay={0.25}>
                    <p
                      className={cn(
                        "mt-4 max-w-lg text-sm text-white/70 sm:text-base",
                        alignRight && "ml-auto"
                      )}
                    >
                      {slide.description}
                    </p>
                  </Reveal>

                  <Reveal delay={0.35}>
                    <CtaButtonGroup
                      className={cn("mt-6", alignRight && "justify-end")}
                      onDark
                      primary={slide.primary}
                      secondary={slide.secondary}
                    />
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 sm:bottom-10 sm:left-auto sm:right-8 sm:justify-start lg:right-12">
          <div className="flex items-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.heading}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-1 rounded-full bg-white/30 transition-all duration-300",
                  index === selectedIndex ? "w-8 bg-white" : "w-4"
                )}
              />
            ))}
          </div>
          <span className="text-xl font-medium tabular-nums text-white/80 sm:text-2xl md:text-4xl">
            {String(selectedIndex + 1).padStart(2, "0")}
            <span className="text-white/40 text-xs sm:text-sm">
              {" "}
             <span className="text-base sm:text-2xl">/</span>
              {String(slides.length).padStart(2, "0")}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
