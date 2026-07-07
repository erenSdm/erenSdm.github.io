"use client";

import { Orbit, Clock } from "lucide-react";
import { CYCLE } from "./data";
import { MONO } from "./atoms";

function Sparkline() {
  const data = CYCLE.burndown;
  const w = 96;
  const h = 26;
  const max = data[0];
  const step = w / (data.length - 1);
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
    .join(" ");
  const last = data.length - 1;
  const lastY = h - (data[last] / max) * h;

  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden>
      {/* ideal guide */}
      <line
        x1={0}
        y1={0}
        x2={w}
        y2={h}
        stroke="#2a2a30"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="#6366f1"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={w} cy={lastY} r={2.2} fill="#8b8bff" />
    </svg>
  );
}

function Stat({
  value,
  label,
  color = "#e9e9e4",
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={`text-[15px] font-semibold leading-none tabular-nums ${MONO}`}
        style={{ color }}
      >
        {value}
      </span>
      <span className={`mt-1 text-[9.5px] uppercase tracking-[0.14em] text-[#5a5a53] ${MONO}`}>
        {label}
      </span>
    </div>
  );
}

export function CycleStrip() {
  const pct = CYCLE.percent;

  return (
    <section className="flex items-center gap-5 border-b border-[#1c1c20] bg-[#0b0b0d] px-4 py-3">
      {/* cycle identity */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#26262c] bg-[#141418]">
          <Orbit size={17} className="text-[#8b8bff]" strokeWidth={1.8} />
        </span>
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-[#f4f4ef]">
              {CYCLE.name}
            </h2>
            <span
              className={`rounded-[4px] bg-[#6366f11f] px-1.5 py-[1px] text-[10px] font-medium text-[#a5a6ff] ${MONO}`}
            >
              ACTIVE
            </span>
          </div>
          <p className={`mt-0.5 flex items-center gap-1.5 text-[11px] text-[#7a7a72] ${MONO}`}>
            <span>
              {CYCLE.start} – {CYCLE.end}, 2026
            </span>
            <span className="text-[#3f3f44]">·</span>
            <span className="flex items-center gap-1 text-[#a5a59d]">
              <Clock size={11} />
              {CYCLE.daysLeft}d left
            </span>
          </p>
        </div>
      </div>

      {/* progress bar */}
      <div className="hidden min-w-0 flex-1 md:block">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className={`text-[10.5px] uppercase tracking-[0.14em] text-[#5a5a53] ${MONO}`}>
            Cycle progress
          </span>
          <span className={`text-[11px] tabular-nums text-[#a5a59d] ${MONO}`}>
            {CYCLE.completed}
            <span className="text-[#4a4a45]"> / {CYCLE.scope} pts</span>
          </span>
        </div>
        <div className="relative h-[7px] w-full overflow-hidden rounded-full bg-[#17171b]">
          {/* completed */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#6366f1] to-[#818cf8]"
            style={{ width: `${pct}%` }}
          />
          {/* in-progress hatch */}
          <div
            className="absolute inset-y-0 rounded-r-full bg-[#6366f133]"
            style={{
              left: `${pct}%`,
              width: `${Math.round((CYCLE.inProgress / CYCLE.scope) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* stats */}
      <div className="hidden items-center gap-6 lg:flex">
        <Stat value={String(CYCLE.scope)} label="Scope" />
        <Stat value={String(CYCLE.completed)} label="Done" color="#4ade80" />
        <Stat value={String(CYCLE.inProgress)} label="Active" color="#8b8bff" />
        <Stat value={`${pct}%`} label="Complete" />
      </div>

      {/* burndown */}
      <div className="hidden flex-col items-end xl:flex">
        <Sparkline />
        <span className={`mt-1 text-[9.5px] uppercase tracking-[0.14em] text-[#5a5a53] ${MONO}`}>
          Burndown
        </span>
      </div>
    </section>
  );
}
