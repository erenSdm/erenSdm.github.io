import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  url: string;
  accent?: string;
  children: React.ReactNode;
  className?: string;
  /** shrink inner content to fake a full page at small scale */
  bodyClassName?: string;
}

/**
 * A hard-edged browser chrome. No border-radius, mono URL bar — reads like a
 * captured terminal screenshot rather than a glossy macOS window.
 */
export function BrowserFrame({
  url,
  accent = "#8b5cff",
  children,
  className,
  bodyClassName,
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden border-2 border-line bg-coal",
        className
      )}
    >
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-ink px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 border border-dim" />
          <span className="h-2.5 w-2.5 border border-dim" />
          <span
            className="h-2.5 w-2.5"
            style={{ backgroundColor: accent }}
          />
        </div>
        <div className="flex flex-1 items-center gap-2 border border-line bg-void px-3 py-1">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <span className="truncate font-mono text-[11px] tracking-wide text-ash">
            {url}
          </span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-dim sm:block">
          LIVE
        </span>
      </div>
      {/* viewport */}
      <div className={cn("relative flex-1 overflow-hidden bg-ink", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
