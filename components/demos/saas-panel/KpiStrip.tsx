"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KPIS } from "./data";
import { Sparkline } from "./Sparkline";

function LiveSessions() {
  const [n, setN] = useState(18432);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = setInterval(() => {
      // organic drift: mostly up, occasionally down
      setN((prev) => {
        const drift = Math.round((Math.random() - 0.38) * 14);
        return Math.max(17800, Math.min(19200, prev + drift));
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return <>{n.toLocaleString("en-US")}</>;
}

export function KpiStrip() {
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-5"
    >
      {KPIS.map((k) => {
        const Arrow = k.dir === "up" ? ArrowUpRight : ArrowDownRight;
        const deltaColor = k.good ? "text-acid" : "text-hazard";
        return (
          <div
            key={k.id}
            className="flex flex-col justify-between gap-3 bg-ink px-4 py-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="label text-[9px]">{k.label}</span>
              {k.live && (
                <span className="flex items-center gap-1">
                  <span className="h-1 w-1 animate-pulse bg-acid motion-reduce:animate-none" />
                  <span className="font-mono text-[8px] tracking-[0.16em] text-dim">
                    LIVE
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-[26px] leading-none tracking-tight text-paper tabular-nums">
                    {k.id === "sessions" ? <LiveSessions /> : k.value}
                  </span>
                  {k.unit && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ash">
                      {k.unit}
                    </span>
                  )}
                </div>
                <div className={`mt-2 flex items-center gap-1 ${deltaColor}`}>
                  <Arrow size={12} strokeWidth={2} />
                  <span className="font-mono text-[11px] tabular-nums">
                    {k.delta}
                  </span>
                  <span className="font-mono text-[10px] text-dim">
                    vs prev
                  </span>
                </div>
              </div>
              <Sparkline
                data={k.spark}
                color={k.good ? "var(--color-acid)" : "var(--color-bone)"}
                width={64}
                height={26}
                className="shrink-0 self-end"
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
