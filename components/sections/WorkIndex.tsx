"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { WEB_DEMOS, MOBILE_DEMOS, ALL_DEMOS, type Demo } from "@/lib/demos";
import { LivePreview } from "@/components/showcase/LivePreview";
import { Kicker } from "@/components/primitives/SplitButton";

/**
 * Full index of every build in the manifest. Rows are cheap text; each row's
 * thumbnail iframe only mounts once it is within ~1 screen of the viewport and
 * shows an accent poster until then, so the list scales to any length.
 */
export function WorkIndex() {
  const { t } = useLanguage();
  const groups = [
    { label: t.work.web, demos: WEB_DEMOS },
    { label: t.work.mobile, demos: MOBILE_DEMOS },
  ].filter((g) => g.demos.length > 0);

  return (
    <section id="work" data-prism="work" className="relative bg-mist/[0.93] text-carbon">
      <div className="mx-auto max-w-[1680px] px-4 py-24 md:px-10 md:py-36 lg:px-[8.5vw]">
        <Kicker className="mb-8">{t.work.kicker}</Kicker>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-wide text-display-xl">
            {t.work.title}
            <sup className="font-plex tabular ml-2 align-super text-[0.22em] tracking-normal opacity-60">
              ({String(ALL_DEMOS.length).padStart(2, "0")})
            </sup>
          </h2>
          <p className="font-plex max-w-[40ch] text-[15px] leading-[1.7] text-carbon/75">
            {t.work.sub}
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:mt-24">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="ui mb-3 flex items-center justify-between text-carbon/60">
                <span>{g.label}</span>
                <span className="tabular">{String(g.demos.length).padStart(2, "0")}</span>
              </div>
              <ul className="border-t border-dashed border-carbon/35">
                {g.demos.map((d) => (
                  <Row key={d.slug} demo={d} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ demo }: { demo: Demo }) {
  const { t, locale } = useLanguage();
  const mobile = demo.kind === "mobile";
  return (
    <li className="border-b border-dashed border-carbon/35">
      <Link
        href={demo.route}
        className="group grid grid-cols-[1fr_38%] items-center gap-x-4 gap-y-2 py-5 outline-none focus-visible:bg-carbon/5 md:grid-cols-12 md:gap-x-6 md:py-6"
        aria-label={`${t.work.open}: ${demo.brand} — ${demo.tagline[locale]}`}
      >
        <div className="flex flex-col gap-2 md:col-span-7 md:grid md:grid-cols-7 md:items-center md:gap-6">
          <div className="ui flex items-center gap-3 text-carbon/55 md:col-span-1 md:flex-col md:items-start md:gap-1.5">
            <span className="tabular">{demo.index}</span>
            <span className="md:hidden" aria-hidden>
              ·
            </span>
            <span className="truncate">{demo.domain[locale]}</span>
          </div>
          <span className="font-wide text-[clamp(1.35rem,3vw,2.6rem)] leading-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:col-span-3">
            {demo.brand}
          </span>
          <span className="font-plex text-[13px] leading-snug text-carbon/70 md:col-span-3 md:text-sm">
            {demo.tagline[locale]}
          </span>
        </div>

        <div className="flex items-center justify-end gap-6 md:col-span-5">
          <ul className="hidden flex-wrap justify-end gap-1.5 xl:flex">
            {demo.stack.slice(0, 2).map((s) => (
              <li key={s} className="ui rounded-full border border-carbon/45 px-2.5 py-1 text-[10px]">
                {s}
              </li>
            ))}
          </ul>
          <div className="frame-dashed w-full shrink-0 p-1 md:w-[220px] lg:w-[260px]">
            <div className="relative aspect-[16/10] overflow-hidden bg-carbon">
              <LivePreview
                src={demo.route}
                title={demo.brand}
                accent={demo.accent}
                baseWidth={mobile ? 390 : 1440}
                baseHeight={mobile ? 844 : 900}
                rootMargin="400px 0px"
                warm={false}
              />
            </div>
          </div>
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center bg-carbon text-paper transition-colors duration-200 group-hover:bg-volt group-hover:text-carbon md:flex">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </li>
  );
}
