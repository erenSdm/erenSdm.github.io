"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart";
import { Marquee, MAGENTA } from "./ui";
import { TICKER } from "./data";

const NAV = ["New", "Drops", "Apparel", "Footwear", "Lookbook"];

export function TopBar() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-50">
      {/* announcement ticker */}
      <div
        className="border-b border-black/20 py-2 font-[family-name:var(--font-cad-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-ink"
        style={{ background: MAGENTA }}
      >
        <Marquee items={TICKER} sep="//" duration="30s" />
      </div>

      {/* main bar */}
      <div className="border-b border-line bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-5 md:px-8">
          {/* wordmark */}
          <a
            href="#top"
            className="flex items-baseline gap-2 font-[family-name:var(--font-cad-display)] text-[1.9rem] leading-none tracking-[0.02em] text-paper"
          >
            CADENCE
            <span
              className="hidden h-2 w-2 sm:inline-block"
              style={{ background: MAGENTA }}
              aria-hidden
            />
          </a>

          {/* nav */}
          <nav className="ml-4 hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a
                key={n}
                href="#"
                className="group relative font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:text-paper"
              >
                {n}
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ background: MAGENTA }}
                  aria-hidden
                />
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.2em] text-ash md:flex">
              <span
                className="inline-block h-1.5 w-1.5 animate-blink rounded-full"
                style={{ background: MAGENTA }}
                aria-hidden
              />
              Live
            </span>

            {/* cart */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open cart, ${count} items`}
              className="group flex items-center gap-2 border border-line bg-coal px-3 py-2 font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Cart</span>
              <span
                className="flex h-5 min-w-5 items-center justify-center px-1 text-[11px] font-bold text-ink tabular-nums"
                style={{ background: MAGENTA }}
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
