"use client";

import { type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { Stock } from "./data";

export const MAGENTA = "#ff2e88";
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------ Reveal */
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
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------- Marquee band */
export function Marquee({
  items,
  className,
  sep = "//",
  duration = "34s",
}: {
  items: string[];
  className?: string;
  sep?: string;
  duration?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee whitespace-nowrap"
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-5">{t}</span>
            <span aria-hidden className="opacity-40">
              {sep}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- StockTag */
const STOCK_LABEL: Record<Stock, string> = {
  new: "NEW",
  low: "LOW STOCK",
  sold: "SOLD OUT",
};

export function StockTag({
  stock,
  className,
}: {
  stock: Stock;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-1.5 px-2 py-1 font-[family-name:var(--font-cad-mono)] text-[10px] font-bold uppercase leading-none tracking-[0.14em]";
  if (stock === "new")
    return (
      <span className={clsx(base, "bg-paper text-ink", className)}>
        <Dot className="bg-ink" />
        {STOCK_LABEL.new}
      </span>
    );
  if (stock === "low")
    return (
      <span
        className={clsx(base, "text-ink", className)}
        style={{ background: MAGENTA }}
      >
        <Dot className="animate-blink bg-ink" />
        {STOCK_LABEL.low}
      </span>
    );
  return (
    <span
      className={clsx(
        base,
        "border border-line bg-ink/70 text-ash line-through decoration-1",
        className,
      )}
    >
      {STOCK_LABEL.sold}
    </span>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx("inline-block h-1.5 w-1.5 rounded-full", className)}
    />
  );
}

/* ------------------------------------------------------------- Label */
export function Label({
  children,
  className,
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span
      className={clsx(
        "font-[family-name:var(--font-cad-mono)] text-[10.5px] uppercase leading-none tracking-[0.24em]",
        accent ? "" : "text-ash",
        className,
      )}
      style={accent ? { color: MAGENTA } : undefined}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------- Price */
export function Price({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "font-[family-name:var(--font-cad-mono)] tabular-nums",
        className,
      )}
    >
      €{value.toFixed(0)}
    </span>
  );
}
