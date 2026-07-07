"use client";

import { CountUp, mono, Reveal, sans } from "./primitives";

const METRICS: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
}[] = [
  { to: 12, suffix: "ms", label: "p99 cold start", note: "median across all regions" },
  { to: 1.4, decimals: 1, suffix: "M", label: "requests / sec", note: "sustained peak, Oct 2026" },
  { to: 34, label: "edge regions", note: "on 6 continents" },
  { to: 99.99, decimals: 2, suffix: "%", label: "uptime SLA", note: "trailing 90 days" },
];

export function MetricsStrip() {
  return (
    <section className="relative border-b border-line bg-[#070708]">
      <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal
              key={m.label}
              delay={i * 0.08}
              className={`px-2 py-10 sm:px-6 lg:py-14 ${
                i !== METRICS.length - 1 ? "lg:border-r lg:border-line" : ""
              } ${i < 2 ? "border-b border-line lg:border-b-0" : ""} ${
                i % 2 === 0 ? "border-r border-line lg:border-r" : ""
              }`}
            >
              <div
                className={`${sans} text-[clamp(2.4rem,5vw,3.6rem)] font-bold leading-none tracking-[-0.03em] tabular-nums text-paper`}
              >
                <CountUp
                  to={m.to}
                  decimals={m.decimals}
                  prefix={m.prefix}
                  suffix={m.suffix}
                />
              </div>
              <div
                className={`${sans} mt-3 text-[13px] font-medium text-[#22d3ee]`}
              >
                {m.label}
              </div>
              <div className={`${mono} mt-1 text-[11px] text-dim`}>{m.note}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
