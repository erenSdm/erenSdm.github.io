"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { cn, scrollToId } from "@/lib/utils";
import { Marquee } from "@/components/primitives/Marquee";
import { ArrowDown } from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const t = useT();
  const { headline, accentIndex } = t.hero;
  const fullLine = headline.join(" ");

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden pt-28 md:pt-32"
    >
      {/* blueprint backdrop */}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/0 via-ink/0 to-ink" />

      {/* top meta row */}
      <div className="relative mx-auto flex w-full max-w-[1600px] items-start justify-between px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-xs"
        >
          <div className="label mb-3 text-acid">[ {t.hero.eyebrow} ]</div>
          <p className="font-mono text-xs leading-relaxed text-ash">
            41.0082° N / 28.9784° E
            <br />
            {t.hero.established}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="text-right"
        >
          <span className="label">W—01 / M—04</span>
          <p className="mt-2 hidden font-mono text-xs text-ash sm:block">
            8 LIVE BUILDS
          </p>
        </motion.div>
      </div>

      {/* thesis wall */}
      <div className="relative mx-auto w-full max-w-[1600px] flex-1 px-5 md:px-10">
        <div className="flex h-full flex-col justify-start pt-4 md:justify-center md:pt-0">
          <h1
            className="font-display text-thesis leading-[0.95] text-paper"
            aria-label={fullLine}
          >
            <span className="sr-only">{fullLine}</span>
            <span aria-hidden>
              {headline.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className={cn("block", i === accentIndex && "text-acid")}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.85, ease, delay: 0.15 + i * 0.11 }}
                  >
                    {line}
                    {i === headline.length - 1 && (
                      <span className="ml-[0.14em] inline-block h-[0.72em] w-[0.13em] -translate-y-[0.03em] bg-acid align-middle animate-blink" />
                    )}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>

      {/* bottom row */}
      <div className="relative">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="flex max-w-md items-start gap-3 text-lg leading-snug text-bone md:text-xl"
          >
            <span aria-hidden className="mt-[0.65em] hidden h-px w-8 shrink-0 bg-dim sm:block" />
            {t.hero.statement}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.7 }}
            className="flex items-center gap-6"
          >
            <button
              onClick={() => scrollToId("work")}
              className="group flex items-center gap-3 border-2 border-acid bg-acid px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-acid-deep"
            >
              {t.hero.cta}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" strokeWidth={2} />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="label">{t.hero.scroll}</span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="text-acid"
              >
                <ArrowDown className="h-4 w-4" strokeWidth={2} />
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* ticker */}
        <div className="border-y border-line bg-ink/60 py-3">
          <Marquee items={t.hero.ticker} duration={34} itemClassName="label text-bone" />
        </div>
      </div>
    </section>
  );
}
