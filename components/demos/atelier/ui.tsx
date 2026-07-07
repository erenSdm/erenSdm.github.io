"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";

/* Slow, couture easing. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---------------------------------------------------------------- Reveal */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
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
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------- ParallaxImage */
export function ParallaxImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  amount = 46,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={clsx("overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={reduce ? undefined : { y, scale: 1.14 }}
        className={clsx("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}

/* ------------------------------------------------------------- Eyebrow */
export function Eyebrow({
  children,
  className,
  tone = "taupe",
}: {
  children: ReactNode;
  className?: string;
  tone?: "taupe" | "gold" | "bone";
}) {
  const color =
    tone === "gold"
      ? "text-[#9A7B44]"
      : tone === "bone"
        ? "text-[#C9BFA9]"
        : "text-[#8A7E6E]";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-3 font-[family-name:var(--font-sev-mono)] text-[11px] uppercase leading-none tracking-[0.34em]",
        color,
        className,
      )}
    >
      <span className="inline-block h-px w-6 bg-current opacity-50" aria-hidden />
      {children}
    </span>
  );
}

/* --------------------------------------------------------- PlateTag */
export function PlateTag({
  index,
  label,
  tone = "ink",
}: {
  index: string;
  label: string;
  tone?: "ink" | "bone";
}) {
  const ink = tone === "ink";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-3 font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase tracking-[0.28em]",
        ink ? "text-[#6F6456]" : "text-[#C9BFA9]",
      )}
    >
      <span className="text-[#9A7B44]">Planche&nbsp;{index}</span>
      <span aria-hidden className="opacity-40">
        /
      </span>
      <span>{label}</span>
    </span>
  );
}

/* -------------------------------------------------------- ArrowButton */
export function ArrowButton({
  children,
  href = "#",
  variant = "solid",
  className,
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "bone";
  className?: string;
  ariaLabel?: string;
}) {
  const solid = variant === "solid";
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={clsx(
        "group inline-flex items-center gap-4 rounded-full py-2 pl-7 pr-2 text-[12px] uppercase tracking-[0.2em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B44] focus-visible:ring-offset-2",
        solid
          ? "bg-[#1A1512] text-[#F4F1EA] focus-visible:ring-offset-[#F4F1EA]"
          : "bg-[#F4F1EA] text-[#1A1512] focus-visible:ring-offset-[#1A1512]",
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]",
          "bg-[#E7C98A] text-[#1A1512]",
        )}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
      </span>
    </a>
  );
}

/* ------------------------------------------------------------- FilmGrain */
export function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.045] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "170px 170px",
      }}
    />
  );
}
