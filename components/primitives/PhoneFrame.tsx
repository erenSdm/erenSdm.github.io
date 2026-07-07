import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  /** show the status bar row (time / signal / battery) */
  statusBar?: boolean;
  time?: string;
}

/**
 * Realistic modern smartphone shell — titanium rail, black bezel, rounded
 * screen, Dynamic Island, physical side buttons and a glass sheen. The inner
 * screen holds a live mobile demo full-bleed at ~390x844 design resolution.
 */
export function PhoneFrame({
  children,
  accent = "#8b5cff",
  className,
  statusBar = true,
  time = "9:41",
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        // titanium outer rail — thin metallic ring. Height derives from the
        // screen's aspect ratio (below) so the live content fits edge-to-edge.
        // Phones read small on wide desktop viewports, so nudge the cap up from
        // md upward; the sub-md value stays 300px so mobile layout is untouched.
        "relative w-full max-w-[300px] md:max-w-[340px] shrink-0 rounded-[3rem] p-[2px]",
        "bg-[linear-gradient(150deg,#4a4a46_0%,#111_18%,#0a0a0a_50%,#111_82%,#3a3a36_100%)]",
        "shadow-[0_50px_90px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {/* physical side buttons */}
      {/* left: silence + volume up/down */}
      <span className="pointer-events-none absolute -left-[3px] top-[16%] h-6 w-[3px] rounded-l bg-[linear-gradient(180deg,#3a3a36,#1a1a18)]" />
      <span className="pointer-events-none absolute -left-[3px] top-[26%] h-12 w-[3px] rounded-l bg-[linear-gradient(180deg,#3a3a36,#1a1a18)]" />
      <span className="pointer-events-none absolute -left-[3px] top-[40%] h-12 w-[3px] rounded-l bg-[linear-gradient(180deg,#3a3a36,#1a1a18)]" />
      {/* right: power / side button */}
      <span className="pointer-events-none absolute -right-[3px] top-[30%] h-16 w-[3px] rounded-r bg-[linear-gradient(180deg,#3a3a36,#1a1a18)]" />

      {/* black bezel */}
      <div className="relative w-full rounded-[2.85rem] bg-void p-[9px]">
        {/* screen — locks the exact 390:844 design ratio so LivePreview's
            cover-scale fills it with zero horizontal crop */}
        <div className="relative aspect-[390/844] w-full overflow-hidden rounded-[2.2rem] bg-ink">
          {/* full-bleed live content */}
          {children}

          {/* status bar overlay */}
          {statusBar && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-3 font-mono text-[11px] font-semibold tracking-wide text-paper mix-blend-difference">
              <span>{time}</span>
              <span className="flex items-center gap-1.5">
                <span>5G</span>
                <span className="flex h-[9px] w-4 items-center rounded-[2px] border border-current px-[1px]">
                  <span className="h-[5px] w-full rounded-[1px] bg-current" />
                </span>
              </span>
            </div>
          )}

          {/* Dynamic Island */}
          <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 flex h-7 w-[34%] -translate-x-1/2 items-center justify-end gap-2 rounded-full bg-black px-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <span
              className="h-2 w-2 rounded-full ring-1 ring-white/10"
              style={{ backgroundColor: accent, opacity: 0.85 }}
            />
          </div>

          {/* glass sheen */}
          <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.2rem] bg-[linear-gradient(125deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_28%,rgba(255,255,255,0)_72%,rgba(255,255,255,0.04)_100%)]" />

          {/* home indicator */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-2.5">
            <span className="h-1 w-28 rounded-full bg-paper/70 mix-blend-difference" />
          </div>
        </div>
      </div>
    </div>
  );
}