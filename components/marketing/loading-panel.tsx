import { Cpu } from "lucide-react";

export function LoadingPanel() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
        <span className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-button text-primary-foreground shadow-glow">
          <Cpu className="size-8 animate-pulse" />
        </span>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <p className="text-sm font-medium text-foreground">
          Booting up PC Xpress&hellip;
        </p>
        <div className="h-1 w-36 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-button" />
        </div>
      </div>
    </div>
  );
}
