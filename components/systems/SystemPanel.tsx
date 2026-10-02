"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { SplitButton } from "@/components/primitives/SplitButton";
import { cn } from "@/lib/utils";
import { FlowStage } from "./FlowStage";
import { Inspector } from "./Inspector";
import { Metrics } from "./Metrics";
import { useStory } from "./useStory";
import { tx, type SystemDef } from "./types";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const UI = {
  scenarios: { en: "Scenarios", tr: "Senaryolar" },
  pause: { en: "Pause", tr: "Duraklat" },
  play: { en: "Play", tr: "Oynat" },
  scroll: { en: "Drag to pan", tr: "Kaydırarak gez" },
  flagship: { en: "Flagship build", tr: "Amiral gemisi" },
  sim: { en: "Simulated with representative traffic", tr: "Temsilî trafikle simüle edildi" },
} as const;

export function SystemPanel({
  sys,
  index,
  light,
  flagship,
}: {
  sys: SystemDef;
  index: number;
  light: boolean;
  flagship?: boolean;
}) {
  const { locale } = useLanguage();
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.3 });
  const [paused, setPaused] = useState(false);
  const live = inView && !paused;
  const s = useStory(sys.stories, live);
  const stations = useMemo(() => new Map(sys.stations.map((st) => [st.id, st])), [sys.stations]);
  const c = sys.copy;
  const muted = light ? "text-carbon/70" : "text-paper/70";
  const line = light ? "border-carbon/25" : "border-paper/20";

  return (
    <motion.article
      id={`sys-${sys.slug}`}
      aria-labelledby={`sys-${sys.slug}-title`}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease }}
      className={cn(
        "scroll-mt-20 border border-dashed px-4 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12",
        light ? "border-carbon/25 bg-mist text-carbon" : "border-paper/20 bg-graphite text-paper"
      )}
    >
      {/* header */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="ui flex flex-wrap items-center gap-3 opacity-70">
            <span className="tabular">{c.code}</span>
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
            <span>{tx(c.kicker, locale)}</span>
            {flagship && (
              <span className="ui bg-volt px-2 py-1 text-[10px] text-carbon">{tx(UI.flagship, locale)}</span>
            )}
          </div>
          <div className="mt-6 grid grid-cols-[3.25rem_1fr] items-baseline gap-x-3 md:grid-cols-[5rem_1fr]">
            <span className="font-plex tabular text-xl md:text-2xl">{String(index + 1).padStart(2, "0")}</span>
            <h3
              id={`sys-${sys.slug}-title`}
              className={cn("font-wide text-balance", flagship ? "text-display-lg" : "text-display-md")}
            >
              {tx(c.title, locale)}
            </h3>
          </div>
          <ul className="ml-[calc(3.25rem+0.75rem)] mt-6 flex flex-wrap gap-1.5 md:ml-[calc(5rem+0.75rem)]">
            {c.tags.map((t) => (
              <li
                key={t}
                lang="en"
                className={cn("ui rounded-full border px-3 py-1.5 text-[11px]", light ? "border-carbon/55" : "border-paper/45")}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-end lg:col-span-5">
          <p className={cn("font-plex max-w-[56ch] text-[15px] leading-[1.7] text-pretty", muted)}>{tx(c.body, locale)}</p>
          <dl className={cn("mt-8 border-t border-dashed", line)}>
            {c.facts.map((f) => (
              <div key={tx(f.k, "en")} className={cn("grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 border-b border-dashed py-3", line)}>
                <dt className="ui opacity-55">{tx(f.k, locale)}</dt>
                <dd className="font-plex text-[13px] leading-snug">{tx(f.v, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* scenario bar */}
      <div className="mt-10 flex flex-wrap items-center gap-2 md:mt-14">
        <span className="ui mr-2 opacity-55">{tx(UI.scenarios, locale)}</span>
        {sys.stories.map((sc, i) => {
          const on = i === s.sIdx;
          return (
            <button
              key={sc.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                s.select(i);
                setPaused(false);
              }}
              className={cn(
                "ui relative border px-3 py-2 text-[11px] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-volt active:scale-[0.98]",
                on
                  ? light
                    ? "border-carbon bg-carbon text-paper"
                    : "border-paper bg-paper text-carbon"
                  : light
                    ? "border-carbon/30 hover:border-carbon"
                    : "border-paper/30 hover:border-paper"
              )}
            >
              <span className="tabular mr-2 opacity-50">{String(i + 1).padStart(2, "0")}</span>
              {tx(sc.label, locale)}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={tx(paused ? UI.play : UI.pause, locale)}
          className={cn(
            "ml-auto flex h-9 w-9 items-center justify-center border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-volt",
            light ? "border-carbon/30 hover:border-carbon" : "border-paper/30 hover:border-paper"
          )}
        >
          {paused ? <Play className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Pause className="h-3.5 w-3.5" strokeWidth={1.5} />}
        </button>
      </div>

      {/* step ticks */}
      <div className="mt-3 flex gap-1" aria-hidden>
        {s.story.steps.map((st, i) => (
          <span
            key={i}
            className={cn(
              "h-[3px] flex-1 transition-colors duration-500",
              i <= s.step
                ? st.state === "err"
                  ? "bg-hazard"
                  : light
                    ? "bg-carbon"
                    : "bg-volt"
                : light
                  ? "bg-carbon/15"
                  : "bg-paper/15"
            )}
          />
        ))}
      </div>

      {/* stage: live schematic + trace */}
      <div ref={stageRef} className="frame-dashed mt-4 grid gap-1.5 p-1.5 md:p-2 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative flex flex-col bg-carbon text-paper">
          <Metrics items={sys.metrics} live={live} />
          <div className="flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
            {/* inline: the global `* { min-width: 0 }` reset outranks layered utilities */}
            <div className="p-3 md:p-5" style={{ minWidth: 720 }}>
              <FlowStage sys={sys} story={s.story} step={s.step} run={s.run} live={live} />
            </div>
          </div>
          <div className="ui flex items-center justify-between gap-4 px-4 pb-3 text-[10px] text-paper/35">
            <span>{tx(UI.sim, locale)}</span>
            <span className="md:hidden">{tx(UI.scroll, locale)} →</span>
          </div>
        </div>
        <Inspector story={s.story} step={s.step} stations={stations} live={live} />
      </div>

      {c.cta && (
        <div className="mt-8">
          <SplitButton tone={light ? "dark" : "light"} href={c.cta.href}>
            {tx(c.cta.label, locale)}
          </SplitButton>
        </div>
      )}
    </motion.article>
  );
}
