"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ *
 * RICHCASE — shared tokens + primitives
 * Brand: gold #D4AF37 (the "R") + silver #C0C0C0 (the "C") on ink.
 * ------------------------------------------------------------------ */

export const GOLD = "#D4AF37";
export const GOLD_HI = "#E6C75A";
export const SILVER = "#C0C0C0";
export const UP = "#4ADE80";

export const fDisplay = "font-[family-name:var(--font-rc-display)]";
export const fSerif = "font-[family-name:var(--font-rc-serif)]";
export const fBody = "font-[family-name:var(--font-rc-body)]";
export const fMono = "font-[family-name:var(--font-rc-mono)]";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Wordmark: "Rich" in gold, "Case" in silver — same split as the brand logo. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`${fDisplay} font-extrabold tracking-[-0.03em] ${className}`}
      style={{ fontStretch: "112%" }}
    >
      <span style={{ color: GOLD_HI }}>Rich</span>
      <span style={{ color: SILVER }}>Case</span>
    </span>
  );
}

/** Fade-up on enter. Respects reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Small eyebrow tag. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className={`${fMono} inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-[#bdbdbd]`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
      {children}
    </span>
  );
}

/** Double-bezel shell: hairline tray + inner core. */
export function Bezel({
  children,
  className = "",
  inner = "",
}: {
  children: ReactNode;
  className?: string;
  inner?: string;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-white/[0.07] bg-white/[0.025] p-1.5 ${className}`}
    >
      <div
        className={`h-full rounded-[calc(1.75rem-0.375rem)] bg-[#0f0f10] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${inner}`}
      >
        {children}
      </div>
    </div>
  );
}

/** Primary pill CTA with nested icon island. */
export function PrimaryCta({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${fBody} group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-semibold text-[#0a0a0a] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6C75A] ${className}`}
      style={{
        background: `linear-gradient(180deg, ${GOLD_HI} 0%, ${GOLD} 100%)`,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 30px -12px rgba(212,175,55,0.55)",
      }}
    >
      {children}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a]/90 text-[#E6C75A] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px] group-hover:scale-105">
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
      </span>
    </a>
  );
}

export function GhostCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`${fBody} inline-flex items-center rounded-full border border-white/12 px-5 py-3 text-[15px] font-medium text-[#d4d4d4] transition-colors duration-300 hover:border-[#D4AF37]/50 hover:text-[#E6C75A] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6C75A]`}
    >
      {children}
    </a>
  );
}

/** Numeric formatting in the source's style (en-US separators, 2 decimals). */
export function usd(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
