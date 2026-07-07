"use client";

import { useState } from "react";
import {
  Gauge,
  TrendingUp,
  Users,
  Radio,
  Share2,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV } from "./data";

const ICONS: Record<string, LucideIcon> = {
  overview: Gauge,
  revenue: TrendingUp,
  cohorts: Users,
  realtime: Radio,
  sources: Share2,
  settings: SlidersHorizontal,
};

export function Sidebar() {
  const [active, setActive] = useState("overview");

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-full flex-col border-r border-line bg-ink"
    >
      {/* wordmark */}
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-4">
        <span className="flex h-6 w-6 items-center justify-center bg-acid">
          <span className="h-2.5 w-2.5 bg-ink" />
        </span>
        <div className="leading-none">
          <div className="font-display text-lg tracking-tight text-paper">
            HELM
          </div>
          <div className="label mt-1 text-[9px] text-dim">EDGE OBSERVABILITY</div>
        </div>
      </div>

      {/* nav items */}
      <ul className="flex flex-col py-2">
        {NAV.map((item) => {
          const Icon = ICONS[item.id];
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex w-full items-center gap-3 px-4 py-2.5 text-left outline-none transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:bg-coal",
                  isActive
                    ? "bg-coal text-paper"
                    : "text-ash hover:bg-coal/60 hover:text-bone"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-acid" />
                )}
                <Icon
                  size={15}
                  strokeWidth={1.75}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-acid" : "text-ash group-hover:text-bone"
                  )}
                />
                <span className="font-mono text-[12px] uppercase tracking-[0.12em]">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "ml-auto font-mono text-[10px] tabular-nums",
                    isActive ? "text-dim" : "text-dim/70"
                  )}
                >
                  {item.code}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* system status footer */}
      <div className="mt-auto border-t border-line px-4 py-3.5">
        <div className="flex items-center justify-between">
          <span className="label text-[9px]">SYSTEM</span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-acid opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-acid" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone">
              NOMINAL
            </span>
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-dim">
          <span>REGION</span>
          <span className="text-ash">14 / 14 UP</span>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-dim">
          <span>BUILD</span>
          <span className="text-ash">v4.2.11 · 6f2a1c</span>
        </div>
      </div>
    </nav>
  );
}
