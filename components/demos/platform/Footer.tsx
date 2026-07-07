"use client";

import { ArrowRight } from "lucide-react";
import { mono, Reveal, sans } from "./primitives";

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Product",
    links: ["Edge runtime", "Vector store", "Observability", "Changelog", "Status"],
  },
  {
    title: "Developers",
    links: ["Docs", "API reference", "SDK", "Examples", "CLI"],
  },
  {
    title: "Resources",
    links: ["Blog", "Benchmarks", "Guides", "Community", "Support"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Security", "Privacy", "Terms"],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#050505]">
      {/* final CTA */}
      <div className="border-b border-line">
        <div className="relative mx-auto max-w-[1220px] px-5 py-20 sm:px-8 lg:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, rgba(34,211,238,0.10), transparent 65%)",
            }}
          />
          <Reveal className="relative text-center">
            <h2
              className={`${sans} mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.0] tracking-[-0.03em] text-paper`}
            >
              Deploy your first edge function
              <br className="hidden sm:block" /> in the next five minutes.
            </h2>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                className={`${sans} group inline-flex items-center gap-1.5 rounded-lg bg-[#22d3ee] px-6 py-3 text-[14px] font-semibold text-[#04141a] shadow-[0_10px_30px_-10px_rgba(34,211,238,0.7)] transition-transform hover:-translate-y-px`}
              >
                Start deploying
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
              <code
                className={`${mono} rounded-lg border border-line bg-[#0a0a0b] px-4 py-3 text-[13px] text-bone`}
              >
                <span className="mr-2 text-[#22d3ee]">$</span>npx create-cobalt@latest
              </code>
            </div>
          </Reveal>
        </div>
      </div>

      {/* link columns */}
      <div className="mx-auto max-w-[1220px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 1.5 3 6.5v11L12 22.5l9-5v-11L12 1.5Z"
                  stroke="#22d3ee"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6 7.5 8.5v5L12 16l4.5-2.5v-5L12 6Z"
                  fill="#22d3ee"
                  fillOpacity="0.14"
                />
              </svg>
              <span
                className={`${sans} text-[14px] font-bold tracking-[0.14em] text-paper`}
              >
                COBALT
              </span>
            </div>
            <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-ash">
              The edge platform for developers who ship. Built for latency,
              measured in milliseconds.
            </p>
            {/* status badge */}
            <a
              href="#"
              className={`${mono} mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-[#0a0a0b] px-3 py-1.5 text-[11px] text-bone transition-colors hover:border-[#86efac]/40`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#86efac] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#86efac]" />
              </span>
              All systems operational
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4
                className={`${mono} text-[11px] uppercase tracking-[0.18em] text-dim`}
              >
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className={`${sans} text-[13.5px] text-ash transition-colors hover:text-paper`}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-7 sm:flex-row sm:items-center">
          <span className={`${mono} text-[11px] text-dim`}>
            © 2026 Cobalt, Inc. · SOC 2 Type II · ISO 27001
          </span>
          <div className="flex items-center gap-5">
            {["GitHub", "X", "Discord", "npm"].map((s) => (
              <a
                key={s}
                href="#"
                className={`${mono} text-[11px] text-ash transition-colors hover:text-[#22d3ee]`}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
