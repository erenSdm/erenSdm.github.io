"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { tx, type StationDef, type StoryDef } from "./types";

const UI = {
  tracking: { en: "Tracking", tr: "Takip" },
  total: { en: "elapsed, end to end", tr: "geçen süre, uçtan uca" },
  payload: { en: "Payload at", tr: "Veri şu an" },
  waiting: { en: "waiting for the next event", tr: "sıradaki olay bekleniyor" },
} as const;

const fmtMs = (ms: number, locale: string) =>
  ms >= 1000
    ? `${(ms / 1000).toLocaleString(locale === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 2 })} s`
    : `${Math.round(ms)} ms`;

/**
 * Follows the tracked item: a latency waterfall (where the time goes) and the
 * payload as it looks right now (what the system actually did to the data).
 */
export function Inspector({
  story,
  step,
  stations,
  live,
}: {
  story: StoryDef;
  step: number;
  stations: Map<string, StationDef>;
  live: boolean;
}) {
  const { locale } = useLanguage();
  const reduce = useReducedMotion();
  const steps = story.steps;
  const total = useMemo(() => steps.reduce((a, s) => a + s.ms, 0), [steps]);
  const starts = useMemo(() => steps.reduce<number[]>((a, s, i) => [...a, i ? a[i - 1] + steps[i - 1].ms : 0], []), [steps]);
  const elapsed = step < 0 ? 0 : starts[step] + steps[step].ms;
  const cur = step >= 0 ? steps[step] : undefined;

  const num = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  useEffect(() => {
    const el = num.current;
    if (!el) return;
    const write = (v: number) => {
      shown.current = v;
      el.textContent = fmtMs(v, locale);
    };
    if (reduce) return write(elapsed);
    const ctl = animate(elapsed < shown.current ? 0 : shown.current, elapsed, { duration: 0.7, ease: "easeOut", onUpdate: write });
    return () => ctl.stop();
  }, [elapsed, locale, reduce]);

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-carbon text-paper">
      <div className="ui flex items-center gap-2 border-b border-dashed border-paper/15 px-4 py-2.5 text-[10px] text-paper/50">
        <span aria-hidden className={cn("h-1.5 w-1.5", live ? "animate-blink bg-volt" : "bg-paper/25")} />
        <span>{tx(UI.tracking, locale)}</span>
        <span className="truncate text-paper/35">/ {tx(story.label, locale)}</span>
      </div>

      <div className="border-b border-dashed border-paper/15 px-4 py-4">
        <div lang="en" className="font-plex text-[12px] text-volt">{story.entity}</div>
        <div className="mt-1 flex items-baseline gap-3">
          <span ref={num} className="font-wide text-[34px] leading-none tabular">
            0 ms
          </span>
        </div>
        <div className="font-plex mt-1.5 text-[11px] text-paper/45">{tx(UI.total, locale)}</div>
      </div>

      {/* waterfall */}
      <ol className="flex flex-col gap-[7px] px-4 py-4" aria-label="Latency waterfall">
        {steps.map((s, i) => {
          const reached = i <= step;
          const now = i === step;
          const bad = s.state === "err" || s.state === "warn";
          const st = stations.get(s.at);
          return (
            <li key={`${story.id}-${i}`} className={cn("transition-opacity duration-500", reached ? "opacity-100" : "opacity-25")}>
              <div className="font-plex flex items-baseline gap-2 text-[11px] leading-tight">
                <span lang="en" className={cn("shrink-0 uppercase tracking-[0.04em]", now ? "text-paper" : "text-paper/70")}>
                  {st?.label}
                </span>
                <span className="truncate text-paper/40">{tx(s.title, locale)}</span>
                <span className={cn("ml-auto shrink-0 tabular", bad && reached ? "text-hazard" : now ? "text-volt" : "text-paper/55")}>
                  {fmtMs(s.ms, locale)}
                </span>
              </div>
              <div className="relative mt-[3px] h-[3px] bg-paper/[0.07]">
                {reached && (
                  <motion.span
                    className={cn("absolute inset-y-0", bad ? "bg-hazard" : now ? "bg-volt" : "bg-paper/45")}
                    style={{ left: `${(starts[i] / total) * 100}%` }}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `max(2px, ${(s.ms / total) * 100}%)` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* payload */}
      <div className="mt-auto border-t border-dashed border-paper/15 px-4 py-3">
        <div className="ui mb-2 text-[10px] text-paper/45">
          {tx(UI.payload, locale)} <span className="text-paper/80">{cur ? stations.get(cur.at)?.label : "—"}</span>
        </div>
        <div className="font-plex min-h-[118px] text-[11px] leading-[1.55]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.pre
              key={`${story.id}-${step}`}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden whitespace-pre-wrap break-words"
            >
              {cur?.payload ? (
                cur.payload.map((l, i) => (
                  <motion.span
                    key={i}
                    className="block"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.06 }}
                  >
                    <Code line={l} bad={cur.state === "err" || cur.state === "warn"} />
                  </motion.span>
                ))
              ) : (
                <span className="text-paper/35">{tx(UI.waiting, locale)}</span>
              )}
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Minimal JSON-ish colouring: keys dim, strings bright, numbers in accent. */
function Code({ line, bad }: { line: string; bad?: boolean }) {
  const parts = line.split(/("(?:[^"\\]|\\.)*"\s*:|"(?:[^"\\]|\\.)*"|-?\b\d[\d.,]*\b)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        if (/^".*"\s*:$/.test(p)) return <span key={i} className="text-paper/45">{p}</span>;
        if (p.startsWith('"')) return <span key={i} className="text-paper">{p}</span>;
        if (/^-?\d/.test(p)) return <span key={i} className={bad ? "text-hazard" : "text-volt"}>{p}</span>;
        return <span key={i} className="text-paper/60">{p}</span>;
      })}
    </>
  );
}
