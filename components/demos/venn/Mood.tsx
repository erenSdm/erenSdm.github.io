"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Sparkles, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MOODS, VENT } from "./data";
import { EASE, FD, FM, Reveal, Eyebrow } from "./primitives";

const AUTO_MS = 2600;

/** "Bugün canın ne istiyor?" — Venn's signature interactive: pick a mood, get a real nearby meetup. */
export function MoodPlanner() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const mood = MOODS[active]!;
  const c = VENT[mood.slug];

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % MOODS.length), AUTO_MS);
    return () => window.clearInterval(id);
  }, [cycle, reduce, inView]);

  const pick = (i: number) => {
    setActive(i);
    setCycle((n) => n + 1);
  };

  return (
    <section ref={ref} id="nedir" className="relative isolate overflow-hidden py-28 sm:py-40">
      {/* mood wash */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: c.glow }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{
          opacity: 0.32,
          maskImage: "radial-gradient(70% 60% at 70% 40%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 70% 40%, #000 0%, transparent 75%)",
        }}
      />
      <div className="mx-auto grid max-w-[1180px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Moduna göre etkinlik</Eyebrow>
            <h2 className={`${FD} mt-5 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.045em] text-[var(--vn-cream)] [text-wrap:balance] sm:text-[4.4rem]`}>
              Bugün canın ne istiyor?
            </h2>
            <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-[var(--vn-muted)]">
              Bir mod seç, Venn sana yakındaki gerçek bir buluşmayı önersin. Öneri algoritmadan, karar senden.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-10 flex flex-wrap gap-2" role="list">
              {MOODS.map((m, i) => {
                const on = i === active;
                return (
                  <li key={m.key}>
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-pressed={on}
                      className={`relative isolate inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14.5px] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vn-violet)] ${
                        on ? "text-[var(--vn-ink)]" : "text-[var(--vn-cream)]/80 ring-1 ring-[var(--vn-line)] hover:text-[var(--vn-cream)]"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="vn-mood-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-[var(--vn-cream)]"
                          transition={{ type: "spring", stiffness: 260, damping: 30 }}
                        />
                      )}
                      <span className="h-2 w-2 rounded-full" style={{ background: VENT[m.slug].color }} />
                      {m.label}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 h-px w-full max-w-md overflow-hidden bg-[var(--vn-line)]">
              {!reduce && inView && (
                <motion.div
                  key={`${active}-${cycle}`}
                  className="h-full origin-left bg-[var(--vn-cream)]/50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                />
              )}
            </div>
          </Reveal>
        </div>

        {/* Suggestion card */}
        <Reveal delay={0.15} className="lg:pt-6">
          <div className="rounded-[2rem] bg-[var(--vn-cream)]/[0.03] p-1.5 ring-1 ring-[var(--vn-line)]">
            <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[var(--vn-surface)] shadow-[inset_0_1px_0_rgba(244,239,230,0.06)]">
              <div className="flex items-center justify-between border-b border-[var(--vn-line)] px-6 py-4">
                <span className={`${FM} flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-[var(--vn-muted)]`}>
                  <Sparkles size={13} strokeWidth={1.5} /> Sana öneri
                </span>
                <span className={`${FM} text-[10.5px] uppercase tracking-[0.18em] text-[var(--vn-faint)]`}>
                  {String(active + 1).padStart(2, "0")} / {String(MOODS.length).padStart(2, "0")}
                </span>
              </div>
              <div className="relative min-h-[300px] p-6 sm:min-h-[320px] sm:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mood.key}
                    initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-2xl"
                        style={{ background: `color-mix(in oklab, ${c.color} 18%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${c.color} 40%, transparent)` }}
                      >
                        <span className="h-3.5 w-3.5 rounded-full" style={{ background: c.color, boxShadow: `0 0 18px ${c.color}` }} />
                      </span>
                      <div>
                        <span className={`${FM} block text-[10.5px] uppercase tracking-[0.18em]`} style={{ color: c.color }}>
                          {mood.event.tag}
                        </span>
                        <span className="text-[14px] text-[var(--vn-muted)]">{mood.label}</span>
                      </div>
                    </div>
                    <h3 className={`${FD} mt-8 text-[2rem] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--vn-cream)] [text-wrap:balance] sm:text-[2.6rem]`}>
                      {mood.event.title}
                    </h3>
                    <dl className={`${FM} mt-6 grid gap-2 text-[13px] text-[var(--vn-cream)]/75`}>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} strokeWidth={1.5} className="text-[var(--vn-faint)]" />
                        <dt className="sr-only">Yer</dt>
                        <dd>{mood.event.place}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} strokeWidth={1.5} className="text-[var(--vn-faint)]" />
                        <dt className="sr-only">Katılım</dt>
                        <dd>
                          {mood.event.going} kişi gidiyor · {mood.event.time}
                        </dd>
                      </div>
                    </dl>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[var(--vn-line)] px-6 py-4">
                <span className="text-[13px] text-[var(--vn-faint)]">Algoritma önerir, sen seçersin.</span>
                <a href="#erken-erisim" className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--vn-cream)]/[0.07] px-4 py-2 text-[13.5px] text-[var(--vn-cream)] ring-1 ring-[var(--vn-line)] transition-colors hover:bg-[var(--vn-cream)]/[0.12]">
                  Haritada gör
                  <ArrowUpRight size={14} strokeWidth={1.75} className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
