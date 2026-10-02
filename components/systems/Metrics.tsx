"use client";

import { memo, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { hash01 } from "./lanes";
import { tx, type MetricDef } from "./types";

const HISTORY = 18;

function sample(m: MetricDef, t: number) {
  const wobble = m.jitter ? (Math.random() - 0.5) * 2 * m.jitter : 0;
  return m.v + (m.rate ?? 0) * t + wobble;
}

/** Live counters with a short history line, so "how much, how fast" is always on screen. */
export const Metrics = memo(function Metrics({ items, live }: { items: MetricDef[]; live: boolean }) {
  const { locale } = useLanguage();
  const reduce = useReducedMotion();
  const [{ t, hist }, set] = useState(() => ({
    t: 0,
    // deterministic, so server and client render the same first frame
    hist: items.map((m) =>
      Array.from({ length: HISTORY }, (_, k) =>
        k === HISTORY - 1 ? m.v : m.v + (m.rate ?? 0) * (k - HISTORY) + (hash01(`${m.v}-${k}`) - 0.5) * 2 * (m.jitter ?? 0)
      )
    ),
  }));

  useEffect(() => {
    if (!live || reduce) return;
    const id = window.setInterval(() => {
      set((prev) => ({
        t: prev.t + 1,
        hist: prev.hist.map((row, i) => [...row.slice(1), sample(items[i], prev.t + 1)]),
      }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [live, reduce, items]);

  const loc = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <dl className="grid grid-cols-2 border-b border-dashed border-paper/15 md:grid-cols-4">
      {items.map((m, i) => {
        const row = hist[i];
        const v = t === 0 ? m.v : row[row.length - 1];
        const lo = Math.min(...row);
        const hi = Math.max(...row);
        const pts = row.map((y, k) => `${(k / (HISTORY - 1)) * 60},${14 - ((y - lo) / (hi - lo || 1)) * 12}`).join(" ");
        return (
          <div
            key={i}
            className="flex flex-col gap-1 border-dashed border-paper/15 px-4 py-3 [&:not(:last-child)]:border-r max-md:[&:nth-child(2)]:border-r-0 max-md:[&:nth-child(-n+2)]:border-b"
          >
            <dt className="ui truncate text-[10px] text-paper/45">{tx(m.k, locale)}</dt>
            <dd className="flex items-end justify-between gap-2">
              <span className="font-wide text-[20px] leading-none tabular md:text-[22px]">
                {v.toLocaleString(loc, { minimumFractionDigits: m.decimals ?? 0, maximumFractionDigits: m.decimals ?? 0 })}
                {m.unit && <span className="font-plex ml-1 text-[11px] text-paper/50">{m.unit}</span>}
              </span>
              <svg viewBox="0 0 60 16" className="h-4 w-[60px] shrink-0" aria-hidden>
                <polyline points={pts} fill="none" stroke="#ccff00" strokeOpacity="0.7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </dd>
          </div>
        );
      })}
    </dl>
  );
});
