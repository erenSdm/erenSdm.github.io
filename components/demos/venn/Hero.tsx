"use client";

import { motion, useReducedMotion, animate } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { HERO_VENTS, VENT, WAITLIST } from "./data";
import { EASE, FD, FM, PillCta, VennLogo } from "./primitives";

/* ------------------------------------------------------------------ Nav */

export function Nav() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-4 sm:pt-6">
      <nav
        aria-label="Venn"
        className="pointer-events-auto flex w-full max-w-[1180px] items-center justify-between gap-3 rounded-full bg-[var(--vn-bg)]/70 py-1.5 pl-2 pr-1.5 ring-1 ring-[var(--vn-line)] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(244,239,230,0.06)]"
      >
        <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vn-violet)]">
          <VennLogo className="h-8 w-8" />
          <span className={`${FD} text-[19px] font-semibold tracking-[-0.03em] text-[var(--vn-cream)]`}>venn</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {[
            ["Nasıl çalışır", "#nedir"],
            ["Kategoriler", "#kategoriler"],
            ["Güven", "#guven"],
            ["SSS", "#sss"],
          ].map(([l, h]) => (
            <a
              key={h}
              href={h}
              className="rounded-full px-3.5 py-2 text-[14px] text-[var(--vn-muted)] transition-colors duration-300 hover:bg-[var(--vn-cream)]/[0.06] hover:text-[var(--vn-cream)]"
            >
              {l}
            </a>
          ))}
        </div>
        <a
          href="#erken-erisim"
          className="rounded-full bg-[var(--vn-cream)] px-4 py-2 text-[13.5px] font-medium text-[var(--vn-ink)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white active:scale-[0.97]"
        >
          Erken erişim
        </a>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------- LiveBar */

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(to);
      return;
    }
    const c = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    return () => c.stop();
  }, [to, reduce]);
  return <span ref={ref}>0</span>;
}

export function LiveBar({ compact = false }: { compact?: boolean }) {
  const { total, goal } = WAITLIST;
  const pct = Math.round((total / goal) * 100);
  const segments = 40;
  const filled = Math.round((pct / 100) * segments);
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4">
        <span className={`${FM} inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.18em] text-[var(--vn-muted)]`}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--vn-teal)] opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-[var(--vn-teal)]" />
          </span>
          Erken erişim
        </span>
        <div className={`${FD} whitespace-nowrap font-semibold tabular-nums tracking-[-0.04em] text-[var(--vn-cream)] ${compact ? "text-[28px]" : "text-[34px] sm:text-[52px]"} leading-none`}>
          <CountUp to={total} />
          <span className="text-[var(--vn-faint)]"> / {goal.toLocaleString("tr-TR")}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-[3px]" role="progressbar" aria-valuenow={total} aria-valuemin={0} aria-valuemax={goal} aria-label="İlk 1000 doluluk">
        {Array.from({ length: segments }, (_, i) => (
          <motion.span
            key={i}
            className={`h-6 flex-1 rounded-[3px] ${compact ? "h-5" : "h-7"}`}
            style={{
              background:
                i < filled
                  ? `color-mix(in oklab, var(--vn-violet) ${100 - (i / filled) * 70}%, var(--vn-teal))`
                  : "rgba(244,239,230,0.07)",
            }}
            initial={{ scaleY: 0.2, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.015 }}
          />
        ))}
      </div>
      <p className={`mt-3 text-[var(--vn-muted)] ${compact ? "text-[12.5px]" : "text-[14px]"}`}>
        <span className="font-medium text-[var(--vn-cream)] tabular-nums">{(goal - total).toLocaleString("tr-TR")}</span> kişilik erken erişim kontenjanı kaldı. Dolunca uygulama yayına giriyor.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- Hero */

function Marker({ slug, member, i, x, y }: { slug: keyof typeof VENT; member: boolean; i: number; x: number; y: number }) {
  const c = VENT[slug];
  return (
    <motion.span
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, translateX: "-50%", translateY: "-50%" }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.045 }}
    >
      {member && (
        <span
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-30"
          style={{ background: c.color, animationDuration: "2.6s" }}
        />
      )}
      <span
        className="relative block rounded-full ring-2 ring-[var(--vn-bg)]"
        style={{
          width: member ? 16 : 10,
          height: member ? 16 : 10,
          background: c.color,
          boxShadow: `0 0 0 4px color-mix(in oklab, ${c.color} 22%, transparent), 0 0 24px ${c.glow}`,
        }}
      />
    </motion.span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const line = (d: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: "0.5em" } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: EASE, delay: d },
  });

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Istanbul map + vents (same visual language as the mobile app map) */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div
          className="absolute left-[46%] top-1/2 aspect-[2000/692] h-full min-w-full -translate-x-1/2 -translate-y-1/2 md:left-[66%]"
          initial={reduce ? false : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/demos/venn/map.webp" alt="" className="h-full w-full object-cover opacity-90" fetchPriority="high" />
          {HERO_VENTS.map((v, i) => <Marker key={i} {...v} i={i} />)}
        </motion.div>
        {/* scrims */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,var(--vn-bg)_10%,transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--vn-bg)] via-[var(--vn-bg)]/25 to-[var(--vn-bg)]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--vn-bg)]/85 via-[var(--vn-bg)]/30 to-transparent max-md:from-[var(--vn-bg)]/60" />
      </div>

      <Nav />

      <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-end px-5 pb-10 pt-32 sm:px-8 md:pb-16">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <motion.span
              {...line(0.15)}
              className={`${FM} inline-flex items-center gap-2 rounded-full bg-[var(--vn-bg)]/60 whitespace-nowrap px-3 py-1 text-[9.5px] font-medium uppercase tracking-[0.12em] text-[var(--vn-muted)] ring-1 sm:text-[10.5px] sm:tracking-[0.18em] ring-[var(--vn-line)] backdrop-blur-md`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--vn-yellow)]" />
              Grup ve etkinlik odaklı sosyal bağlantı
            </motion.span>
            <h1 className={`${FD} mt-6 text-[clamp(2.9rem,11.5vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-[var(--vn-cream)]`}>
              <motion.span {...line(0.25)} className="block">Canın ne isterse,</motion.span>
              <motion.span {...line(0.38)} className="block">
                <span className="relative inline-block">
                  <span className="relative z-10 italic text-[var(--vn-violet)] [font-variation-settings:'wdth'_90]">birlikte</span>
                  <svg aria-hidden viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -bottom-[0.06em] left-0 h-[0.16em] w-full">
                    <motion.path
                      d="M2 14 C 50 4, 120 4, 198 12"
                      fill="none"
                      stroke="var(--vn-teal)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={reduce ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.1, ease: EASE, delay: 1 }}
                    />
                  </svg>
                </span>{" "}
                yapacak
              </motion.span>
              <motion.span {...line(0.51)} className="block">birileri var.</motion.span>
            </h1>
            <motion.p {...line(0.7)} className="mt-7 max-w-[34ch] text-[17px] leading-relaxed text-[var(--vn-cream)]/80 sm:text-[19px]">
              Kahveden gece yürüyüşüne, workshoptan maça: moduna göre seç, yakınındaki gruba katıl.
            </motion.p>
            <motion.div {...line(0.82)} className="mt-9 flex flex-wrap items-center gap-3">
              <PillCta href="#erken-erisim">İlk 1000 arasına katıl</PillCta>
              <a href="#nedir" className="rounded-full px-5 py-3.5 text-[15px] text-[var(--vn-cream)]/80 underline decoration-[var(--vn-line)] underline-offset-[6px] transition-colors hover:text-[var(--vn-cream)] hover:decoration-[var(--vn-violet)]">
                Nasıl çalışır
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1 }}
            className="rounded-[1.75rem] bg-[var(--vn-cream)]/[0.04] p-1.5 ring-1 ring-[var(--vn-line)] backdrop-blur-xl lg:ml-auto lg:w-full lg:max-w-[420px]"
          >
            <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--vn-bg)]/80 p-5 shadow-[inset_0_1px_0_rgba(244,239,230,0.07)]">
              <span className={`${FM} mb-4 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--vn-cream)]/70`}>
                <MapPin size={13} strokeWidth={1.75} className="text-[var(--vn-yellow)]" />
                İstanbul
              </span>
              <LiveBar compact />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
