"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MOBILE_DEMOS } from "@/lib/demos";
import { useLanguage } from "@/lib/i18n/context";
import { useStackScroll } from "@/lib/useStackScroll";
import { PhoneFrame } from "@/components/primitives/PhoneFrame";
import { LivePreview } from "@/components/showcase/LivePreview";
import { Kicker } from "@/components/primitives/SplitButton";
import { cn } from "@/lib/utils";

export function MobileShowcase() {
  const { t, locale } = useLanguage();
  const wrap = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  // Pinned phone stack is a desktop effect; phones fall back to a plain
  // vertical list so touch scrolling stays native.
  const stacked = reduced || mobile;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useStackScroll(wrap, MOBILE_DEMOS.length, !stacked);

  return (
    <section id="mobile" data-prism="mobile" className="relative text-paper">
      {/* header */}
      <div className="mx-auto max-w-[1680px] px-4 pb-6 pt-24 md:px-10 md:pt-36 lg:px-[8.5vw]">
        <Kicker className="mb-8">{t.mobile.label}</Kicker>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="font-wide text-display-xl">{t.mobile.title}</h2>
          <p className="font-plex max-w-[40ch] text-[15px] leading-[1.7] text-paper/70">
            {t.mobile.subtitle}
          </p>
        </div>
      </div>

      {stacked ? (
        /* mobile + reduced motion — plain vertical list, no scroll hijack */
        <div className="mx-auto flex max-w-[1400px] flex-col gap-20 px-4 pb-24 pt-10 md:gap-24 md:px-10">
          {MOBILE_DEMOS.map((demo, i) => (
            <div
              key={demo.slug}
              className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
            >
              <div className="flex justify-center md:order-2">
                <Phone demo={demo} />
              </div>
              <div className="md:order-1">
                <Copy demo={demo} i={i} locale={locale} label={t.mobile.open} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* pinned phone stack */
        <div ref={wrap} className="relative h-[100dvh] overflow-hidden">
          <div className="mx-auto grid h-full max-w-[1680px] items-center gap-8 px-4 md:grid-cols-2 md:gap-16 md:px-10 lg:px-[8.5vw]">
            {/* copy stack */}
            <div className="relative order-2 md:order-1">
              {MOBILE_DEMOS.map((demo, i) => (
                <div
                  key={demo.slug}
                  className={cn(
                    "stack-text",
                    i === 0 ? "relative" : "absolute inset-x-0 top-0"
                  )}
                >
                  <Copy demo={demo} i={i} locale={locale} label={t.mobile.open} />
                </div>
              ))}
            </div>

            {/* phone stack — extra vertical room on desktop so the enlarged
                phone never clips top/bottom inside the pinned viewport */}
            <div className="relative order-1 h-[52vh] md:order-2 md:h-[86vh]">
              {MOBILE_DEMOS.map((demo) => (
                <div
                  key={demo.slug}
                  className="stack-phone absolute inset-0 flex items-center justify-center"
                >
                  <Phone demo={demo} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---- pieces shared by both layouts ---- */

function Phone({ demo }: { demo: (typeof MOBILE_DEMOS)[number] }) {
  return (
    <PhoneFrame accent={demo.accent}>
      <LivePreview
        src={demo.route}
        title={demo.brand}
        accent={demo.accent}
        rootMargin="800px 0px"
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
}: {
  demo: (typeof MOBILE_DEMOS)[number];
  i: number;
  locale: "en" | "tr";
  label: string;
}) {
  return (
    <div>
      <div className="ui mb-5 flex items-center gap-3 text-paper/60">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-volt" />
        <span className="tabular">{demo.index}</span>
        <span aria-hidden className="w-10 border-t border-dashed border-paper/40" />
        <span>{demo.domain[locale]}</span>
      </div>
      <h3 className="font-wide text-display-lg">{demo.brand}</h3>
      <p className="font-plex mt-6 max-w-md text-base leading-snug text-paper/90">
        {demo.tagline[locale]}
      </p>
      <p className="font-plex mt-4 max-w-md text-sm leading-[1.7] text-paper/60">
        {demo.blurb[locale]}
      </p>
      <div className="mt-8 flex items-center gap-5">
        <Link
          href={demo.route}
          className="group inline-flex items-stretch gap-1 outline-none focus-visible:ring-2 focus-visible:ring-volt"
        >
          <span className="ui flex h-12 items-center bg-paper px-5 text-carbon transition-colors group-hover:bg-white">
            {label}
          </span>
          <span className="flex h-12 w-12 items-center justify-center bg-paper text-carbon transition-colors group-hover:bg-white" aria-hidden>
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
