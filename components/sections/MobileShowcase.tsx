"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MOBILE_DEMOS } from "@/lib/demos";
import { useLanguage } from "@/lib/i18n/context";
import { useStackScroll } from "@/lib/useStackScroll";
import { PhoneFrame } from "@/components/primitives/PhoneFrame";
import { LivePreview } from "@/components/showcase/LivePreview";
import { SectionLabel } from "@/components/primitives/SectionLabel";
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
    <section id="mobile" className="relative border-t border-line">
      {/* header */}
      <div className="mx-auto max-w-[1600px] px-5 pb-6 pt-24 md:px-10 md:pt-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-6">{t.mobile.label}</SectionLabel>
            <h2 className="font-display text-giant text-paper">
              {t.mobile.title}
            </h2>
          </div>
          <p className="max-w-xs font-mono text-xs leading-relaxed text-ash md:pb-3">
            {t.mobile.subtitle}
          </p>
        </div>
      </div>

      {stacked ? (
        /* mobile + reduced motion — plain vertical list, no scroll hijack */
        <div className="mx-auto flex max-w-[1400px] flex-col gap-20 px-5 pb-24 md:gap-24 md:px-10">
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
          <div className="mx-auto grid h-full max-w-[1400px] items-center gap-8 px-5 md:grid-cols-2 md:gap-16 md:px-10">
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
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-sm text-acid">{demo.index}</span>
        <span className="dotted h-[2px] w-16" />
        <span className="label">{demo.domain[locale]}</span>
      </div>
      <h3 className="font-display text-giant leading-[0.9] text-paper">
        {demo.brand}
      </h3>
      <p className="mt-5 max-w-md text-lg leading-snug text-bone">
        {demo.tagline[locale]}
      </p>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ash">
        {demo.blurb[locale]}
      </p>
      <div className="mt-6 flex items-center gap-4">
        <Link
          href={demo.route}
          className="group flex items-center gap-3 border-2 border-paper/25 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:border-acid hover:text-acid"
        >
          {label}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </Link>
        <span className="font-mono text-xs text-dim">
          {String(i + 1).padStart(2, "0")} / 0{MOBILE_DEMOS.length}
        </span>
      </div>
    </div>
  );
}
