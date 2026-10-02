"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { BrandMark } from "./Station";
import type { BrandKey } from "./brands";
import { hash01 } from "./lanes";
import type { WidgetKey } from "./types";

export interface WidgetProps {
  live: boolean;
  /** every cue reached so far in this run */
  cues: string[];
  /** cue of the step on screen right now */
  cue?: string;
  run: number;
}

export function Widget({ k, ...p }: WidgetProps & { k: WidgetKey }) {
  if (k === "candles") return <Candles {...p} />;
  if (k === "vectors") return <Vectors {...p} />;
  if (k === "inbox") return <InboxFeed {...p} />;
  return <Stock {...p} />;
}

/* ------------------------------------------------------------------ candles */

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

const N_CANDLES = 16;

function seedCandles(): Candle[] {
  let p = 64120;
  return Array.from({ length: N_CANDLES }, (_, i) => {
    const o = p;
    const c = o + (hash01(`c${i}`) - 0.46) * 90;
    const h = Math.max(o, c) + hash01(`h${i}`) * 34;
    const l = Math.min(o, c) - hash01(`l${i}`) * 34;
    p = c;
    return { o, h, l, c };
  });
}

/** Ticks pile into the last candle until it closes, then a new one opens. */
const Candles = memo(function Candles({ live, cue }: WidgetProps) {
  const reduce = useReducedMotion();
  const [{ cs, ticks }, set] = useState(() => ({ cs: seedCandles(), ticks: 0 }));

  useEffect(() => {
    if (!live || reduce) return;
    const id = window.setInterval(() => {
      set((prev) => {
        const t = prev.ticks + 1;
        const next = prev.cs.slice();
        const last = { ...next[next.length - 1] };
        last.c += (Math.random() - 0.48) * 14;
        last.h = Math.max(last.h, last.c);
        last.l = Math.min(last.l, last.c);
        next[next.length - 1] = last;
        // a candle closes every ~2.6s on screen
        if (t % 20 === 0) return { ticks: t, cs: [...next.slice(1), { o: last.c, h: last.c, l: last.c, c: last.c }] };
        return { ticks: t, cs: next };
      });
    }, 130);
    return () => window.clearInterval(id);
  }, [live, reduce]);

  const lo = Math.min(...cs.map((c) => c.l));
  const hi = Math.max(...cs.map((c) => c.h));
  const y = (v: number) => 4 + (1 - (v - lo) / (hi - lo || 1)) * 64;
  const last = cs[cs.length - 1];
  const flash = cue === "close";

  return (
    <div className="flex h-full flex-col">
      <div className="font-plex flex items-baseline justify-between text-[0.82em] text-paper/45">
        <span>BTCUSDT · 1m</span>
        <span className={cn("tabular", last.c >= last.o ? "text-volt" : "text-hazard")}>
          {last.c.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </span>
      </div>
      <svg viewBox="0 0 200 72" preserveAspectRatio="none" className="mt-1 w-full flex-1" aria-hidden>
        {[18, 36, 54].map((g) => (
          <line key={g} x1="0" x2="200" y1={g} y2={g} stroke="#f4f4ef" strokeOpacity="0.06" vectorEffect="non-scaling-stroke" />
        ))}
        {cs.map((c, i) => {
          const x = 4 + i * 12.2;
          const up = c.c >= c.o;
          const top = y(Math.max(c.o, c.c));
          const bot = y(Math.min(c.o, c.c));
          const isLast = i === cs.length - 1;
          return (
            <g key={i}>
              <line x1={x + 3.5} x2={x + 3.5} y1={y(c.h)} y2={y(c.l)} stroke={up ? "#ccff00" : "#ff3b1f"} strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <rect
                x={x}
                y={top}
                width="7"
                height={Math.max(1, bot - top)}
                fill={up ? "#ccff00" : "#0c0d0b"}
                stroke={up ? "#ccff00" : "#ff3b1f"}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {isLast && flash && (
                <rect x={x - 3} y={2} width="13" height="68" fill="none" stroke="#f4f4ef" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
              )}
            </g>
          );
        })}
      </svg>
      <div className="font-plex flex items-center gap-[0.6em] text-[0.78em] tabular text-paper/40">
        <span>{(ticks * 7 + 2814).toLocaleString("en-US")} ticks</span>
        {/* how full the open candle is */}
        <span aria-hidden className="relative h-[2px] flex-1 bg-paper/10">
          <span className="absolute inset-y-0 left-0 bg-volt/70" style={{ width: `${((ticks % 20) / 19) * 100}%` }} />
        </span>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ vectors */

type P = [number, number];
// rounded so server and client print identical attributes
const r2 = (v: number) => Math.round(v * 100) / 100;
const CLUSTERS: P[] = [
  [42, 46],
  [132, 58],
  [70, 140],
  [160, 150],
  [104, 98],
];
const DOTS: P[] = Array.from({ length: 230 }, (_, i) => {
  const c = CLUSTERS[i % CLUSTERS.length];
  const a = hash01(`a${i}`) * Math.PI * 2;
  const r = Math.pow(hash01(`r${i}`), 0.7) * 30;
  return [r2(c[0] + Math.cos(a) * r), r2(c[1] + Math.sin(a) * r * 0.85)];
});
const NEW_DOTS: P[] = Array.from({ length: 24 }, (_, i) => {
  const a = hash01(`na${i}`) * Math.PI * 2;
  const r = hash01(`nr${i}`) * 16;
  return [r2(176 + Math.cos(a) * r * 0.8), r2(36 + Math.sin(a) * r)];
});
const HIT: P = [138, 62];
const MISS: P = [178, 98];

function nearest(q: P, k: number) {
  return DOTS.map((d, i) => ({ i, d: Math.hypot(d[0] - q[0], d[1] - q[1]) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((x) => x.i);
}

/**
 * The index as a map: every dot is a chunk of a document. A question lands as
 * a point, the closest chunks get pulled in, the best five survive reranking.
 */
const Vectors = memo(function Vectors({ cues, run }: WidgetProps) {
  const reduce = useReducedMotion();
  const miss = cues.includes("miss");
  const q = miss ? MISS : HIT;
  const top = useMemo(() => nearest(q, 24), [q]);
  const best = top.slice(0, 5);
  const showQ = cues.includes("query");
  const showK = cues.includes("topk");
  const showR = cues.includes("rerank");
  const insert = cues.includes("insert");

  return (
    <svg key={run} viewBox="0 0 200 186" className="h-full w-full" aria-hidden>
      {DOTS.map((d, i) => (
        <rect
          key={i}
          x={d[0] - 1.1}
          y={d[1] - 1.1}
          width="2.2"
          height="2.2"
          fill="#f4f4ef"
          opacity={showK && top.includes(i) ? 0.9 : 0.28}
        />
      ))}
      {insert &&
        NEW_DOTS.map((d, i) => (
          <motion.rect
            key={`n${i}`}
            x={d[0] - 1.3}
            y={d[1] - 1.3}
            width="2.6"
            height="2.6"
            fill="#ccff00"
            initial={reduce ? false : { opacity: 0, scale: 3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
          />
        ))}
      {showK &&
        top.map((i, n) => {
          const kept = showR && best.includes(i);
          return (
            <motion.line
              key={`k${i}`}
              x1={q[0]}
              y1={q[1]}
              x2={DOTS[i][0]}
              y2={DOTS[i][1]}
              stroke={miss ? "#ff3b1f" : kept ? "#ccff00" : "#f4f4ef"}
              strokeWidth={kept ? 1.2 : 0.6}
              strokeDasharray={miss ? "2 2" : undefined}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: showR && !kept ? 0.12 : kept ? 1 : 0.45 }}
              transition={{ delay: n * 0.02, duration: 0.5 }}
            />
          );
        })}
      {showR &&
        best.map((i) => (
          <rect key={`b${i}`} x={DOTS[i][0] - 2.4} y={DOTS[i][1] - 2.4} width="4.8" height="4.8" fill={miss ? "#ff3b1f" : "#ccff00"} />
        ))}
      {showQ && (
        <g>
          {!reduce && (
            <motion.circle
              cx={q[0]}
              cy={q[1]}
              fill="none"
              stroke="#ccff00"
              strokeWidth="0.8"
              initial={{ r: 2, opacity: 0.9 }}
              animate={{ r: 34, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <path d={`M${q[0] - 5} ${q[1]} H${q[0] + 5} M${q[0]} ${q[1] - 5} V${q[1] + 5}`} stroke="#ccff00" strokeWidth="1.6" />
        </g>
      )}
      <text x="2" y="183" fill="#f4f4ef" opacity="0.4" fontSize="8" fontFamily="var(--font-plex-mono), monospace">
        48,210 chunks · 1536-d
      </text>
    </svg>
  );
});

/* -------------------------------------------------------------------- inbox */

const POOL: { b: BrandKey; en: string; tr: string }[] = [
  { b: "whatsapp", en: "Is the M size back in stock?", tr: "M beden tekrar gelir mi?" },
  { b: "instagram", en: "Do you ship to Izmir?", tr: "İzmir'e kargo var mı?" },
  { b: "meta", en: "New lead · spring campaign", tr: "Yeni başvuru · bahar kampanyası" },
  { b: "whatsapp", en: "Can I change my address?", tr: "Adresimi değiştirebilir miyim?" },
  { b: "instagram", en: "Price for 3 nights in May?", tr: "Mayısta 3 gece fiyat?" },
  { b: "whatsapp", en: "Where is order #48213?", tr: "#48213 siparişim nerede?" },
  { b: "meta", en: "New lead · budget 40k", tr: "Yeni başvuru · bütçe 40 bin" },
  { b: "instagram", en: "Is this available in black?", tr: "Siyahı var mı?" },
];

/** Live queue of every channel in one list, as the agent sees it. */
const InboxFeed = memo(function InboxFeed({ live }: WidgetProps) {
  const { locale } = useLanguage();
  const reduce = useReducedMotion();
  const [head, setHead] = useState(3);

  useEffect(() => {
    if (!live || reduce) return;
    const id = window.setInterval(() => setHead((h) => h + 1), 2300);
    return () => window.clearInterval(id);
  }, [live, reduce]);

  const rows = [0, 1, 2, 3].map((k) => ({ id: head - k, ...POOL[(head - k) % POOL.length] }));

  return (
    <div className="flex h-full flex-col">
      <ul className="flex flex-1 flex-col gap-[0.35em] overflow-hidden">
        <AnimatePresence initial={false}>
          {rows.map((r, i) => (
            <motion.li
              key={r.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: i === 0 ? 1 : 0.55 - i * 0.1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="flex items-center gap-[0.5em] border-b border-dashed border-paper/10 pb-[0.3em]"
            >
              <BrandMark k={r.b} className="h-[1.5em] w-[1.5em]" />
              <span className="font-plex truncate text-[0.86em] text-paper/80">{r[locale]}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className="font-plex flex justify-between text-[0.78em] tabular text-paper/40">
        <span>{locale === "tr" ? "kuyruk" : "queue"} 3</span>
        <span>AI 12 · {locale === "tr" ? "insan" : "human"} 1</span>
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------- stock */

const CHANNELS: { b: BrandKey; name: string; ms: number }[] = [
  { b: "shopify", name: "Shopify", ms: 212 },
  { b: "trendyol", name: "Trendyol", ms: 640 },
  { b: "woocommerce", name: "Woo", ms: 188 },
];

/** One row in the product database and the three storefronts that mirror it. */
const Stock = memo(function Stock({ cues }: WidgetProps) {
  const { locale } = useLanguage();
  const reserved = cues.includes("reserve");
  const synced = cues.includes("sync");
  const edited = cues.includes("edit");
  const fanned = cues.includes("fanout");
  const qty = reserved ? 13 : 14;
  const price = edited ? "1.199,90" : "1.249,90";

  return (
    <div className="flex h-full flex-col">
      <div className="font-plex text-[0.82em] text-paper/45">KTN-GML-M-EKR · {locale === "tr" ? "Keten gömlek" : "Linen shirt"}</div>
      <div className="mt-[0.2em] flex items-baseline gap-[0.6em]">
        <Flip value={qty} className="font-wide text-[2.4em] leading-none" hot={reserved} />
        <span className="font-plex text-[0.86em] text-paper/50">{locale === "tr" ? "adet" : "in stock"}</span>
        <span className={cn("font-plex ml-auto text-[0.9em] tabular", edited ? "text-volt" : "text-paper/70")}>₺{price}</span>
      </div>
      <ul className="mt-auto flex flex-col gap-[0.3em]">
        {CHANNELS.map((c, i) => {
          const done = synced || fanned;
          return (
            <li key={c.b} className="flex items-center gap-[0.5em] border-t border-dashed border-paper/10 pt-[0.3em]">
              <BrandMark k={c.b} className="h-[1.4em] w-[1.4em]" />
              <span className="font-plex text-[0.84em] text-paper/70">{c.name}</span>
              <span className="font-plex ml-auto text-[0.84em] tabular">
                <motion.span
                  key={done ? "y" : "n"}
                  initial={done ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ delay: done ? 0.2 + i * 0.28 : 0 }}
                  className={done ? "text-volt" : "text-paper/60"}
                >
                  {fanned ? `₺${price}` : synced ? 13 : 14}
                  {done && <span className="ml-[0.5em] text-paper/40">{c.ms}ms</span>}
                </motion.span>
              </span>
              {done ? (
                <Check className="h-[1em] w-[1em] text-volt" strokeWidth={2} aria-hidden />
              ) : (
                <span className="h-[1em] w-[1em]" aria-hidden />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

function Flip({ value, className, hot }: { value: number; className?: string; hot?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className={cn("relative inline-flex overflow-hidden tabular", hot ? "text-volt" : "text-paper", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? false : { y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
