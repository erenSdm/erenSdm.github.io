"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { WEB_DEMOS, type Demo } from "@/lib/demos";
import { useLanguage } from "@/lib/i18n/context";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SafariFrame } from "@/components/primitives/SafariFrame";
import { LivePreview } from "@/components/showcase/LivePreview";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { cn } from "@/lib/utils";

/** brand → clean fake domain for the Safari address bar */
function domainFor(demo: Demo) {
  const name = demo.brand
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "");
  return `${name}.studio`;
}

/** run layout math synchronously on the client, plain effect on the server */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* coverflow geometry ---------------------------------------------------- */
const NEIGHBOR_SCALE = 0.5; // off-centre windows render at half size
const GAP_RATIO = 0.16; // breathing room between windows, share of full width
const SEGMENT = 0.9; // vertical scroll (in viewports) spent per window
type Slide = Demo | { cta: true };

export function WebShowcase() {
  const { t, locale } = useLanguage();
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const step = useRef(0); // px between neighbouring window centres
  const focus = useRef(0); // current fractional focus index (survives refresh)
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  const slides = useMemo<Slide[]>(() => [...WEB_DEMOS, { cta: true }], []);
  const count = slides.length;

  // The pinned coverflow is a desktop experience. On phones we swap in a plain
  // vertical stack (below) and never initialise the scroll hijack, so touch
  // scrolling stays native. `static` == reduced-motion OR small screen.
  const stacked = reduced || mobile;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* position every window as a function of the fractional focus index.
     focus = 3.0 → window 3 centred & full; 3.5 → windows 3 and 4 both
     halfway grown, sliding through centre. */
  const place = useCallback(
    (at: number) => {
      const s = step.current;
      for (let i = 0; i < cards.current.length; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const d = i - at;
        const near = Math.min(Math.max(1 - Math.abs(d), 0), 1);
        const ease = near * near * (3 - 2 * near); // smoothstep
        const scale = NEIGHBOR_SCALE + (1 - NEIGHBOR_SCALE) * ease;
        el.style.transform = `translate(-50%, -50%) translateX(${d * s}px) scale(${scale})`;
        el.style.opacity = String(0.5 + 0.5 * ease);
        el.style.zIndex = String(Math.round(200 - Math.abs(d) * 10));
        el.style.pointerEvents = Math.abs(d) > 1.5 ? "none" : "auto";
      }
    },
    []
  );

  const measure = useCallback(() => {
    const first = cards.current[0];
    if (!first) return;
    const full = first.offsetWidth; // layout width, ignores transform scale
    step.current = full * (0.5 + NEIGHBOR_SCALE * 0.5 + GAP_RATIO);
  }, []);

  /* pin the viewport and translate the rail horizontally with vertical scroll */
  useIsoLayoutEffect(() => {
    if (stacked) return;
    const el = wrap.current;
    if (!el) return;

    measure();
    place(focus.current);

    const ctx = gsap.context(() => {
      trigger.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => "+=" + window.innerHeight * (count - 1) * SEGMENT,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // rest on a centred, enlarged window rather than mid-transition
        snap: {
          snapTo: 1 / (count - 1),
          duration: { min: 0.15, max: 0.45 },
          delay: 0.06,
          ease: "power2.inOut",
        },
        onRefresh: () => {
          measure();
          place(focus.current);
        },
        onUpdate: (self) => {
          const at = self.progress * (count - 1);
          focus.current = at;
          place(at);
          setActive((prev) => {
            const next = Math.round(at);
            return prev === next ? prev : next;
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stacked, count, measure, place]);

  /* smooth-scroll the page so window `i` lands dead centre */
  const goTo = useCallback(
    (i: number) => {
      const st = trigger.current;
      if (!st) return;
      const clamped = Math.min(count - 1, Math.max(0, i));
      const p = count > 1 ? clamped / (count - 1) : 0;
      const target = st.start + p * (st.end - st.start);
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (t: number) => void };
        }
      ).__lenis;
      if (lenis) lenis.scrollTo(target);
      else window.scrollTo({ top: target, behavior: "smooth" });
    },
    [count]
  );

  return (
    <section id="work" className="relative border-t border-line">
      {/* header */}
      <div className="mx-auto max-w-[1600px] px-5 pb-8 pt-24 md:px-10 md:pt-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-6">{t.web.label}</SectionLabel>
            <h2 className="font-display text-giant text-paper">{t.web.title}</h2>
          </div>
          <div className="flex items-center gap-3 md:pb-3">
            <span className="h-2 w-2 animate-blink bg-acid" />
            <p className="font-mono text-xs uppercase tracking-widest text-ash">
              {t.web.subtitle}
            </p>
          </div>
        </div>
      </div>

      {stacked ? (
        /* mobile + reduced motion — plain stacked list, no scroll hijack */
        <div className="mx-auto flex max-w-[1100px] flex-col gap-16 px-5 pb-24 md:gap-20 md:px-10">
          {WEB_DEMOS.map((demo) => (
            <StaticCard
              key={demo.slug}
              demo={demo}
              locale={locale}
              viewLive={t.web.viewLive}
            />
          ))}
        </div>
      ) : (
        /* pinned coverflow rail — vertical scroll drives horizontal motion */
        <div ref={wrap} className="relative h-[100dvh] overflow-hidden pb-16">
          {/* prev / next */}
          <button
            type="button"
            aria-label="Previous site"
            onClick={() => goTo(active - 1)}
            className={cn(
              "absolute left-3 top-1/2 z-[300] hidden -translate-y-1/2 items-center justify-center border border-line bg-ink/80 p-2 text-paper backdrop-blur transition-colors hover:border-acid hover:text-acid md:flex",
              active === 0 && "pointer-events-none opacity-30"
            )}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Next site"
            onClick={() => goTo(active + 1)}
            className={cn(
              "absolute right-3 top-1/2 z-[300] hidden -translate-y-1/2 items-center justify-center border border-line bg-ink/80 p-2 text-paper backdrop-blur transition-colors hover:border-acid hover:text-acid md:flex",
              active === count - 1 && "pointer-events-none opacity-30"
            )}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>

          {/* windows — absolutely centred, transformed every scroll frame */}
          {slides.map((slide, i) => {
            const isActive = i === active;

            if ("cta" in slide) {
              return (
                <div
                  key="cta"
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="absolute left-1/2 top-1/2 flex h-[74vh] w-[94vw] flex-col items-center justify-center will-change-transform sm:w-[74vw] lg:w-[62vw] xl:w-[56vw] md:h-[82vh]"
                >
                  <Link
                    href="#contact"
                    onClick={(e) => {
                      if (!isActive) {
                        e.preventDefault();
                        goTo(i);
                      }
                    }}
                    className="flex flex-col items-center gap-4 text-center"
                  >
                    <span className="font-display text-6xl leading-none text-dim transition-colors hover:text-acid md:text-8xl">
                      NEXT
                      <br />
                      UP?
                    </span>
                  </Link>
                </div>
              );
            }

            const demo = slide;
            return (
              <article
                key={demo.slug}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="group absolute left-1/2 top-1/2 flex h-[74vh] w-[94vw] flex-col will-change-transform sm:w-[74vw] lg:w-[62vw] xl:w-[56vw] md:h-[82vh]"
              >
                {/* meta row */}
                <div className="mb-3 flex items-end justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-acid">
                      {demo.index}
                    </span>
                    <span className="font-display text-xl uppercase text-paper md:text-2xl">
                      {demo.brand}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "label whitespace-nowrap transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {demo.domain[locale]}
                  </span>
                </div>

                {/* live safari window */}
                <Link
                  href={demo.route}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                      goTo(i);
                    }
                  }}
                  className="relative flex-1 overflow-hidden rounded-xl outline-none ring-acid focus-visible:ring-2"
                  aria-label={`${demo.brand} — ${t.web.viewLive}`}
                >
                  <SafariFrame
                    url={domainFor(demo)}
                    accent={demo.accent}
                    active={isActive}
                    className="h-full"
                  >
                    <LivePreview
                      src={demo.route}
                      title={demo.brand}
                      baseWidth={1440}
                      baseHeight={900}
                    />
                  </SafariFrame>

                  {/* hover / active CTA veil */}
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink/90 via-ink/0 to-ink/0 transition-opacity duration-500",
                      "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    )}
                  >
                    <span className="mb-6 flex items-center gap-2 border-2 border-acid bg-acid px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink">
                      {t.web.viewLive}
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </div>
                </Link>

                {/* caption — only the focused window carries copy */}
                <div className="mt-4 flex h-12 items-start justify-between gap-6 overflow-hidden">
                  <p
                    className={cn(
                      "max-w-md text-sm leading-relaxed text-bone transition-opacity duration-300 md:text-base",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {demo.tagline[locale]}
                  </p>
                  <div
                    className={cn(
                      "hidden shrink-0 gap-1.5 transition-opacity duration-300 md:flex",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {demo.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ash"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}

          {/* progress ticks + scroll hint */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[300] flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-[3px] transition-all duration-300",
                    i === active ? "w-7 bg-acid" : "w-3 bg-line"
                  )}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
              {t.web.subtitle}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

/* reduced-motion fallback card ----------------------------------------- */
function StaticCard({
  demo,
  locale,
  viewLive,
}: {
  demo: Demo;
  locale: "en" | "tr";
  viewLive: string;
}) {
  return (
    <article className="flex flex-col">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-acid">{demo.index}</span>
          <span className="font-display text-xl uppercase text-paper md:text-2xl">
            {demo.brand}
          </span>
        </div>
        <span className="label">{demo.domain[locale]}</span>
      </div>
      <Link
        href={demo.route}
        className="group relative block aspect-[16/10] overflow-hidden rounded-xl outline-none ring-acid focus-visible:ring-2"
        aria-label={`${demo.brand} — ${viewLive}`}
      >
        <SafariFrame url={domainFor(demo)} accent={demo.accent} active className="h-full">
          <LivePreview
            src={demo.route}
            title={demo.brand}
            baseWidth={1440}
            baseHeight={900}
          />
        </SafariFrame>
        {/* persistent tap affordance — coverflow shows this on hover, touch has none */}
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 border-2 border-acid bg-acid px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-ink">
          {viewLive}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </Link>
      <div className="mt-4 flex flex-col gap-3">
        <p className="max-w-md text-sm leading-relaxed text-bone md:text-base">
          {demo.tagline[locale]}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {demo.stack.map((s) => (
            <span
              key={s}
              className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ash"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
