"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { type Demo, ALL_DEMOS } from "@/lib/demos";
import { DISCIPLINE_ORDER, demosFor, type DisciplineKey } from "@/lib/disciplines";
import { LivePreview } from "@/components/showcase/LivePreview";
import { PhoneFrame } from "@/components/primitives/PhoneFrame";
import { SplitButton, Kicker } from "@/components/primitives/SplitButton";
import { scrollToId, cn } from "@/lib/utils";

const NAV_H = 56; // fixed header height (h-14)
const STACK_STEP = 14; // px each stacked card peeks below the previous one

function domainFor(demo: Demo) {
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

      <div className="flex w-full flex-col gap-6 px-2 pb-24 md:px-3 lg:gap-0 lg:pb-[30vh]">
        {DISCIPLINE_ORDER.map((key, i) => (
          <ServiceCard key={key} k={key} i={i} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ k, i }: { k: DisciplineKey; i: number }) {
  const { t, locale } = useLanguage();
  const copy = t.services.items[k];
  const demos = demosFor(k);
  const [sel, setSel] = useState(0);
  const current = demos[Math.min(sel, demos.length - 1)];
  const light = i % 2 === 1;
  const isSystems = k === "systems";
  const isMobile = k === "mobile";

  return (
    <article
      data-prism-step={i}
      aria-labelledby={`svc-${k}`}
      className="lg:sticky"
      style={{ top: NAV_H + 12 + i * STACK_STEP }}
    >
      <div
        className={cn(
          "grid gap-10 border border-dashed px-4 py-8 md:px-8 md:py-10 lg:min-h-[calc(100dvh-8.5rem)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:py-8",
          light
            ? "border-carbon/25 bg-mist text-carbon"
            : "border-paper/20 bg-graphite text-paper",
          "lg:mb-[14vh] lg:last:mb-0"
        )}
      >
        {/* copy column */}
        <div className="flex flex-col lg:col-span-4 lg:self-stretch">
          <div className="grid grid-cols-[3.25rem_1fr] items-baseline gap-x-3 md:grid-cols-[5rem_1fr]">
            <span className="font-plex tabular text-xl md:text-2xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 id={`svc-${k}`} className="font-wide text-display-md text-balance">
              {copy.title}
            </h3>
          </div>

          <ul className="mt-6 flex flex-wrap gap-1.5 md:ml-[calc(5rem+0.75rem)] ml-[calc(3.25rem+0.75rem)]">
            {copy.tags.map((tag) => (
              <li
                key={tag}
                className={cn(
                  "ui rounded-full border px-3 py-1.5 text-[11px]",
                  light ? "border-carbon/60" : "border-paper/45"
                )}
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-1 flex-col justify-end md:ml-[calc(5rem+0.75rem)]">
            <p
              className={cn(
                "font-plex max-w-[54ch] text-[15px] leading-[1.7] text-pretty",
                light ? "text-carbon/80" : "text-paper/75"
              )}
            >
              {copy.body}
            </p>

            {!isSystems && demos.length > 0 && (
              <ul
                className={cn(
                  "mt-8 border-t border-dashed",
                  light ? "border-carbon/30" : "border-paper/25"
                )}
                aria-label={copy.title}
              >
                {demos.map((d, di) => {
                  const on = d.slug === current?.slug;
                  return (
                    <li
                      key={d.slug}
                      className={cn(
                        "border-b border-dashed",
                        light ? "border-carbon/30" : "border-paper/25"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSel(di)}
                        aria-pressed={on}
                        className={cn(
                          "group flex w-full items-center gap-4 py-3 text-left transition-opacity",
                          on ? "opacity-100" : "opacity-55 hover:opacity-100"
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                            on ? "bg-volt" : light ? "bg-carbon/25" : "bg-paper/25",
                            on && light && "shadow-[0_0_0_1px_rgba(12,13,11,0.35)]"
                          )}
                        />
                        <span className="ui tabular w-10 shrink-0 opacity-60">{d.index}</span>
                        <span className="font-wide text-sm tracking-[-0.01em]">{d.brand}</span>
                        <span className="ui ml-auto hidden truncate opacity-60 sm:block">
                          {d.domain[locale]}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isSystems ? (
                <SplitButton tone={light ? "dark" : "light"} onClick={() => scrollToId("work", -56)}>
                  {copy.cta}
                </SplitButton>
              ) : current ? (
                <SplitButton tone={light ? "dark" : "light"} href={current.route}>
                  {t.services.open} {current.brand}
                </SplitButton>
              ) : null}
              <span className="ui tabular opacity-55">
                {String(demos.length).padStart(2, "0")} {t.services.builds}
              </span>
            </div>
          </div>
        </div>

        {/* visual column — the live build sits in a dashed frame */}
        <div className="lg:col-span-8">
          <div
            className={cn(
              "frame-dashed p-1.5 md:p-2",
              light ? "text-carbon" : "text-paper"
            )}
          >
            {isSystems ? (
              <SystemsBoard light={light} />
            ) : isMobile ? (
              <MobileVisual demos={demos} current={current} />
            ) : current ? (
              <WebVisual demo={current} />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

/* scrolling inside the preview only makes sense with a mouse/trackpad — on
   touch it would trap the page scroll */
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

function WebVisual({ demo }: { demo: Demo }) {
  const fine = useFinePointer();
  return (
    <div className="group relative flex flex-col overflow-hidden bg-carbon">
      <Link
        href={demo.route}
        className="flex items-center gap-3 border-b border-paper/10 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-volt"
        aria-label={`${demo.brand} — ${demo.tagline.en}`}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: demo.accent }} />
        </span>
        <span className="font-plex truncate text-[11px] text-paper/55">{domainFor(demo)}</span>
        <span className="ui ml-auto flex items-center gap-1.5 text-[10px] text-paper/55">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-volt" aria-hidden />
          LIVE
        </span>
      </Link>
      {/* 16:10 = the 1440×900 design resolution, so the site fits uncropped */}
      <div className="relative aspect-[16/10] w-full" data-lenis-prevent>
        <LivePreview
          key={demo.slug}
          src={demo.route}
          title={demo.brand}
          accent={demo.accent}
          rootMargin="700px 0px"
          interactive={fine}
        />
        <Link
          href={demo.route}
          tabIndex={-1}
          className="ui absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-paper px-3 py-2 text-carbon opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          {demo.brand}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}

function MobileVisual({ demos, current }: { demos: Demo[]; current?: Demo }) {
  if (!current) return null;
  const idx = demos.findIndex((d) => d.slug === current.slug);
  const next = demos.length > 1 ? demos[(idx + 1) % demos.length] : undefined;
  return (
    <div className="relative flex h-full min-h-[460px] items-center justify-center gap-6 overflow-hidden bg-carbon px-4 py-8 md:gap-10">
      <span
        aria-hidden
        className="font-wide pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(4rem,12vw,11rem)] leading-none text-paper/[0.05]"
      >
        {current.brand}
      </span>
      {[current, next].map((d, n) =>
        d ? (
          <Link
            key={d.slug + n}
            href={d.route}
            aria-label={d.brand}
            className={cn(
              "relative w-[62%] max-w-[260px] outline-none focus-visible:ring-2 focus-visible:ring-volt sm:w-[44%]",
              n === 1 && "hidden translate-y-8 opacity-70 sm:block"
            )}
          >
            <PhoneFrame accent={d.accent} className="max-w-none md:max-w-none">
              <LivePreview
                key={d.slug}
                src={d.route}
                title={d.brand}
                accent={d.accent}
                baseWidth={390}
                baseHeight={844}
                rootMargin="700px 0px"
              />
            </PhoneFrame>
          </Link>
        ) : null
      )}
    </div>
  );
}

function SystemsBoard({ light }: { light: boolean }) {
  const { t } = useLanguage();
  return (
    <div className={cn("flex h-full flex-col gap-1.5", light ? "text-carbon" : "text-paper")}>
      <div className="grid grid-cols-[1.3fr_1fr] gap-1.5">
        <div className="flex aspect-[4/3] flex-col justify-between bg-carbon p-4 text-paper md:p-6">
          <span className="ui text-paper/50">Display — Lexend Exa</span>
          <span className="font-wide text-[clamp(3.5rem,9vw,8rem)] leading-none">Aa</span>
        </div>
        <div className="flex aspect-[3/4] flex-col justify-between bg-volt p-4 text-carbon md:aspect-auto md:p-6">
          <span className="ui opacity-60">Text — IBM Plex Mono</span>
          <span className="font-plex text-[clamp(1.6rem,4vw,3.4rem)] leading-none">Aa</span>
          <span className="font-plex text-[11px] leading-snug opacity-70">
            0123456789
            <br />
            ×→* |ÇĞİÖŞÜ|
          </span>
        </div>
      </div>
      <ul className="grid flex-1 grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5">
        {ALL_DEMOS.map((d) => (
          <li key={d.slug}>
            <Link
              href={d.route}
              className="group flex aspect-square flex-col justify-between p-2.5 outline-none transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-volt md:p-3"
              style={{ backgroundColor: d.accent }}
              aria-label={d.brand}
            >
              <span className="ui text-[10px] text-black/55">{d.index}</span>
              <span className="font-wide truncate text-[11px] text-black/85 md:text-xs">{d.brand}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="ui px-1 pt-1 opacity-60">
        {String(ALL_DEMOS.length).padStart(2, "0")} {t.services.systemsCaption}
      </p>
    </div>
  );
}
