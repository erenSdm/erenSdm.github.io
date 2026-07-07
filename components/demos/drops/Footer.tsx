"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Label, MAGENTA } from "./ui";
import { SIZE_RUN } from "./data";

const STATE_STYLE = {
  in: "border-line text-paper",
  low: "text-ink",
  out: "border-line text-dim line-through",
} as const;

function SizeRunStrip() {
  return (
    <div className="border-b border-line px-5 py-6 md:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Label accent>Voltage Runner</Label>
          <Label>Size availability · EU</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {SIZE_RUN.map((s) => (
            <span
              key={s.size}
              className={[
                "flex min-w-12 items-center justify-center border px-2 py-2 font-[family-name:var(--font-cad-mono)] text-[12px] tabular-nums",
                STATE_STYLE[s.state],
              ].join(" ")}
              style={s.state === "low" ? { background: MAGENTA, borderColor: "transparent" } : undefined}
            >
              {s.size}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.14em] text-ash">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 border border-line" /> In stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2" style={{ background: MAGENTA }} /> Low
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 border border-line bg-transparent" /> Sold out
        </span>
      </div>
    </div>
  );
}

const SOCIALS = ["Instagram", "TikTok", "X / Twitter", "Discord"];
const FOOTER_NAV = [
  ["Shop", ["New arrivals", "Footwear", "Apparel", "Accessories"]],
  ["Support", ["Shipping", "Returns", "Size guide", "Track order"]],
  ["Studio", ["About Cadence", "Stores", "Careers", "Press"]],
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-void">
      <SizeRunStrip />

      {/* newsletter */}
      <div className="grid grid-cols-1 border-b border-line lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-line px-5 py-10 md:px-10 lg:border-b-0 lg:border-r">
          <Label accent>Get on the list</Label>
          <h2 className="mt-3 font-[family-name:var(--font-cad-display)] text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.82] text-paper">
            Never miss<br />a drop
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-7 flex max-w-lg border border-line"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 font-[family-name:var(--font-cad-mono)] text-[13px] text-paper placeholder:text-dim focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex items-center gap-2 px-5 font-[family-name:var(--font-cad-mono)] text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
              style={{ background: MAGENTA }}
            >
              Notify
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>
          <p className="mt-3 font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.14em] text-ash">
            Drop alerts only. No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* nav columns */}
        <div className="grid grid-cols-2 gap-y-8 px-5 py-10 sm:grid-cols-3 md:px-10">
          {FOOTER_NAV.map(([title, items]) => (
            <div key={title}>
              <Label>{title}</Label>
              <ul className="mt-4 space-y-2.5">
                {items.map((it) => (
                  <li key={it}>
                    <a
                      href="#"
                      className="font-[family-name:var(--font-cad-grotesk)] text-[13px] text-bone transition-colors hover:text-paper"
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* bottom bar */}
      <div className="flex flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-[family-name:var(--font-cad-display)] text-[1.8rem] leading-none text-paper">
            CADENCE
          </span>
          <span className="font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.16em] text-ash">
            © 2026 · Berlin
          </span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#"
              className="font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:text-paper"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
