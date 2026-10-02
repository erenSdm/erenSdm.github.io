"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, Hand, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { Demo } from "@/lib/demos";
import { FEATURED_WEB } from "@/lib/featured";
import { LivePreview } from "@/components/showcase/LivePreview";
import { SplitButton, Kicker } from "@/components/primitives/SplitButton";
import { useMedia } from "@/lib/useMedia";
import { cn } from "@/lib/utils";

const NAV_H = 56; // fixed header height (h-14)
const STACK_STEP = 14; // px each stacked card peeks below the previous one

function domainFor(demo: Demo) {
  if (demo.url) return new URL(demo.url).hostname;
  return (
    demo.brand
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z0-9]/g, "") + ".studio"
  );
}

export function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" data-prism="services" className="relative text-paper">
      <div className="mx-auto max-w-[1680px] px-4 pb-14 pt-24 md:px-10 md:pb-20 md:pt-36 lg:px-[8.5vw]">
        <Kicker className="mb-8">{t.services.kicker}</Kicker>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-wide text-display-xl">{t.services.title}</h2>
          <p className="font-plex max-w-[40ch] text-[15px] leading-[1.7] text-paper/70">
            {t.services.sub}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 px-2 pb-24 md:px-3 lg:gap-0 lg:pb-[8vh]">
        {FEATURED_WEB.map((demo, i) => (
          <SiteCard key={demo.slug} demo={demo} i={i} total={FEATURED_WEB.length} />
        ))}
      </div>
    </section>
  );
}

function SiteCard({ demo, i, total }: { demo: Demo; i: number; total: number }) {
  const { t, locale } = useLanguage();
  const light = i % 2 === 1;

  return (
    <article
      data-prism-step={i}
      aria-labelledby={`site-${demo.slug}`}
      className="lg:sticky"
      style={{ top: NAV_H + 12 + i * STACK_STEP }}
    >
      <div
        className={cn(
          "grid gap-7 border border-dashed px-4 py-6 md:gap-10 md:px-8 md:py-10 lg:min-h-[calc(100dvh-8.5rem)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:py-8",
          light
            ? "border-carbon/25 bg-mist text-carbon"
            : "border-paper/20 bg-graphite text-paper",
          "lg:mb-[14vh] lg:last:mb-0"
        )}
      >
        {/* copy column — below lg it dissolves (display: contents) so the live
            preview sits between the name and the pitch: phones see the work first */}
        <div className="contents lg:col-span-4 lg:flex lg:flex-col lg:self-stretch">
          <div className="order-1 lg:order-none">
            <div className="grid grid-cols-[2.75rem_1fr] items-baseline gap-x-3 md:grid-cols-[5rem_1fr]">
              <span className="font-plex tabular text-lg md:text-2xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 id={`site-${demo.slug}`} className="font-wide text-display-md text-balance">
                {demo.brand}
              </h3>
            </div>

            <ul className="mt-4 flex flex-wrap gap-1.5 md:ml-[calc(5rem+0.75rem)] md:mt-6">
              {[demo.domain[locale], ...demo.stack.filter((s) => s !== demo.domain.en)].map((tag, k) => (
                <li
                  key={tag}
                  // stack names are English: keep Turkish casing (i -> İ) off them
                  lang={k === 0 ? undefined : "en"}
                  className={cn(
                    "ui rounded-full border px-3 py-1.5 text-[11px]",
                    light ? "border-carbon/60" : "border-paper/45"
                  )}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-3 flex flex-1 flex-col justify-end md:ml-[calc(5rem+0.75rem)] lg:order-none lg:mt-10">
            <p className="font-wide max-w-[30ch] text-lg leading-[1.3] tracking-[-0.01em] text-balance">
              {demo.tagline[locale]}
            </p>
            <p
              className={cn(
                "font-plex mt-5 max-w-[54ch] text-[15px] leading-[1.7] text-pretty",
                light ? "text-carbon/80" : "text-paper/75"
              )}
            >
              {demo.blurb[locale]}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <SplitButton tone={light ? "dark" : "light"} href={demo.url ?? demo.route} external={!!demo.url}>
                {t.services.open} {demo.brand}
              </SplitButton>
              <span className="ui tabular opacity-55">
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* visual column — the live build sits in a dashed frame */}
        <div className="order-2 -mx-4 md:mx-0 lg:order-none lg:col-span-8">
          <div
            className={cn(
              "frame-dashed p-1 md:p-2",
              light ? "text-carbon" : "text-paper"
            )}
          >
            <WebVisual demo={demo} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* scrolling inside the preview only makes sense with a mouse/trackpad — on
   touch it would trap the page scroll, so touch visitors opt in per frame */
function useFinePointer() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
}

const VIEW_COPY = {
  mobile: { en: "Mobile", tr: "Mobil" },
  desktop: { en: "Desktop", tr: "Masaüstü" },
  explore: { en: "Tap to explore", tr: "Dokun ve gez" },
  done: { en: "Done", tr: "Bitti" },
} as const;

type View = "mobile" | "desktop";

/* every screen opens on the 1440 desktop design; phones can flip the same live
   site to its 390px mobile layout with the toggle. */
const VIEWS: Record<View, { w: number; h: number; aspect: string }> = {
  mobile: { w: 390, h: 640, aspect: "aspect-[390/640]" },
  // 16:10 = the 1440×900 design resolution, so the site fits uncropped
  desktop: { w: 1440, h: 900, aspect: "aspect-[16/10]" },
};

function WebVisual({ demo }: { demo: Demo }) {
  const { locale } = useLanguage();
  const fine = useFinePointer();
  const narrow = useMedia("(max-width: 767px)");
  const [picked, setPicked] = useState<View | null>(null);
  const [engaged, setEngaged] = useState(false);
  const view: View = narrow ? (picked ?? "desktop") : "desktop";
  const v = VIEWS[view];
  const interactive = fine || engaged;

  return (
    <div className="group relative flex flex-col overflow-hidden bg-carbon">
      <div className="flex items-center gap-3 border-b border-paper/10 px-3 py-2">
        <Link
          href={demo.url ?? demo.route}
          {...(demo.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex min-w-0 flex-1 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-volt"
          aria-label={`${demo.brand} — ${demo.tagline.en}`}
        >
          <span className="flex shrink-0 gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-paper/20" />
            <span className="h-2 w-2 rounded-full bg-paper/20" />
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: demo.accent }} />
          </span>
          <span className="font-plex truncate text-[11px] text-paper/55">{domainFor(demo)}</span>
        </Link>
        {narrow ? (
          /* viewport switch — same live site, re-laid out at the other width */
          <div role="group" aria-label="Viewport" className="flex shrink-0 border border-paper/20">
            {(["desktop", "mobile"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={view === k}
                onClick={() => setPicked(k)}
                className={cn(
                  "ui h-7 px-2.5 text-[10px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-volt",
                  view === k ? "bg-paper text-carbon" : "text-paper/60"
                )}
              >
                {VIEW_COPY[k][locale]}
              </button>
            ))}
          </div>
        ) : (
          <span className="ui ml-auto flex items-center gap-1.5 text-[10px] text-paper/55">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-volt" aria-hidden />
            LIVE
          </span>
        )}
      </div>
      <div className={cn("relative w-full transition-[aspect-ratio] duration-500", v.aspect)} data-lenis-prevent>
        <LivePreview
          src={demo.route}
          title={demo.brand}
          accent={demo.accent}
          rootMargin="700px 0px"
          baseWidth={v.w}
          baseHeight={v.h}
          interactive={interactive}
        />
        {!fine &&
          (engaged ? (
            <button
              type="button"
              onClick={() => setEngaged(false)}
              className="ui absolute right-3 top-3 z-20 flex h-9 items-center gap-2 bg-paper px-3 text-carbon shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] active:scale-[0.98]"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              {VIEW_COPY.done[locale]}
            </button>
          ) : (
            /* the whole frame is the opt-in target; the pill just labels it */
            <button
              type="button"
              onClick={() => setEngaged(true)}
              aria-label={`${VIEW_COPY.explore[locale]}: ${demo.brand}`}
              className="absolute inset-0 z-20 flex items-end justify-center bg-gradient-to-t from-carbon/70 via-transparent to-transparent pb-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-volt"
            >
              <span className="ui flex h-10 items-center gap-2 bg-paper px-4 text-carbon">
                <Hand className="h-3.5 w-3.5" strokeWidth={1.5} />
                {VIEW_COPY.explore[locale]}
              </span>
            </button>
          ))}
        {fine && (
          <Link
            href={demo.url ?? demo.route}
            {...(demo.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            tabIndex={-1}
            className="ui absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-paper px-3 py-2 text-carbon opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            {demo.brand}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
