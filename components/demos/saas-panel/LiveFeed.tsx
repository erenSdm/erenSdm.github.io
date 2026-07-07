"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FEED_SEED, FEED_POOL, type FeedEvent, type FeedKind } from "./data";

const KIND_STYLE: Record<FeedKind, string> = {
  DEPLOY: "text-acid border-acid/40",
  PAYMENT: "text-acid border-acid/40",
  SIGNUP: "text-bone border-line",
  WEBHOOK: "text-ash border-line",
  SCALE: "text-bone border-line",
  AUTH: "text-ash border-line",
  ALERT: "text-hazard border-hazard/50",
};

function hhmmss(totalSec: number): string {
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor(totalSec / 60) % 60;
  const sec = totalSec % 60;
  const p = (x: number) => x.toString().padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
}

export function LiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(FEED_SEED);
  const [rate, setRate] = useState(23);
  const clock = useRef(14 * 3600 + 42 * 60 + 7); // seconds since midnight
  const poolIdx = useRef(0);
  const nextId = useRef(FEED_SEED.length + 1);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      clock.current += 4 + Math.floor(Math.random() * 8);
      const src = FEED_POOL[poolIdx.current % FEED_POOL.length];
      poolIdx.current += 1;
      const ev: FeedEvent = {
        id: nextId.current++,
        t: hhmmss(clock.current),
        kind: src.kind,
        msg: src.msg,
      };
      setEvents((prev) => [ev, ...prev].slice(0, 9));
      setRate(19 + Math.floor(Math.random() * 12));
    }, 3200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section
      aria-label="Live event feed"
      className="flex h-full flex-col border border-line bg-ink"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full bg-acid"
              animate={reduce ? undefined : { opacity: [0.9, 0.2, 0.9], scale: [1, 1.6, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative inline-flex h-2 w-2 bg-acid" />
          </span>
          <span className="label text-[9px] text-bone">LIVE FEED</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.1em] text-dim tabular-nums">
          {rate}/MIN
        </span>
      </div>

      <ul className="flex-1 divide-y divide-line-soft overflow-hidden">
        <AnimatePresence initial={false}>
          {events.map((ev) => (
            <motion.li
              key={ev.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-start gap-2.5 px-4 py-2.5",
                ev.alert && "bg-hazard/5"
              )}
            >
              <span className="mt-0.5 font-mono text-[10px] text-dim tabular-nums">
                {ev.t}
              </span>
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-block border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]",
                    KIND_STYLE[ev.kind]
                  )}
                >
                  {ev.kind}
                </span>
                <p
                  className={cn(
                    "mt-1.5 font-mono text-[11px] leading-snug",
                    ev.alert ? "text-hazard" : "text-bone"
                  )}
                >
                  {ev.msg}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="border-t border-line px-4 py-2.5">
        <button
          type="button"
          className="w-full font-mono text-[10px] uppercase tracking-[0.16em] text-dim outline-none transition-colors hover:text-acid focus-visible:text-acid"
        >
          &gt;&gt; OPEN EVENT STREAM
        </button>
      </div>
    </section>
  );
}
