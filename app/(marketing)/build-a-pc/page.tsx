"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Diagram } from "@/components/build-a-pc/diagram";
import { CategoryGrid } from "@/components/build-a-pc/category-grid";
import { BuildSummary } from "@/components/build-a-pc/build-summary";
import { PartSelectModal } from "@/components/build-a-pc/part-select-modal";
import { CATEGORIES, type CategoryId, type PartOption } from "@/components/build-a-pc/data";

export default function BuildAPc() {
  const [selections, setSelections] = useState<Partial<Record<CategoryId, PartOption>>>({});
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory) ?? null;

  function chooseOption(categoryId: CategoryId, option: PartOption) {
    setSelections((prev) => ({ ...prev, [categoryId]: option }));
  }

  function removeOption(categoryId: CategoryId) {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  }

  return (
    <div>
      <section className="relative overflow-hidden py-14 md:pt-40 md:pb-20">
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <Badge variant="soft" className="mx-auto bg-white/10 text-white">
              <Sparkles className="size-3.5" />
              Custom PC Builder
            </Badge>
          </Reveal>

          <TextReveal
            as="h1"
            text="Click to customize your build"
            delay={0.1}
            className="mx-auto mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-4xl"
          />

          <Reveal delay={0.25}>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
              Click any part on the diagram — or a category below — to choose
              your components. We&apos;ll handle compatibility, assembly, and
              testing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="dark bg-background py-8 text-foreground sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <Reveal>
                <div className="rounded-2xl border border-white/10 bg-white/2 p-4 shadow-card">
                  <Diagram
                    categories={CATEGORIES}
                    selections={selections}
                    onSelect={setActiveCategory}
                  />
                </div>
              </Reveal>

              <div className="mt-4">
                <CategoryGrid
                  categories={CATEGORIES}
                  selections={selections}
                  onSelect={setActiveCategory}
                />
              </div>
            </div>

            <BuildSummary
              categories={CATEGORIES}
              selections={selections}
              onRemove={removeOption}
            />
          </div>
        </div>
      </section>

      <PartSelectModal
        category={activeCategoryData}
        selected={activeCategoryData ? (selections[activeCategoryData.id] ?? null) : null}
        onSelect={(option) => activeCategoryData && chooseOption(activeCategoryData.id, option)}
        onRemove={() => activeCategoryData && removeOption(activeCategoryData.id)}
        onClose={() => setActiveCategory(null)}
      />
    </div>
  );
}
