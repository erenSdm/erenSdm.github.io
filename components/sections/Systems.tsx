"use client";

import { useLanguage } from "@/lib/i18n/context";
import { Kicker } from "@/components/primitives/SplitButton";
import { SystemPanel } from "@/components/systems/SystemPanel";
import { tx } from "@/components/systems/types";
import { richcasebot } from "@/components/systems/data/richcasebot";
import { rag } from "@/components/systems/data/rag";
import { integrations } from "@/components/systems/data/integrations";
import { automation } from "@/components/systems/data/automation";
import { scrollToId } from "@/lib/utils";

const SYSTEMS = [richcasebot,rag, integrations, automation];

const COPY = {
  kicker: { en: "Backend & systems", tr: "Backend ve sistemler" },
  title: { en: "Under the hood", tr: "Perde arkası" },
  sub: {
    en: "Screens are only the part you see. Each panel below shows a system at work: the live traffic running through it, and one real request followed end to end, with the data it carries at every step and the milliseconds each step takes.",
    tr: "Ekranlar işin yalnızca görünen kısmı. Aşağıdaki her panel bir sistemi çalışırken gösteriyor: içinden akan canlı trafiği ve baştan sona takip edilen tek bir isteği. Her adımda verinin nasıl göründüğünü ve o adımın kaç milisaniye sürdüğünü görebilirsiniz.",
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

  return (
    <section id="systems" aria-labelledby="systems-title" className="relative text-paper">
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
                  onClick={() => scrollToId(`sys-${s.slug}`, -72)}
                  className="group flex w-full items-baseline gap-3 border-b border-dashed border-paper/15 py-3 text-left outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-volt sm:pr-4 lg:border-b-0"
                >
                  <span className="ui tabular text-paper/45">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-plex text-[13px] leading-snug text-paper/80 transition-colors group-hover:text-volt">
                    {tx(s.copy.kicker, locale)}
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

      <div className="mx-auto flex max-w-[1680px] flex-col gap-6 px-2 pb-24 md:px-4 md:pb-36">
        {SYSTEMS.map((s, i) => (
          <SystemPanel key={s.slug} sys={s} index={i} light={i % 2 === 1} flagship={i === 0} />
        ))}
      </div>
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
