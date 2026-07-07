"use client";

import { DISPLAY, MONO } from "./ui";

const NAV = ["Model", "Performance", "Design", "Range", "Reserve"];

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-16 items-center justify-between border-b border-line/70 bg-void/55 px-6 backdrop-blur-md md:px-10">
        {/* Wordmark */}
        <a
          href="#top"
          className={`${DISPLAY} text-[19px] font-semibold uppercase leading-none tracking-[0.42em] text-paper`}
        >
          APEX
        </a>

        {/* Nav */}
        <nav
          className={`${MONO} hidden items-center gap-9 text-[11px] uppercase tracking-[0.22em] text-ash md:flex`}
        >
          {NAV.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="transition-colors duration-300 hover:text-paper"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#reserve"
          className={`${MONO} group inline-flex items-center gap-2 border border-[#ffb800]/60 bg-[#ffb800]/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#ffb800] transition-colors duration-300 hover:bg-[#ffb800] hover:text-black`}
        >
          Reserve
          <span className="text-[#ffb800]/70 transition-colors group-hover:text-black">
            $1,000
          </span>
        </a>
      </div>
    </header>
  );
}
