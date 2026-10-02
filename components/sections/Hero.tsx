"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { scrollToId } from "@/lib/utils";
import { ALL_DEMOS } from "@/lib/demos";
import { SplitButton, Kicker } from "@/components/primitives/SplitButton";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SEPARATORS = ["×", "→", "*"];

export function Hero() {
  const t = useT();
  const reduce = useReducedMotion();
  // running letter index per title line, so the glow sweeps across all lines in one pass
  const offsets = t.hero.title.map((_, i) =>
    t.hero.title.slice(0, i).reduce((n, l) => n + l.length, 0),
  );
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease, delay },
        };

  return (
    <section
      id="top"
      data-prism="hero"
      className="relative flex min-h-[100dvh] flex-col text-paper"
    >
      {/* faint vignette so copy stays legible over the prism */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,11,14,0.7)_0%,rgba(10,11,14,0.25)_42%,rgba(10,11,14,0)_62%)]"
      />

      <div className="relative flex w-full flex-1 flex-col justify-center px-4 pb-16 pt-28 md:px-10 md:pt-32 lg:pl-[3.5vw] lg:pr-[48vw] xl:pr-[50vw]">
        <motion.div {...enter(0)}>
          <Kicker className="mb-8 text-paper md:mb-10">{t.hero.kicker}</Kicker>
        </motion.div>

        <h1
          aria-label={t.hero.title.join(" ")}
          className="relative font-wide text-[clamp(1.55rem,calc(3.6vw_+_0.3rem),4.2rem)]"
          style={{
            fontWeight: 300,
            letterSpacing: "0.06em",
            lineHeight: 1.14,
          }}
        >
          {t.hero.title.map((line, i) => (
            <span key={i} aria-hidden className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.1 + i * 0.09 }}
              >
                {Array.from(line).map((ch, j) => (
                  <span
                    key={j}
                    className="glow-letter"
                    style={{ ["--d" as string]: `${0.5 + (offsets[i] + j) * 0.045}s` }}
                  >
                    {ch}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          {...enter(0.45)}
          className="font-plex mt-8 max-w-[46ch] text-[15px] leading-[1.65] text-paper/80 md:mt-10 md:text-base"
        >
          {t.hero.body}
        </motion.p>

        <motion.div {...enter(0.55)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-12">
          <SplitButton tone="light" onClick={() => scrollToId("services", -56)}>
            {t.hero.cta}
          </SplitButton>
          <span className="ui tabular flex items-center gap-2 text-paper/55">
            <span aria-hidden className="h-1.5 w-1.5 animate-blink rounded-full bg-volt" />
            {String(ALL_DEMOS.length).padStart(2, "0")} {t.hero.liveBuilds}
          </span>
        </motion.div>
      </div>

      {/* services ticker */}
      <div className="relative">
        <div aria-hidden className="rule-dashed text-paper" />
        <div className="flex overflow-hidden py-4 md:py-5" aria-label={t.hero.ticker.join(", ")}>
          <div className="flex min-w-full shrink-0 animate-marquee" style={{ ["--marquee-duration" as string]: "48s" }}>
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden className="flex shrink-0 items-center">
                {t.hero.ticker.map((item, i) => (
                  <span key={i} className="flex items-center">
                    <span className="font-plex whitespace-nowrap text-sm uppercase tracking-[0.04em] text-paper/90 md:text-[15px]">
                      {item}
                    </span>
                    <span className="mx-6 font-plex text-sm text-paper/45 md:mx-8">
                      {SEPARATORS[i % SEPARATORS.length]}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
