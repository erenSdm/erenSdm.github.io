"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";

/* ------------------------------------------------------------------ *
 * COBALT — shared primitives
 * Electric-cyan #22d3ee developer-platform system.
 * Hand-highlighted code tokens, count-up numbers, reveal helper.
 * ------------------------------------------------------------------ */

export const CYAN = "#22d3ee";

/* mono + sans class shorthands (fonts scoped in page.tsx) */
export const mono = "font-[family-name:var(--font-cbt-mono)]";
export const sans = "font-[family-name:var(--font-cbt-sans)]";

/* syntax-highlight palette — tuned for the #050505 substrate */
const SYN = {
  kw: "#c084fc", // keyword / import / export
  fn: "#22d3ee", // function / method
  str: "#86efac", // string
  num: "#fbbf24", // number / boolean
  com: "#52525b", // comment
  pu: "#6b7280", // punctuation
  prop: "#e2e8f0", // identifier / property
  ty: "#5eead4", // type / class
} as const;

type TokProps = { children: ReactNode };
const tok = (color: string) =>
  function Token({ children }: TokProps) {
    return <span style={{ color }}>{children}</span>;
  };

/* code token components */
export const K = tok(SYN.kw); // keyword
export const Fn = tok(SYN.fn); // function
export const Str = tok(SYN.str); // string
export const Num = tok(SYN.num); // number
export const Com = tok(SYN.com); // comment
export const Pu = tok(SYN.pu); // punctuation
export const Prop = tok(SYN.prop); // property/identifier
export const Ty = tok(SYN.ty); // type

/* ---------- scroll reveal ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- count-up number ---------- */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      setValue(to * easeOutExpo(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ---------- copy-to-clipboard button ---------- */
export function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const onCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy code"
      className={`grid h-7 w-7 place-items-center rounded-[5px] border border-line text-ash transition-colors hover:border-[#22d3ee]/40 hover:text-[#22d3ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/60 ${className}`}
    >
      {copied ? (
        <Check size={13} strokeWidth={2.5} className="text-[#22d3ee]" />
      ) : (
        <Copy size={13} strokeWidth={2} />
      )}
    </button>
  );
}

/* ---------- window chrome dots ---------- */
export function TrafficDots() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden>
      <span className="h-2.5 w-2.5 rounded-full border border-white/5 bg-[#2a2a2a]" />
      <span className="h-2.5 w-2.5 rounded-full border border-white/5 bg-[#2a2a2a]" />
      <span className="h-2.5 w-2.5 rounded-full border border-white/5 bg-[#2a2a2a]" />
    </span>
  );
}

/* ---------- code block with line numbers + tabs + copy ---------- */
export type CodeTab = { name: string; active?: boolean };

export function CodeBlock({
  lines,
  copyText,
  tabs,
  meta,
  className = "",
  style,
  numbers = true,
}: {
  lines: ReactNode[];
  copyText: string;
  tabs?: CodeTab[];
  meta?: ReactNode;
  className?: string;
  style?: CSSProperties;
  numbers?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-[#0a0a0b] ${className}`}
      style={style}
    >
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-[#0c0c0e] px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <TrafficDots />
          {tabs && (
            <div className="flex items-center gap-1 overflow-hidden">
              {tabs.map((t) => (
                <span
                  key={t.name}
                  className={`${mono} truncate rounded-[5px] px-2 py-1 text-[11px] ${
                    t.active
                      ? "bg-[#151518] text-paper"
                      : "text-dim"
                  }`}
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {meta}
          <CopyButton text={copyText} />
        </div>
      </div>

      {/* code */}
      <div className="overflow-x-auto">
        <pre className={`${mono} min-w-full py-3.5 text-[12.5px] leading-[1.7]`}>
          <code className="block">
            {lines.map((ln, i) => (
              <span key={i} className="flex px-4">
                {numbers && (
                  <span className="mr-4 w-5 shrink-0 select-none text-right text-dim/70">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1 whitespace-pre text-bone">{ln}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

/* ---------- eyebrow label ---------- */
export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`${mono} inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#22d3ee] ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]" />
      {children}
    </span>
  );
}
