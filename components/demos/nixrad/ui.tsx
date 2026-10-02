"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";

export const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

/* Shared tokens — architectural plaster, graphite, ember. */
export const NX = {
  plaster: "#E9E6E0",
  stone: "#DCD7CE",
  ink: "#151514",
  graphite: "#1C1C1B",
  mute: "#6E6A63",
  ember: "#C4622D",
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
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
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.22em]",
        tone === "dark"
          ? "bg-[#151514]/[0.06] text-[#151514]/70 ring-1 ring-[#151514]/10"
          : "bg-white/[0.06] text-white/70 ring-1 ring-white/12",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#C4622D]" />
      {children}
    </span>
  );
}

export function PillButton({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light" | "ember";
  className?: string;
}) {
  const shell =
    tone === "dark"
      ? "bg-[#151514] text-[#E9E6E0]"
      : tone === "ember"
        ? "bg-[#C4622D] text-[#151514]"
        : "bg-[#E9E6E0] text-[#151514]";
  const dot =
    tone === "dark" ? "bg-white/10" : tone === "ember" ? "bg-black/15" : "bg-black/[0.07]";
  return (
    <a
      href={href}
      className={clsx(
        "group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[14px] font-medium tracking-[-0.01em] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
        shell,
        className,
      )}
    >
      {children}
      <span
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[1px] group-hover:translate-x-0.5 group-hover:scale-105",
          dot,
        )}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
      </span>
    </a>
  );
}

/** Thin index label: "01 — Koleksiyon" */
export function SectionIndex({
  n,
  label,
  tone = "dark",
}: {
  n: string;
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between border-t pt-5 font-[family-name:var(--font-nx-mono)] text-[11px] uppercase tracking-[0.2em]",
        tone === "dark" ? "border-[#151514]/15 text-[#151514]/55" : "border-white/15 text-white/50",
      )}
    >
      <span>
        {n} — {label}
      </span>
      <span>Nixrad / 2026</span>
    </div>
  );
}
