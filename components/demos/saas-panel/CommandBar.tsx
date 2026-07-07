"use client";

import { useState } from "react";
import { Search, ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Env = "PRODUCTION" | "STAGING";
const RANGES = ["LAST 24H", "LAST 7D", "LAST 30D", "LAST 90D"];

export function CommandBar() {
  const [env, setEnv] = useState<Env>("PRODUCTION");
  const [rangeIdx, setRangeIdx] = useState(2);

  return (
    <header className="flex items-center gap-3 border-b border-line bg-ink px-3 py-2.5 sm:px-4">
      {/* search */}
      <label className="group flex min-w-0 flex-1 items-center gap-2 border border-line bg-void px-3 py-2 transition-colors focus-within:border-ash sm:max-w-sm">
        <Search size={14} strokeWidth={1.75} className="shrink-0 text-dim" />
        <input
          type="text"
          placeholder="SEARCH METRICS · ⌘K"
          aria-label="Search metrics"
          className="min-w-0 flex-1 bg-transparent font-mono text-[12px] uppercase tracking-[0.08em] text-bone placeholder:text-dim focus:outline-none"
        />
      </label>

      {/* environment switcher */}
      <div className="hidden items-stretch border border-line md:flex" role="group" aria-label="Environment">
        {(["PRODUCTION", "STAGING"] as Env[]).map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEnv(e)}
            aria-pressed={env === e}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] outline-none transition-colors duration-200 focus-visible:text-paper",
              env === e ? "bg-coal text-paper" : "text-dim hover:text-ash"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5",
                e === "PRODUCTION" ? "bg-acid" : "bg-ash",
                env !== e && "opacity-40"
              )}
            />
            {e}
          </button>
        ))}
      </div>

      {/* date range */}
      <button
        type="button"
        onClick={() => setRangeIdx((i) => (i + 1) % RANGES.length)}
        className="hidden items-center gap-2 border border-line bg-void px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone outline-none transition-colors duration-200 hover:border-ash focus-visible:border-ash sm:flex"
      >
        <Calendar size={13} strokeWidth={1.75} className="text-dim" />
        <span className="tabular-nums">{RANGES[rangeIdx]}</span>
        <ChevronDown size={13} strokeWidth={1.75} className="text-dim" />
      </button>

      {/* avatar */}
      <button
        type="button"
        aria-label="Account — Erin Aydemir"
        className="flex items-center gap-2 border border-line bg-void py-1 pl-1 pr-2.5 outline-none transition-colors hover:border-ash focus-visible:border-ash"
      >
        <img
          src="https://i.pravatar.cc/80?img=13"
          alt="Erin Aydemir"
          width={26}
          height={26}
          className="h-[26px] w-[26px] object-cover grayscale"
        />
        <span className="hidden text-left leading-tight lg:block">
          <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-bone">
            E. AYDEMIR
          </span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
            ADMIN · ORG-04
          </span>
        </span>
      </button>
    </header>
  );
}
