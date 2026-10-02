"use client";

import { useCallback, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Kicker } from "@/components/primitives/SplitButton";
import { SystemPanel } from "@/components/systems/SystemPanel";
import { TraceBridge } from "@/components/transition/ChipTransition";
import { tx } from "@/components/systems/types";
import { richcasebot } from "@/components/systems/data/richcasebot";
import { rag } from "@/components/systems/data/rag";
import { integrations } from "@/components/systems/data/integrations";
import { automation } from "@/components/systems/data/automation";
import { useHorizontalPin } from "@/lib/useHorizontalPin";
import { useMedia } from "@/lib/useMedia";
import { scrollToId, cn } from "@/lib/utils";

const SYSTEMS = [richcasebot, rag, integrations, automation];

const COPY = {
  kicker: { en: "Backend & systems", tr: "Backend ve sistemler" },
  title: { en: "Under the hood", tr: "Perde arkası" },
  sub: {
    en: "Screens are only the part you see. Keep scrolling and each system slides past at work: the live traffic running through it, and one real request followed end to end, with the data it carries at every step and the milliseconds each step takes.",
    tr: "Ekranlar işin yalnızca görünen kısmı. Kaydırmaya devam ettikçe her sistem yanından çalışır hâlde geçiyor: içinden akan canlı trafiği ve baştan sona takip edilen tek bir isteği. Her adımda verinin nasıl göründüğünü ve o adımın kaç milisaniye sürdüğünü görebilirsiniz.",
  },
  legend: [
    { k: "packet", en: "Live traffic", tr: "Canlı trafik" },
    { k: "token", en: "The request we follow", tr: "Takip edilen istek" },
    { k: "ai", en: "AI step", tr: "Yapay zekâ adımı" },
    { k: "err", en: "Blocked / dropped", tr: "Durduruldu / düştü" },
  ],
} as const;

export function Systems() {
  const { locale } = useLanguage();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // The sideways track is a desktop effect; small screens and reduced motion
  // keep the panels stacked vertically.
  const horizontal = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");

  // progress bar is written straight to the DOM so scrolling never re-renders the panels
  const onProgress = useCallback((p: number) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    setActive(Math.min(SYSTEMS.length - 1, Math.round(p * (SYSTEMS.length - 1))));
  }, []);

  const jumpTo = useHorizontalPin(wrap, track, horizontal, onProgress);

  function go(slug: string) {
    const el = document.getElementById(`sys-${slug}`);
    if (horizontal && el?.parentElement && jumpTo(el.parentElement)) return;
    scrollToId(`sys-${slug}`, -72);
  }

  return (
    <section id="systems" aria-labelledby="systems-title" className="relative text-paper">
      {/* picks up the bus line the mobile outro leaves running off screen */}
      <TraceBridge />
      <div className="mx-auto max-w-[1680px] px-4 pb-14 pt-24 md:px-10 md:pb-20 md:pt-36 lg:px-[8.5vw]">
        <Kicker className="mb-8">{tx(COPY.kicker, locale)}</Kicker>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="systems-title" className="font-wide text-display-xl">
            {tx(COPY.title, locale)}
          </h2>
          <p className="font-plex max-w-[44ch] text-[15px] leading-[1.7] text-paper/70">{tx(COPY.sub, locale)}</p>
        </div>

        {/* index rail + legend */}
        <div className="mt-14 grid gap-8 border-t border-dashed border-paper/20 pt-6 lg:grid-cols-12">
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {SYSTEMS.map((s, i) => (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => go(s.slug)}
                  aria-current={horizontal && active === i ? "true" : undefined}
                  className="group flex w-full items-baseline gap-3 border-b border-dashed border-paper/15 py-3 text-left outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-volt sm:pr-4 lg:border-b-0"
                >
                  <span className="ui tabular text-paper/45">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={cn(
                      "font-plex text-[13px] leading-snug transition-colors group-hover:text-volt",
                      horizontal && active === i ? "text-volt" : "text-paper/80"
                    )}
                  >
                    {tx(s.copy.title, locale)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:col-span-4 lg:justify-end" aria-label="Legend">
            {COPY.legend.map((l) => (
              <li key={l.k} className="ui flex items-center gap-2 text-[10px] text-paper/55">
                <LegendMark k={l.k} />
                {l[locale]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {horizontal ? (
        /* pinned track — vertical scroll slides the panels sideways, then lets go */
        <div ref={wrap} className="relative mb-24 h-[100dvh] overflow-hidden md:mb-36">
          <div ref={track} className="flex h-full w-max gap-4 px-[4vw] pb-8 pt-[72px]">
            {SYSTEMS.map((s, i) => (
              <div key={s.slug} className="h-full w-[min(92vw,1560px)] shrink-0">
                <SystemPanel sys={s} index={i} light={i % 2 === 1} flagship={i === 0} compact />
              </div>
            ))}
          </div>
          <div aria-hidden className="absolute inset-x-[4vw] bottom-4 h-px bg-paper/15">
            <div ref={bar} className="h-full origin-left scale-x-0 bg-volt" />
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-[1680px] flex-col gap-6 px-2 pb-24 md:px-4 md:pb-36">
          {SYSTEMS.map((s, i) => (
            <SystemPanel key={s.slug} sys={s} index={i} light={i % 2 === 1} flagship={i === 0} />
          ))}
        </div>
      )}
    </section>
  );
}

function LegendMark({ k }: { k: string }) {
  if (k === "packet")
    return (
      <span aria-hidden className="flex items-center gap-[3px]">
        <span className="h-1 w-1 bg-paper/30" />
        <span className="h-1 w-1 bg-paper/60" />
        <span className="h-1.5 w-1.5 bg-paper" />
      </span>
    );
  if (k === "token") return <span aria-hidden className="h-2.5 w-2.5 border-2 border-carbon bg-volt" style={{ boxShadow: "0 0 0 1px #ccff00" }} />;
  if (k === "err") return <span aria-hidden className="h-2.5 w-2.5 border border-hazard p-[2px]"><span className="block h-full w-full bg-hazard" /></span>;
  return (
    <span
      aria-hidden
      className="h-2.5 w-2.5 border border-volt/60"
      style={{ backgroundImage: "repeating-linear-gradient(-45deg, rgba(204,255,0,0.45) 0 1px, transparent 1px 3px)" }}
    />
  );
}
