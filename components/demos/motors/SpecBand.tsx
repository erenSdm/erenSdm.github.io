"use client";

import { FIGURES } from "./data";
import { CountUp, DISPLAY, MONO, Label, Reveal, Rule } from "./ui";

export function SpecBand() {
  return (
    <section id="performance" className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Label accent>Performance</Label>
            <h2
              className={`${DISPLAY} mt-4 max-w-xl font-medium uppercase leading-[0.9] tracking-[-0.01em] text-paper`}
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
            >
              Measured, not marketed
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-ash">
            Every figure verified on the bench and the track. No asterisks, no
            launch-mode caveats — this is the Solstice at rest and at redline.
          </p>
        </Reveal>

        <Rule className="mt-14" />

        {/* Data band */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-14 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
          {FIGURES.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06}>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <CountUp
                    value={f.value}
                    decimals={f.decimals ?? 0}
                    className={`${DISPLAY} text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-none text-paper`}
                  />
                  <span className={`${MONO} text-[12px] lowercase tracking-[0.08em] text-[#ffb800]`}>
                    {f.unit}
                  </span>
                </div>
                <span className={`${MONO} mt-4 text-[10.5px] uppercase tracking-[0.24em] text-ash`}>
                  {f.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
