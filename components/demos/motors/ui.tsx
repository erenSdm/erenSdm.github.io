"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";

// Slow, weighty cinematic easing.
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DISPLAY = "font-[family-name:var(--font-apx-display)]";
export const MONO = "font-[family-name:var(--font-apx-mono)]";

/* ───────────────────────────── Mono spec label ───────────────────────────── */
export function Label({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span
      className={clsx(
        MONO,
        "text-[10.5px] uppercase leading-none tracking-[0.28em]",
        accent ? "text-[#ffb800]" : "text-ash",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ───────────────────────────── Scroll reveal ───────────────────────────── */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────────────── Count-up figure ─────────────────────────────
   Client, reduced-motion safe, cleans up its rAF. Fires when in view. */
export function CountUp({
  value,
  decimals = 0,
  durationMs = 1600,
  className,
}: {
  value: number;
  decimals?: number;
  durationMs?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;

    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / durationMs, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, durationMs]);

  const text = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

/* ─────────────────────────── Grain + vignette ───────────────────────────
   Fixed cinematic overlay: soft vignette + fine film grain. */
export function GrainVignette() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 22%, transparent 42%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[56] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </>
  );
}

/* ───────────────────────────── Thin rule ───────────────────────────── */
export function Rule({ className }: { className?: string }) {
  return <div className={clsx("h-px w-full bg-line", className)} />;
}
