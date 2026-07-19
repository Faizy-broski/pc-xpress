import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CtaAction {
  label: string;
  href: string;
}

interface CtaButtonGroupProps {
  primary: CtaAction;
  secondary?: CtaAction;
  size?: "default" | "lg";
  className?: string;
  /** Style the secondary button for use on a dark background. */
  onDark?: boolean;
}

export function CtaButtonGroup({
  primary,
  secondary,
  size = "lg",
  className,
  onDark = false,
}: CtaButtonGroupProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <Button
        size={size}
        className="rounded text-lg p-8"
        nativeButton={false}
        render={<Link href={primary.href} />}
      >
        {primary.label}
        <ArrowRight />
      </Button>
      {secondary && (
        <Button
          size={size}
          variant="outline"
          nativeButton={false}
          render={<Link href={secondary.href} />}
          className={cn(
            "rounded text-lg p-8 w-50",
            onDark &&
              "border-white/20 bg-transparent backdrop-blur-xl text-white hover:bg-white/10 hover:text-white"
          )}
        >
          {secondary.label}
          <ArrowRight />
        </Button>
      )}
    </div>
  );
}
