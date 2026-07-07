"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CHARGE_CURVE } from "./data";
import { DISPLAY, EASE, MONO, Label, Reveal } from "./ui";

const MAX_KW = 350;

export function ChargeCurve() {
  const reduce = useReducedMotion();

  return (
    <section id="range" className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-4">
            <Reveal>
              <Label accent>Range &amp; Charging</Label>
              <h2
                className={`${DISPLAY} mt-4 font-medium uppercase leading-[0.9] tracking-[-0.01em] text-paper`}
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
              >
                10 to 80 in 18 minutes
              </h2>
              <p className="mt-6 max-w-sm text-[14.5px] leading-relaxed text-ash">
                A native 900-volt architecture holds a 350 kW peak deep into the
                curve — long enough to add 300 km of range in the time it takes
                to drink a coffee.
              </p>

              <div className="mt-10 flex gap-10">
                <div>
                  <span className={`${DISPLAY} text-[40px] font-medium leading-none text-paper`}>
                    724
                  </span>
                  <span className={`${MONO} ml-1 text-[12px] lowercase text-[#ffb800]`}>
                    km
                  </span>
                  <p className={`${MONO} mt-2 text-[10px] uppercase tracking-[0.22em] text-ash`}>
                    WLTP range
                  </p>
                </div>
                <div>
                  <span className={`${DISPLAY} text-[40px] font-medium leading-none text-paper`}>
                    350
                  </span>
                  <span className={`${MONO} ml-1 text-[12px] lowercase text-[#ffb800]`}>
                    kW
                  </span>
                  <p className={`${MONO} mt-2 text-[10px] uppercase tracking-[0.22em] text-ash`}>
                    Peak charge
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Curve chart */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <div className="relative h-[300px] w-full border border-line bg-void/40 p-6 md:h-[360px]">
                {/* Gridlines */}
                {[0, 25, 50, 75, 100].map((g) => (
                  <div
                    key={g}
                    className="absolute inset-x-6 border-t border-line-soft"
                    style={{ bottom: `${24 + (g / 100) * 78}%` }}
                  >
                    <span className={`${MONO} absolute -top-2 left-0 -translate-x-[130%] text-[9px] tracking-[0.1em] text-dim`}>
                      {Math.round((g / 100) * MAX_KW)}
                    </span>
                  </div>
                ))}

                {/* SVG curve */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-x-6 bottom-[24%] top-6 h-auto w-[calc(100%-3rem)]"
                  style={{ height: "70%" }}
                >
                  <defs>
                    <linearGradient id="apxFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffb800" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ffb800" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const pts = CHARGE_CURVE.map((d) => {
                      const x =
                        ((d.soc - 10) / (80 - 10)) * 100;
                      const yv = 100 - (d.kw / MAX_KW) * 100;
                      return { x, y: yv };
                    });
                    const line = pts
                      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                      .join(" ");
                    const area = `${line} L 100 100 L 0 100 Z`;
                    return (
                      <>
                        <motion.path
                          d={area}
                          fill="url(#apxFill)"
                          initial={reduce ? false : { opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                        />
                        <motion.path
                          d={line}
                          fill="none"
                          stroke="#ffb800"
                          strokeWidth="1.4"
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={reduce ? false : { pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, ease: EASE }}
                        />
                      </>
                    );
                  })()}
                </svg>

                {/* X axis labels */}
                <div className="absolute inset-x-6 bottom-6 flex justify-between">
                  {[10, 20, 30, 40, 50, 60, 70, 80].map((s) => (
                    <span
                      key={s}
                      className={`${MONO} text-[9.5px] tracking-[0.08em] text-dim`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className={`${MONO} absolute bottom-2 left-6 text-[9px] uppercase tracking-[0.22em] text-ash`}>
                  State of charge %
                </span>
                <span className={`${MONO} absolute right-6 top-4 text-[9px] uppercase tracking-[0.22em] text-ash`}>
                  kW delivered
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
