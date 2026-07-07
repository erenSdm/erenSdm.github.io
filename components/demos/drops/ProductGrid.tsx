"use client";

import { Reveal, Label, MAGENTA } from "./ui";
import { ProductCard } from "./ProductCard";
import { PRODUCTS } from "./data";

const FILTERS = ["All", "Footwear", "Apparel", "New", "Under €100"];

export function ProductGrid() {
  return (
    <section id="drops" className="border-b border-line bg-ink">
      {/* section header */}
      <div className="flex flex-col gap-5 border-b border-line px-5 py-6 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <Label accent>The Grid · SS26</Label>
          <h2 className="mt-2 font-[family-name:var(--font-cad-display)] text-[clamp(2.5rem,6vw,5rem)] leading-[0.85] text-paper">
            Shop the drop
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              type="button"
              className={[
                "border px-3 py-2 font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.12em] transition-colors",
                i === 0
                  ? "border-transparent text-ink"
                  : "border-line text-bone hover:border-paper hover:text-paper",
              ].join(" ")}
              style={i === 0 ? { background: MAGENTA } : undefined}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* gapless bento grid */}
      <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.id} className="flex" delay={(i % 4) * 0.05}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      {/* editorial promo band */}
      <div className="flex flex-col items-start justify-between gap-4 border-t border-line bg-paper px-5 py-6 text-ink md:flex-row md:items-center md:px-10">
        <div>
          <Label>Members only</Label>
          <p className="mt-2 font-[family-name:var(--font-cad-display)] text-[clamp(1.8rem,4vw,3rem)] leading-[0.85]">
            Early access · every Friday · 17:00 CET
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.14em] text-paper transition-transform active:scale-95"
        >
          Join Cadence
          <span style={{ color: MAGENTA }}>→</span>
        </button>
      </div>
    </section>
  );
}
