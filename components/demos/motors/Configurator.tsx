"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import {
  INTERIORS,
  PAINTS,
  WHEELS,
  formatUSD,
  heroImage,
} from "./data";
import { useConfig } from "./config";
import { DISPLAY, EASE, MONO, Label, Reveal } from "./ui";

export function Configurator() {
  const reduce = useReducedMotion();
  const {
    paint,
    wheel,
    interior,
    setPaintId,
    setWheelId,
    setInteriorId,
    total,
    rangeKm,
  } = useConfig();

  return (
    <section id="design" className="relative border-t border-line bg-void">
      <div className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Label accent>Configurator</Label>
            <h2
              className={`${DISPLAY} mt-4 font-medium uppercase leading-[0.9] tracking-[-0.01em] text-paper`}
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
            >
              Make it yours
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-ash">
            Five signature paints, forged wheels, and hand-finished cabins.
            Every choice re-prices in real time.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Live preview */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-ink">
              <AnimatePresence mode="sync">
                <motion.img
                  // eslint-disable-next-line @next/next/no-img-element
                  key={paint.id}
                  src={heroImage(paint.seed)}
                  alt={`APEX Solstice in ${paint.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              </AnimatePresence>
              {/* Paint tint overlay */}
              <motion.div
                aria-hidden
                className="absolute inset-0 mix-blend-color"
                animate={{ backgroundColor: paint.hex, opacity: paint.tint }}
                transition={{ duration: 0.6, ease: EASE }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-void/20" />

              {/* Live plate */}
              <div className="absolute bottom-0 left-0 flex items-center gap-4 bg-void/70 px-5 py-3 backdrop-blur-sm">
                <span
                  className="h-4 w-4 rounded-full border border-white/25"
                  style={{ backgroundColor: paint.hex }}
                />
                <span className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-paper`}>
                  {paint.name}
                </span>
                <span className={`${MONO} text-[11px] tracking-[0.14em] text-ash`}>
                  {wheel.size} · {interior.name}
                </span>
              </div>

              {/* Configured total */}
              <div className="absolute right-0 top-0 border-b border-l border-line bg-void/70 px-5 py-3 text-right backdrop-blur-sm">
                <span className={`${MONO} block text-[9.5px] uppercase tracking-[0.24em] text-ash`}>
                  Configured
                </span>
                <span className={`${DISPLAY} text-[24px] font-medium leading-none text-[#ffb800]`}>
                  {formatUSD(total)}
                </span>
              </div>
            </div>

            {/* Range readout */}
            <div className="mt-4 flex items-center justify-between border border-line bg-ink px-5 py-3">
              <Label>Estimated WLTP range</Label>
              <span className="flex items-baseline gap-1.5">
                <span className={`${DISPLAY} text-[22px] font-medium leading-none text-paper`}>
                  {rangeKm}
                </span>
                <span className={`${MONO} text-[11px] lowercase tracking-[0.1em] text-[#ffb800]`}>
                  km
                </span>
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-10 lg:col-span-5">
            {/* Paint */}
            <fieldset>
              <div className="mb-4 flex items-center justify-between">
                <Label>Paint · {paint.finish}</Label>
                <span className={`${MONO} text-[10.5px] tracking-[0.14em] text-ash`}>
                  {paint.priceDelta === 0
                    ? "Included"
                    : `+ ${formatUSD(paint.priceDelta)}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {PAINTS.map((p) => {
                  const active = p.id === paint.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaintId(p.id)}
                      aria-pressed={active}
                      aria-label={p.name}
                      className="group relative flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105"
                    >
                      <span
                        className={`absolute inset-0 rounded-full border transition-colors ${
                          active ? "border-[#ffb800]" : "border-white/15"
                        }`}
                      />
                      <span
                        className="h-8 w-8 rounded-full border border-black/30"
                        style={{ backgroundColor: p.hex }}
                      />
                      {active && (
                        <Check
                          className="absolute h-4 w-4"
                          strokeWidth={2.5}
                          style={{
                            color:
                              p.id === "bianco" || p.id === "nurburgring"
                                ? "#0b0b0d"
                                : "#ffffff",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className={`${MONO} mt-3 text-[11px] uppercase tracking-[0.18em] text-bone`}>
                {paint.name}
              </p>
            </fieldset>

            {/* Wheels */}
            <fieldset>
              <div className="mb-4">
                <Label>Wheels</Label>
              </div>
              <div className="flex flex-col gap-2">
                {WHEELS.map((w) => {
                  const active = w.id === wheel.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWheelId(w.id)}
                      aria-pressed={active}
                      className={`flex items-center justify-between border px-4 py-3 text-left transition-colors duration-300 ${
                        active
                          ? "border-[#ffb800]/70 bg-[#ffb800]/10"
                          : "border-line bg-ink hover:border-ash/50"
                      }`}
                    >
                      <span>
                        <span
                          className={`${MONO} block text-[12px] uppercase tracking-[0.14em] ${
                            active ? "text-paper" : "text-bone"
                          }`}
                        >
                          {w.name}
                        </span>
                        <span className={`${MONO} mt-0.5 block text-[10.5px] tracking-[0.08em] text-ash`}>
                          {w.detail}
                        </span>
                      </span>
                      <span
                        className={`${MONO} text-[11px] tracking-[0.1em] ${
                          active ? "text-[#ffb800]" : "text-ash"
                        }`}
                      >
                        {w.priceDelta === 0
                          ? "Incl."
                          : `+ ${formatUSD(w.priceDelta)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Interior toggle */}
            <fieldset>
              <div className="mb-4">
                <Label>Interior</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {INTERIORS.map((it) => {
                  const active = it.id === interior.id;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setInteriorId(it.id)}
                      aria-pressed={active}
                      className={`border px-4 py-3 text-left transition-colors duration-300 ${
                        active
                          ? "border-[#ffb800]/70 bg-[#ffb800]/10"
                          : "border-line bg-ink hover:border-ash/50"
                      }`}
                    >
                      <span
                        className={`${MONO} block text-[11.5px] uppercase tracking-[0.12em] ${
                          active ? "text-paper" : "text-bone"
                        }`}
                      >
                        {it.name}
                      </span>
                      <span className={`${MONO} mt-1 block text-[10px] tracking-[0.08em] text-ash`}>
                        {it.detail}
                        {it.priceDelta > 0 && ` · + ${formatUSD(it.priceDelta)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </section>
  );
}
