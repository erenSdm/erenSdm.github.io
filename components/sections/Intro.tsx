"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { ALL_DEMOS } from "@/lib/demos";
import { DISCIPLINE_ORDER } from "@/lib/disciplines";
import { Kicker } from "@/components/primitives/SplitButton";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const VALUES: Record<string, { value: number; suffix?: string; pad?: number }> = {
  builds: { value: ALL_DEMOS.length, suffix: "+", pad: 2 },
  disciplines: { value: DISCIPLINE_ORDER.length, pad: 2 },
  fps: { value: 60, suffix: " FPS" },
  templates: { value: 0, pad: 2 },
};

/** Renders "plain |term| plain" with the gertix-style piped highlights. */
export function Piped({ text }: { text: string }) {
  const parts = text.split("|");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="term font-medium text-current">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

function Counter({ value, suffix = "", pad = 0 }: { value: number; suffix?: string; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || reduce || value === 0) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular">
      {String(reduce || value === 0 ? value : n).padStart(pad, "0")}
      {suffix && <span className="ml-[0.12em] text-[0.45em] align-top">{suffix.trim()}</span>}
    </span>
  );
}

export function Intro() {
  const t = useT();

  return (
    <section
      id="studio"
      data-prism="manifesto"
      className="relative bg-mist/[0.93] text-carbon"
    >
      <div className="mx-auto max-w-[1680px] px-4 py-24 md:px-10 md:py-36 lg:px-[8.5vw]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Kicker className="mb-8">{t.intro.kicker}</Kicker>
            <h2 className="font-wide text-display-lg">
              {t.intro.title.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease }}
            className="font-plex max-w-[52ch] self-end text-[15px] leading-[1.7] text-carbon/80 lg:col-span-5"
          >
            <p className="mb-5 text-carbon">{t.intro.lead}</p>
            <p className="text-pretty">
              <Piped text={t.intro.body} />
            </p>
          </motion.div>
        </div>

        <dl className="mt-20 grid grid-cols-2 border-t border-dashed border-carbon/30 md:mt-28 lg:grid-cols-4">
          {t.intro.stats.map((s, i) => {
            const v = VALUES[s.key];
            return (
              <div
                key={s.key}
                className={
                  "flex flex-col gap-3 border-b border-dashed border-carbon/30 py-8 pr-4 md:py-10 lg:border-b-0 " +
                  (i % 2 === 1 ? "pl-4 border-l lg:pl-6 " : "lg:pl-6 ") +
                  (i === 2 ? "lg:border-l " : "") +
                  (i === 0 ? "lg:pl-0" : "")
                }
              >
                <dt className="ui order-2 text-carbon/60">{s.label}</dt>
                <dd className="font-wide order-1 text-[clamp(2.2rem,5vw,4.5rem)] leading-none">
                  {v && <Counter value={v.value} suffix={v.suffix} pad={v.pad} />}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
