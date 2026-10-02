"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/* Font + token shorthands (full class strings so Tailwind can scan them). */
export const FD = "font-[family-name:var(--font-vn-display)]";
export const FS = "font-[family-name:var(--font-vn-sans)]";
export const FM = "font-[family-name:var(--font-vn-mono)]";

export const EASE = [0.32, 0.72, 0, 1] as const;

/** Scroll entry: heavy fade-up. Transform + opacity only, iframe-safe. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? motion.li : as === "section" ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

export function Eyebrow({
  children,
  tone = "violet",
}: {
  children: ReactNode;
  tone?: "violet" | "teal" | "yellow";
}) {
  const dot =
    tone === "teal"
      ? "bg-[var(--vn-teal)]"
      : tone === "yellow"
        ? "bg-[var(--vn-yellow)]"
        : "bg-[var(--vn-violet)]";
  return (
    <span
      className={`${FM} inline-flex items-center gap-2 rounded-full border border-[var(--vn-line)] bg-[var(--vn-cream)]/[0.03] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-[var(--vn-muted)]`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  eyebrowTone,
  title,
  body,
  className = "",
}: {
  eyebrow?: string;
  eyebrowTone?: "violet" | "teal" | "yellow";
  title: ReactNode;
  body?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>}
      <h2
        className={`${FD} mt-5 text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--vn-cream)] [text-wrap:balance] sm:text-6xl`}
      >
        {title}
      </h2>
      {body && (
        <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-[var(--vn-muted)] [text-wrap:pretty]">
          {body}
        </p>
      )}
    </Reveal>
  );
}

/** Pill CTA with nested icon island. */
export function PillCta({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-medium transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vn-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--vn-bg)]";
  const look =
    variant === "primary"
      ? "bg-[var(--vn-cream)] text-[var(--vn-ink)] hover:bg-white"
      : "bg-[var(--vn-cream)]/[0.06] text-[var(--vn-cream)] ring-1 ring-[var(--vn-line)] hover:bg-[var(--vn-cream)]/[0.1]";
  const island =
    variant === "primary"
      ? "bg-[var(--vn-ink)] text-[var(--vn-cream)]"
      : "bg-[var(--vn-cream)]/10 text-[var(--vn-cream)]";
  return (
    <a href={href} className={`${base} ${look} ${className}`}>
      <span>{children}</span>
      <span
        className={`grid h-9 w-9 place-items-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[1px] group-hover:translate-x-0.5 group-hover:scale-105 ${island}`}
        aria-hidden
      >
        <ArrowUpRight size={16} strokeWidth={1.75} />
      </span>
    </a>
  );
}

/** Double-bezel shell: hairline tray + inner core with concentric radius. */
export function Bezel({
  children,
  className = "",
  core = "",
}: {
  children: ReactNode;
  className?: string;
  core?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] bg-[var(--vn-cream)]/[0.025] p-1.5 ring-1 ring-[var(--vn-line)] ${className}`}
    >
      <div
        className={`h-full rounded-[calc(2rem-0.375rem)] bg-[var(--vn-surface)] shadow-[inset_0_1px_0_rgba(244,239,230,0.06)] ${core}`}
      >
        {children}
      </div>
    </div>
  );
}

export function VennLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/demos/venn/venn-logo.png"
      alt="Venn"
      width={64}
      height={64}
      className={`${className} rounded-[28%]`}
    />
  );
}
