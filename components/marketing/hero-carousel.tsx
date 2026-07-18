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
}

const AUTOPLAY_DELAY = 4000;

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
          {slides.map((slide, index) => (
            <div key={slide.heading} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0" />

              <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
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
                  className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-8xl"
                />

                <Reveal delay={0.25}>
                  <p className="mt-6 max-w-xl text-base text-white/70 sm:text-xl">
                    {slide.description}
                  </p>
                </Reveal>

                <Reveal delay={0.35}>
                  <CtaButtonGroup
                    className="mt-10"
                    onDark
                    primary={slide.primary}
                    secondary={slide.secondary}
                  />
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-4 flex items-center gap-4 sm:bottom-10 sm:left-auto sm:right-8 lg:right-12">
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
          <span className="text-sm font-medium tabular-nums text-white/80">
            {String(selectedIndex + 1).padStart(2, "0")}
            <span className="text-white/40">
              {" "}
              / {String(slides.length).padStart(2, "0")}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
