"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { MOBILE_DEMOS } from "@/lib/demos";
import { useLanguage } from "@/lib/i18n/context";
import { useWheelScroll } from "@/lib/useWheelScroll";
import { useMedia } from "@/lib/useMedia";
import { PhoneFrame } from "@/components/primitives/PhoneFrame";
import { LivePreview } from "@/components/showcase/LivePreview";
import { ChipOverlay, PHONE_DEPTH, PhoneBack, PhoneEdge, chipOutro } from "@/components/transition/ChipTransition";
import { cn } from "@/lib/utils";

type MobileDemo = (typeof MOBILE_DEMOS)[number];

export function MobileShowcase() {
  const { t, locale } = useLanguage();
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // The pinned phone wheel is a desktop effect; phones and reduced motion get
  // the swipe deck below so touch scrolling stays native.
  const stacked = !useMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");

  // after the last phone the pin keeps going: it turns over and hands off to Systems
  const jump = useWheelScroll(wrap, MOBILE_DEMOS.length, !stacked, setActive, chipOutro);
  const current = MOBILE_DEMOS[active] ?? MOBILE_DEMOS[0];
  const lastIndex = MOBILE_DEMOS.length - 1;

  return (
    <section id="mobile" data-prism="mobile" className="relative text-paper">
      {/* header */}
      <div className="mx-auto max-w-[1680px] px-4 pt-6 md:px-10 md:pt-8 lg:px-[8.5vw]">
        {/* from md up sized so "Mobil uygulamalar" stays on one line; phones let it wrap at section-title scale */}
        <h2 className="font-wide text-center text-[clamp(1.75rem,8.4vw,2.6rem)] md:whitespace-nowrap md:text-[clamp(1.35rem,5.4vw,5.6rem)]">{t.mobile.title}</h2>
      </div>

      {stacked ? (
        /* touch + reduced motion — a native swipe deck instead of the pinned wheel */
        <SwipeDeck locale={locale} label={t.mobile.open} />
      ) : (
        /* pinned phone wheel — copy on top, phones on a half circle below */
        <div ref={wrap} className="relative h-[100dvh] overflow-hidden">
          {/* soft glow in the active app's accent, sitting behind the apex */}
          <div
            aria-hidden
            className="mobile-glow pointer-events-none absolute left-1/2 top-[68%] h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[120px] transition-colors duration-700"
            style={{ backgroundColor: current.accent }}
          />

          <div className="relative mx-auto flex h-full max-w-[1680px] flex-col px-4 pt-[calc(56px+3dvh)] md:px-10 lg:px-[8.5vw]">
            {/* every app's copy sits in the same grid cell; only the active one shows */}
            <div className="mobile-copy grid">
              {MOBILE_DEMOS.map((demo, i) => (
                <div
                  key={demo.slug}
                  inert={i !== active}
                  className={cn(
                    "flex justify-center text-center transition-[opacity,transform] duration-500 ease-out [grid-area:1/1]",
                    i === active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                >
                  <Copy demo={demo} locale={locale} label={t.mobile.open} compact />
                </div>
              ))}
            </div>

            {/* the wheel — useWheelScroll positions each phone along the arc */}
            <div className="wheel-area relative mt-[2.5dvh] flex-1">
              {MOBILE_DEMOS.map((demo, i) => {
                const isLast = i === lastIndex;
                return (
                <div
                  key={demo.slug}
                  className="wheel-phone absolute left-1/2 top-0 w-[clamp(200px,29dvh,340px)]"
                >
                  {/* neighbours fade out through this wrapper during the outro */}
                  <div className={cn(!isLast && "wheel-dim")}>
                  {/* inner wrapper carries the idle bob so it never fights the
                      wheel's GSAP transform on the outer element */}
                  <div className={cn(i === active && "animate-phone-float")}>
                  {/* the last phone gets a rear face; the outro turns this stage over */}
                  <div
                    className={cn(isLast && "flip-stage relative [transform-style:preserve-3d]")}
                    // body depth tracks the phone width set on .wheel-phone above
                    style={isLast ? ({ "--phone-depth": `calc(clamp(200px,29dvh,340px) * ${PHONE_DEPTH})` } as React.CSSProperties) : undefined}
                  >
                  {isLast && <PhoneEdge />}
                  <div
                    className={cn(
                      isLast && "flip-front relative [backface-visibility:hidden] [transform:translateZ(calc(var(--phone-depth)/2))]"
                    )}
                  >
                  {i === active ? (
                    <Link
                      href={demo.route}
                      aria-label={`${t.mobile.open}: ${demo.brand}`}
                      className="block outline-none focus-visible:ring-2 focus-visible:ring-volt"
                    >
                      <Phone demo={demo} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-label={demo.brand}
                      className="block w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-volt"
                    >
                      <Phone demo={demo} />
                    </button>
                  )}
                  </div>
                  {isLast && (
                    <PhoneBack className="flip-back absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(calc(var(--phone-depth)/2))]" />
                  )}
                  </div>
                  </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <ChipOverlay locale={locale} />
        </div>
      )}
    </section>
  );
}

/* ---- pieces shared by both layouts ---- */

function Phone({ demo }: { demo: MobileDemo }) {
  return (
    <PhoneFrame accent={demo.accent} className="max-w-none md:max-w-none">
      {/* embed=1 makes the app reserve room for this frame's status bar + island */}
      <LivePreview
        src={`${demo.route}?embed=1`}
        title={demo.brand}
        accent={demo.accent}
        poster={`/demos/mobile/${demo.slug}.jpg`}
        rootMargin="2000px 0px"
        baseWidth={390}
        baseHeight={844}
      />
    </PhoneFrame>
  );
}

function Copy({
  demo,
  locale,
  label,
  compact,
}: {
  demo: MobileDemo;
  locale: "en" | "tr";
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="flex max-w-2xl flex-col items-center">
      <div className="ui mb-4 flex items-center gap-3 text-paper/60">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: demo.accent }} />
        <span className="tabular">{demo.index}</span>
        <span aria-hidden className="w-10 border-t border-dashed border-paper/40" />
        <span>{demo.domain[locale]}</span>
      </div>
      <h3 className={cn("font-wide", compact ? "text-display-md" : "text-display-lg")}>{demo.brand}</h3>
      <p className="font-plex mt-4 max-w-xl text-base leading-snug text-paper/90">
        {demo.tagline[locale]}
      </p>
      <p
        className={cn(
          "font-plex mt-3 max-w-xl text-sm leading-[1.7] text-paper/60",
          compact && "line-clamp-2 [@media(max-height:900px)]:hidden"
        )}
      >
        {demo.blurb[locale]}
      </p>
      <div className={compact ? "mt-5" : "mt-8"}>
        <Link
          href={demo.route}
          className="group inline-flex items-stretch gap-1 outline-none focus-visible:ring-2 focus-visible:ring-volt"
        >
          <span className="ui flex h-11 items-center bg-paper px-5 text-carbon transition-colors group-hover:bg-white">
            {label}
          </span>
          <span className="flex h-11 w-11 items-center justify-center bg-paper text-carbon transition-colors group-hover:bg-white" aria-hidden>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ---- touch + reduced motion: swipe deck ---- */

const ARC_STEP = 9; // degrees between neighbouring phones on the swipe arc

/**
 * The touch version of the desktop wheel. Phones sit in a native scroll-snap
 * track; as it scrolls, each one is tilted and dropped along a shallow arc by
 * its distance from the centre, so swiping reads like turning the same wheel.
 * The copy above swaps to whichever phone is centred.
 */
function SwipeDeck({ locale, label }: { locale: "en" | "tr"; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const current = MOBILE_DEMOS[active] ?? MOBILE_DEMOS[0];

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-deck-item]"));
    let raf = 0;

    const place = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((item, i) => {
        const w = item.offsetWidth;
        const d = (item.offsetLeft + w / 2 - mid) / (w + 16);
        const ad = Math.min(Math.abs(d), 2);
        const a = (d * ARC_STEP * Math.PI) / 180;
        const r = w * 3.2;
        const face = item.firstElementChild as HTMLElement;
        face.style.transform = `translate3d(0, ${(1 - Math.cos(a)) * r}px, 0) rotate(${d * ARC_STEP}deg) scale(${1 - ad * 0.08})`;
        face.style.opacity = String(1 - ad * 0.28);
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };

    place();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const item = el?.querySelectorAll<HTMLElement>("[data-deck-item]")[i];
    if (!el || !item) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: item.offsetLeft + item.offsetWidth / 2 - el.clientWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div className="relative pb-4 pt-8 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-[70vw] max-h-[520px] w-[70vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-[80px] transition-colors duration-700"
        style={{ backgroundColor: current.accent }}
      />

      {/* every app's copy shares one grid cell; only the centred one shows */}
      <div className="relative grid px-4 md:px-10" aria-live="polite">
        {MOBILE_DEMOS.map((demo, i) => (
          <div
            key={demo.slug}
            inert={i !== active}
            className={cn(
              "flex justify-center text-center transition-[opacity,transform] duration-500 ease-out [grid-area:1/1]",
              i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            )}
          >
            <Copy demo={demo} locale={locale} label={label} compact />
          </div>
        ))}
      </div>

      {/* the deck — native horizontal scroll, snapped to the centre */}
      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        data-lenis-prevent
        className="relative mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-12 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: "calc(50% - min(30vw, 135px))" }}
      >
        {MOBILE_DEMOS.map((demo, i) => (
          <div
            key={demo.slug}
            data-deck-item
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${MOBILE_DEMOS.length}: ${demo.brand}`}
            className="w-[min(60vw,270px)] shrink-0 snap-center"
          >
            <div className="origin-bottom will-change-transform">
              {i === active ? (
                <Link
                  href={demo.route}
                  aria-label={`${label}: ${demo.brand}`}
                  className="block outline-none focus-visible:ring-2 focus-visible:ring-volt"
                >
                  <Phone demo={demo} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={demo.brand}
                  className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-volt"
                >
                  <Phone demo={demo} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* pager — prev / segment per app / next */}
      <div className="relative mx-auto flex max-w-[420px] items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => go(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-paper/25 text-paper outline-none transition-[opacity,transform] focus-visible:ring-2 focus-visible:ring-volt active:scale-[0.96] disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <div className="flex flex-1 gap-1.5">
          {MOBILE_DEMOS.map((demo, i) => (
            <button
              key={demo.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={demo.brand}
              aria-current={i === active ? "true" : undefined}
              className="group flex h-11 flex-1 items-center outline-none focus-visible:ring-2 focus-visible:ring-volt"
            >
              <span
                className="h-[3px] w-full transition-colors duration-500"
                style={{ backgroundColor: i === active ? demo.accent : "rgb(244 244 239 / 0.18)" }}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(Math.min(MOBILE_DEMOS.length - 1, active + 1))}
          disabled={active === MOBILE_DEMOS.length - 1}
          aria-label="Next"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-paper/25 text-paper outline-none transition-[opacity,transform] focus-visible:ring-2 focus-visible:ring-volt active:scale-[0.96] disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
