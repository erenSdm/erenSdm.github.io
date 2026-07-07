"use client";

import { Star, ChevronRight } from "lucide-react";
import { mono, sans } from "./primitives";

const LINKS = ["Product", "Docs", "Pricing", "Changelog", "Blog"];

function Wordmark() {
  return (
    <a href="#" className="flex items-center gap-2.5" aria-label="COBALT home">
      {/* faceted cobalt mark */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 1.5 3 6.5v11L12 22.5l9-5v-11L12 1.5Z" stroke="#22d3ee" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M12 1.5v21M3 6.5l9 5 9-5M12 11.5v11" stroke="#22d3ee" strokeWidth="1.1" strokeLinejoin="round" opacity="0.55" />
        <path d="M12 6 7.5 8.5v5L12 16l4.5-2.5v-5L12 6Z" fill="#22d3ee" fillOpacity="0.14" />
      </svg>
      <span className={`${sans} text-[15px] font-bold tracking-[0.14em] text-paper`}>
        COBALT
      </span>
    </a>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[#050505]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1220px] items-center justify-between gap-6 px-5 sm:px-8">
        {/* left */}
        <div className="flex items-center gap-8">
          <Wordmark />
          <nav className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className={`${sans} text-[13px] text-bone transition-colors hover:text-paper`}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          {/* command hint */}
          <button
            type="button"
            className={`${mono} hidden items-center gap-2 rounded-lg border border-line bg-[#0c0c0e] px-2.5 py-1.5 text-[11px] text-ash transition-colors hover:border-line-soft hover:text-bone md:inline-flex`}
          >
            <span>Search</span>
            <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-dim">
              ⌘K
            </kbd>
          </button>

          {/* github star pill */}
          <a
            href="#"
            className={`${mono} hidden items-center gap-2 rounded-lg border border-line bg-[#0c0c0e] px-3 py-1.5 text-[12px] text-bone transition-colors hover:border-line-soft hover:text-paper sm:inline-flex`}
          >
            <Star size={13} strokeWidth={2} className="text-[#22d3ee]" />
            <span>12.4k</span>
          </a>

          {/* primary CTA */}
          <a
            href="#"
            className={`${sans} group inline-flex items-center gap-1 rounded-lg bg-[#22d3ee] px-3.5 py-2 text-[13px] font-semibold text-[#04141a] shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_8px_24px_-8px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-px`}
          >
            Start deploying
            <ChevronRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
