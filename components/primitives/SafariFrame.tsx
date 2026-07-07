import { ChevronLeft, ChevronRight, Lock, Plus, Share, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafariFrameProps {
  /** domain shown centered in the address bar, e.g. "vanta.studio" */
  url: string;
  accent?: string;
  /** raised/brightened chrome when this window is the focused one */
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * A faithful macOS Safari window (dark appearance): traffic lights, nav
 * chevrons, a centered address pill with a lock, and toolbar actions. Reads as
 * a real browser window floating on the page rather than a flat screenshot.
 */
export function SafariFrame({
  url,
  accent = "#8b5cff",
  active = false,
  children,
  className,
}: SafariFrameProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-[#202022] transition-[border-color,box-shadow] duration-500",
        active ? "border-white/15" : "border-white/[0.06]",
        className
      )}
      style={{
        boxShadow: active
          ? `0 40px 80px -32px rgba(0,0,0,0.85), 0 0 0 1px ${accent}22, 0 0 46px -14px ${accent}40`
          : "0 24px 50px -30px rgba(0,0,0,0.8)",
      }}
    >
      {/* toolbar */}
      <div
        className={cn(
          "relative flex h-9 shrink-0 items-center gap-3 border-b border-black/50 px-3 transition-colors duration-500",
          active ? "bg-[#333336]" : "bg-[#2a2a2c]"
        )}
      >
        {/* traffic lights */}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        {/* nav arrows */}
        <div className="hidden items-center gap-1.5 text-white/25 sm:flex">
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </div>

        {/* address bar */}
        <div className="mx-auto flex h-6 w-[58%] max-w-[280px] items-center justify-center gap-1.5 rounded-md bg-[#48484b] px-3">
          <Lock className="h-3 w-3 text-white/45" strokeWidth={2.5} />
          <span className="truncate text-[11px] font-medium tracking-tight text-white/75">
            {url}
          </span>
          <RotateCw className="ml-0.5 hidden h-3 w-3 text-white/35 sm:block" strokeWidth={2.5} />
        </div>

        {/* actions */}
        <div className="hidden items-center gap-3 text-white/25 sm:flex">
          <Share className="h-4 w-4" strokeWidth={2.25} />
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>

      {/* viewport */}
      <div className="relative flex-1 overflow-hidden bg-black">{children}</div>
    </div>
  );
}
