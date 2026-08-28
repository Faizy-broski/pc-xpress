import type { ReactNode } from "react";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({ eyebrow, title, updated, intro, sections }: LegalPageProps) {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-brand pt-34 pb-16 md:pt-40 md:pb-20">
        <div className="relative mx-auto max-w-screen-2xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <Badge variant="soft" className="mx-auto bg-white/10 text-white">
              <FileText className="size-3.5" />
              {eyebrow}
            </Badge>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mx-auto mt-3 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">{intro}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 text-xs font-medium text-white/60">
              Last updated: {updated}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-14 text-foreground sm:py-16">
        <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
          <nav className="hidden h-fit flex-col gap-1 rounded border border-border bg-card p-4 lg:sticky lg:top-28 lg:flex">
            <p className="mb-1 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              On this page
            </p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {section.heading}
              </a>
            ))}
          </nav>

          <Reveal className="flex flex-col gap-10">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
