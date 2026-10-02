"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MOBILE_DEMOS } from "@/lib/demos";
import { useLanguage } from "@/lib/i18n/context";
import { useWheelScroll } from "@/lib/useWheelScroll";
import { useMedia } from "@/lib/useMedia";
import { PhoneFrame } from "@/components/primitives/PhoneFrame";
import { LivePreview } from "@/components/showcase/LivePreview";
import { Kicker } from "@/components/primitives/SplitButton";
import { ChipOverlay, PHONE_DEPTH, PhoneBack, PhoneEdge, chipOutro } from "@/components/transition/ChipTransition";
import { cn } from "@/lib/utils";

type MobileDemo = (typeof MOBILE_DEMOS)[number];

export function MobileShowcase() {
  const { t, locale } = useLanguage();
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // The pinned phone wheel is a desktop effect; phones and reduced motion fall
  // back to a plain vertical list so touch scrolling stays native.
  const stacked = !useMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");

  // after the last phone the pin keeps going: it turns over and hands off to Systems
  const jump = useWheelScroll(wrap, MOBILE_DEMOS.length, !stacked, setActive, chipOutro);
  const current = MOBILE_DEMOS[active] ?? MOBILE_DEMOS[0];
  const lastIndex = MOBILE_DEMOS.length - 1;

  return (
    <section id="mobile" data-prism="mobile" className="relative text-paper">
      {/* header */}
      <div className="mx-auto max-w-[1680px] px-4 pt-6 md:px-10 md:pt-8 lg:px-[8.5vw]">
        <Kicker className="mb-6">{t.mobile.label}</Kicker>
        {/* sized so "Mobil uygulamalar" stays on one line at every width */}
        <h2 className="font-wide whitespace-nowrap text-[clamp(1.35rem,5.4vw,5.6rem)]">{t.mobile.title}</h2>
      </div>

      {stacked ? (
        /* mobile + reduced motion — plain vertical list, copy above each phone */
        <div className="mx-auto flex max-w-[1400px] flex-col gap-20 px-4 pb-24 pt-10 md:gap-24 md:px-10">
          {MOBILE_DEMOS.map((demo, i) => (
            <div key={demo.slug} className="flex flex-col items-center gap-10 text-center">
              <Copy demo={demo} i={i} locale={locale} label={t.mobile.open} />
              <div className="w-full max-w-[300px]">
                <Phone demo={demo} />
              </div>
            </div>
          ))}
        </div>
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
                  <Copy demo={demo} i={i} locale={locale} label={t.mobile.open} compact />
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
      <LivePreview
        src={demo.route}
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
  i,
  locale,
  label,
  compact,
}: {
  demo: MobileDemo;
  i: number;
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
      <div className={cn("flex items-center gap-5", compact ? "mt-5" : "mt-8")}>
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
        <span className="ui tabular text-paper/45">
          {String(i + 1).padStart(2, "0")} / {String(MOBILE_DEMOS.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
