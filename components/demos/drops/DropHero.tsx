"use client";

import { useState } from "react";
import { Zap, Plus } from "lucide-react";
import { useCart } from "./cart";
import { Countdown } from "./Countdown";
import { Marquee, MAGENTA, Label } from "./ui";
import { HERO, HYPE, imgUrl } from "./data";

export function DropHero() {
  const { add } = useCart();
  const [size, setSize] = useState<string | null>("42");
  const soldOut = new Set(HERO.soldSizes);

  const onAdd = () => {
    if (!size) return;
    add({
      id: "voltage-runner",
      name: `${HERO.name.join(" ")}`,
      size,
      price: HERO.price,
      colorway: HERO.colorway,
      seed: HERO.seed,
    });
  };

  return (
    <section
      id="top"
      className="relative grid grid-cols-1 border-b border-line lg:grid-cols-[1.05fr_0.95fr] lg:min-h-[calc(100dvh-6.5rem)]"
    >
      {/* -------- left: the pitch -------- */}
      <div className="relative flex flex-col justify-between gap-8 px-5 py-8 md:px-10 lg:py-10">
        {/* top meta row */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-2 px-2.5 py-1.5 font-[family-name:var(--font-cad-mono)] text-[10px] font-bold uppercase tracking-[0.2em] text-ink"
            style={{ background: MAGENTA }}
          >
            <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
            Drop 026 · Live in
          </span>
          <Label className="hidden sm:block">{HERO.sku}</Label>
        </div>

        {/* giant product name */}
        <div>
          <Label accent>{HERO.drop} / Featured</Label>
          <h1 className="mt-3 font-[family-name:var(--font-cad-display)] leading-[0.82] tracking-[0.005em] text-paper">
            <span className="block text-[clamp(4rem,13vw,10.5rem)]">
              {HERO.name[0]}
            </span>
            <span
              className="block text-[clamp(4rem,13vw,10.5rem)]"
              style={{
                WebkitTextStroke: `2px ${MAGENTA}`,
                color: "transparent",
              }}
            >
              {HERO.name[1]}
            </span>
          </h1>
          <p className="mt-3 max-w-md font-[family-name:var(--font-cad-grotesk)] text-[13px] leading-relaxed text-bone">
            Carbon-plated racer in {HERO.colorway.toLowerCase()}. Built for the
            city sprint — 400 numbered pairs, one per customer, no restock.
          </p>
        </div>

        {/* countdown */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span
              className="inline-block h-1.5 w-1.5 animate-blink rounded-full"
              style={{ background: MAGENTA }}
              aria-hidden
            />
            <Label>Drops Friday 18:00 CET</Label>
          </div>
          <Countdown />
        </div>

        {/* sizes + price + CTA */}
        <div className="mt-auto">
          <div className="mb-4 flex items-end justify-between">
            <Label>Select size · EU</Label>
            <div className="text-right">
              <span className="font-[family-name:var(--font-cad-display)] text-[2.4rem] leading-none text-paper tabular-nums">
                €{HERO.price}
              </span>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {HERO.sizes.map((s) => {
              const dead = soldOut.has(s);
              const active = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={dead}
                  onClick={() => setSize(s)}
                  className={[
                    "min-w-11 border px-3 py-2 font-[family-name:var(--font-cad-mono)] text-[12px] tabular-nums transition-colors",
                    dead
                      ? "cursor-not-allowed border-line bg-transparent text-dim line-through"
                      : active
                        ? "border-transparent text-ink"
                        : "border-line text-bone hover:border-paper hover:text-paper",
                  ].join(" ")}
                  style={active && !dead ? { background: MAGENTA } : undefined}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onAdd}
              className="group flex flex-1 items-center justify-between gap-4 px-6 py-4 font-[family-name:var(--font-cad-display)] text-[1.5rem] leading-none tracking-[0.02em] text-ink transition-transform active:scale-[0.99]"
              style={{ background: MAGENTA }}
            >
              <span>Add to cart</span>
              <span className="flex h-9 w-9 items-center justify-center bg-ink text-paper transition-transform group-hover:rotate-90">
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center border border-line px-6 py-4 font-[family-name:var(--font-cad-mono)] text-[12px] uppercase tracking-[0.16em] text-paper transition-colors hover:border-paper"
            >
              Notify me
            </button>
          </div>
        </div>
      </div>

      {/* -------- right: the shot -------- */}
      <div className="relative min-h-[380px] overflow-hidden border-t border-line lg:border-l lg:border-t-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl(HERO.seed, 1200, 1500)}
          alt="Voltage Runner — featured drop"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* limited badge */}
        <div className="absolute left-0 top-0 flex items-center gap-2 bg-ink/85 px-3 py-2 font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.18em] text-paper backdrop-blur-sm">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: MAGENTA }}
            aria-hidden
          />
          Limited · {HERO.units} pairs
        </div>
        {/* watching counter */}
        <div className="absolute right-0 top-0 bg-paper px-3 py-2 font-[family-name:var(--font-cad-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
          142 watching now
        </div>
        {/* vertical sku rail */}
        <div className="absolute bottom-0 right-0 origin-bottom-right rotate-180 [writing-mode:vertical-rl] bg-ink/80 px-2 py-3 font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.3em] text-ash">
          {HERO.sku} · SS26
        </div>
        {/* hype ticker along bottom */}
        <div className="absolute bottom-0 left-0 right-8 border-t border-black/30 py-2 font-[family-name:var(--font-cad-display)] text-[1.4rem] tracking-[0.04em] text-ink"
          style={{ background: MAGENTA }}
        >
          <Marquee items={HYPE} sep="✦" duration="26s" />
        </div>
      </div>
    </section>
  );
}
