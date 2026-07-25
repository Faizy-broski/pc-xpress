/**
 * LogoOrbit — a below-hero trust section shaped as an orbiting ring instead
 * of a horizontal marquee.
 *
 * Signature idea: logos sit on a slowly rotating disc around a glowing
 * center hub — literally an "infinite loop" rather than a scrolling line.
 * Each pill counter-rotates against the disc so its label stays upright
 * and readable as it travels, the classic orbit-diagram trick done in pure
 * CSS (two synced keyframe animations, no JS runtime, no client component).
 * A dashed ring traces the orbit path so the motion reads as intentional
 * geometry, not drift. Hovering the whole section pauses the orbit so any
 * name can be read at rest; hovering one pill lifts it to full brand red.
 *
 * No external images required — logos are styled wordmarks. Swap in real
 * <img>/<svg> marks inside each pill; positioning math is unaffected.
 */

type Logo = { name: string };

const LOGOS: Logo[] = [
  { name: "Northwind" },
  { name: "VELOX" },
  { name: "Ashgrove" },
  { name: "PRIME LABS" },
  { name: "Solace" },
  { name: "Kestrel & Co" },
  { name: "MERIDIAN" },
  { name: "Cinder" },
];

const ORBIT_DURATION_S = 42;

export function LogoOrbit() {
  const count = LOGOS.length;

  return (
    <section className="logo-orbit group/orbit relative overflow-hidden bg-secondary py-20 sm:py-28">
      {/* brand-gradient seam, echoes the navbar */}
      <div className="bg-gradient-brand absolute inset-x-0 top-0 h-px opacity-80" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6">
        <p className="mb-12 text-center font-mono text-xs font-medium tracking-[0.25em] text-secondary-foreground/50 sm:mb-16">
          TRUSTED BY TEAMS BUILDING AT SPEED
        </p>

        <div
          className="relative aspect-square w-[min(88vw,560px)]"
          style={
            {
              ["--orbit-duration" as string]: `${ORBIT_DURATION_S}s`,
            } as React.CSSProperties
          }
        >
          {/* ambient glow behind everything */}
          <div className="bg-gradient-hero pointer-events-none absolute -inset-16 opacity-30" />

          {/* dashed orbit path */}
          <div className="absolute inset-[6%] rounded-full border border-dashed border-sidebar-border/60" />

          {/* center hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-button shadow-glow flex h-24 w-24 flex-col items-center justify-center rounded-full text-center sm:h-28 sm:w-28">
              <span className="font-sans text-[0.6rem] font-black uppercase leading-tight tracking-wider text-primary-foreground">
                Trusted
                <br />
                Circle
              </span>
            </div>
          </div>

          {/* rotating disc holding every logo */}
          <div className="orbit-disc absolute inset-0">
            {LOGOS.map((logo, i) => {
              const angle = (i / count) * 360;
              const rad = (angle * Math.PI) / 180;
              const radius = 44; // percent from center
              const x = 50 + radius * Math.cos(rad);
              const y = 50 + radius * Math.sin(rad);

              return (
                <div
                  key={logo.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="orbit-item-inner">
                    <span
                      className={[
                        "block select-none whitespace-nowrap rounded-full border px-4 py-2",
                        "border-border bg-card font-sans text-xs font-black uppercase tracking-tight sm:text-sm",
                        "text-muted-foreground/70 shadow-card grayscale",
                        "transition-all duration-300 ease-out",
                        "hover:border-primary/40 hover:text-primary hover:grayscale-0",
                        "hover:shadow-glow",
                      ].join(" ")}
                    >
                      {logo.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-brand absolute inset-x-0 bottom-0 h-px opacity-80" />

      <style>{`
        .orbit-disc {
          animation: orbit-cw var(--orbit-duration) linear infinite;
        }
        .orbit-item-inner {
          animation: orbit-ccw var(--orbit-duration) linear infinite;
        }
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .logo-orbit:hover .orbit-disc,
        .logo-orbit:hover .orbit-item-inner {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-disc,
          .orbit-item-inner {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default LogoOrbit;