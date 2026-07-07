"use client";

import {
  Activity,
  Boxes,
  Database,
  Globe,
  History,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Kicker, mono, Reveal, sans } from "./primitives";
import type { ReactNode } from "react";

/* ---------- mini visuals ---------- */

function EdgeMap() {
  const nodes = [
    { x: 18, y: 30, r: "iad1", ms: "8ms" },
    { x: 50, y: 18, r: "fra1", ms: "11ms" },
    { x: 78, y: 40, r: "sin1", ms: "14ms" },
    { x: 34, y: 58, r: "gru1", ms: "22ms" },
    { x: 88, y: 20, r: "hnd1", ms: "19ms" },
  ];
  return (
    <div className="relative mt-5 h-[132px] w-full overflow-hidden rounded-lg border border-line bg-[#08080a]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(#131320 1px, transparent 1px), linear-gradient(90deg, #131320 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <svg viewBox="0 0 100 66" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {nodes.map((n, i) =>
          i === 0 ? null : (
            <line
              key={n.r}
              x1={nodes[0].x}
              y1={nodes[0].y}
              x2={n.x}
              y2={n.y}
              stroke="#22d3ee"
              strokeWidth="0.4"
              strokeOpacity="0.35"
              strokeDasharray="1.5 1.5"
            />
          )
        )}
        {nodes.map((n, i) => (
          <g key={n.r}>
            <circle cx={n.x} cy={n.y} r={i === 0 ? 2.2 : 1.6} fill="#22d3ee" />
            <circle cx={n.x} cy={n.y} r={i === 0 ? 4.5 : 3.4} fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeOpacity="0.4" />
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 py-2">
        {nodes.slice(0, 3).map((n) => (
          <span key={n.r} className={`${mono} text-[10px] text-ash`}>
            <span className="text-[#22d3ee]">{n.r}</span> {n.ms}
          </span>
        ))}
      </div>
    </div>
  );
}

function SdkCode() {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-line bg-[#08080a]">
      <pre className={`${mono} px-3.5 py-3 text-[11.5px] leading-[1.75]`}>
        <code className="block whitespace-pre text-bone">
          <div>
            <span className="text-[#c084fc]">const</span> user ={" "}
            <span className="text-[#22d3ee]">await</span> db
          </div>
          <div>
            {"  "}.<span className="text-[#22d3ee]">from</span>(
            <span className="text-[#86efac]">&quot;users&quot;</span>)
          </div>
          <div>
            {"  "}.<span className="text-[#22d3ee]">where</span>({"{ "}id {"})"}
          </div>
          <div className="relative">
            {"  "}.<span className="text-[#22d3ee]">select</span>(
            <span className="text-[#86efac]">&quot;email&quot;</span>)
          </div>
        </code>
      </pre>
      <div className="flex items-center gap-2 border-t border-line bg-[#0c0c0e] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#86efac]" />
        <span className={`${mono} text-[10px] text-ash`}>
          user: <span className="text-[#5eead4]">{"{ email: string }"}</span>
        </span>
      </div>
    </div>
  );
}

function RollbackList() {
  const rows = [
    { v: "v4.2.1", t: "live", active: true },
    { v: "v4.2.0", t: "2h ago" },
    { v: "v4.1.9", t: "6h ago" },
  ];
  return (
    <div className="mt-5 space-y-1.5">
      {rows.map((r) => (
        <div
          key={r.v}
          className={`flex items-center justify-between rounded-md border px-3 py-2 ${
            r.active
              ? "border-[#22d3ee]/40 bg-[#22d3ee]/[0.06]"
              : "border-line bg-[#08080a]"
          }`}
        >
          <span className={`${mono} text-[11px] text-bone`}>{r.v}</span>
          <span
            className={`${mono} text-[10px] ${
              r.active ? "text-[#22d3ee]" : "text-dim"
            }`}
          >
            {r.active ? "● live" : r.t}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScaleChart() {
  return (
    <div className="mt-5 h-[120px] w-full overflow-hidden rounded-lg border border-line bg-[#08080a] p-2">
      <svg viewBox="0 0 120 44" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cbt-scale" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 42 L14 40 L24 20 L34 26 L46 8 L58 16 L68 4 L80 24 L92 12 L104 42 L120 42 Z"
          fill="url(#cbt-scale)"
        />
        <path
          d="M0 42 L14 40 L24 20 L34 26 L46 8 L58 16 L68 4 L80 24 L92 12 L104 42 L120 42"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center justify-between px-1">
        <span className={`${mono} text-[10px] text-dim`}>0 → 40k req/s</span>
        <span className={`${mono} text-[10px] text-[#22d3ee]`}>idle: $0.00</span>
      </div>
    </div>
  );
}

function ObsBars() {
  const bars = [40, 62, 48, 78, 55, 90, 70, 84, 60, 96, 72, 88];
  return (
    <div className="mt-5 h-[120px] w-full rounded-lg border border-line bg-[#08080a] p-3">
      <div className="flex h-[72px] items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background:
                i === 9
                  ? "#22d3ee"
                  : "linear-gradient(180deg, rgba(34,211,238,0.5), rgba(34,211,238,0.12))",
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`${mono} text-[10px] text-dim`}>p50 · p95 · p99</span>
        <span className={`${mono} text-[10px] text-ash`}>
          traces <span className="text-[#22d3ee]">100%</span> sampled
        </span>
      </div>
    </div>
  );
}

function VectorDots() {
  const dots = Array.from({ length: 42 });
  return (
    <div className="mt-5 h-[120px] w-full overflow-hidden rounded-lg border border-line bg-[#08080a] p-3">
      <div className="grid h-[70px] gap-[3px]" style={{ gridTemplateColumns: "repeat(14, 1fr)" }}>
        {dots.map((_, i) => {
          const hot = i === 17 || i === 18 || i === 31 || i === 4;
          return (
            <span
              key={i}
              className="rounded-full"
              style={{
                aspectRatio: "1",
                background: hot ? "#22d3ee" : "#1c1c24",
                boxShadow: hot ? "0 0 6px #22d3ee" : "none",
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`${mono} text-[10px] text-dim`}>1.2B vectors</span>
        <span className={`${mono} text-[10px] text-[#22d3ee]`}>~4ms recall</span>
      </div>
    </div>
  );
}

/* ---------- cell ---------- */
type Cell = {
  icon: LucideIcon;
  title: string;
  body: string;
  visual: ReactNode;
  span: string;
};

const CELLS: Cell[] = [
  {
    icon: Globe,
    title: "Edge runtime",
    body: "Every request is served from the region closest to your user — no cold starts, no origin round-trips.",
    visual: <EdgeMap />,
    span: "lg:col-span-2",
  },
  {
    icon: Boxes,
    title: "Type-safe SDK",
    body: "One generated client, fully typed end-to-end. Autocomplete your schema; catch every mistake at compile time.",
    visual: <SdkCode />,
    span: "lg:col-span-1 lg:row-span-2",
  },
  {
    icon: History,
    title: "Instant rollbacks",
    body: "Every deploy is immutable and addressable. Revert to any version in under a second.",
    visual: <RollbackList />,
    span: "lg:col-span-1",
  },
  {
    icon: Activity,
    title: "Autoscaling to zero",
    body: "Scale from zero to forty thousand requests a second and back. Pay for compute you actually use.",
    visual: <ScaleChart />,
    span: "lg:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Observability built in",
    body: "Distributed traces, structured logs, and p99 latency on every route — no agents to install.",
    visual: <ObsBars />,
    span: "lg:col-span-2",
  },
  {
    icon: Database,
    title: "Vector store",
    body: "Store embeddings next to your compute. Sub-5ms recall over a billion vectors, no separate service.",
    visual: <VectorDots />,
    span: "lg:col-span-1",
  },
];

function BentoCell({ cell, delay }: { cell: Cell; delay: number }) {
  const Icon = cell.icon;
  return (
    <Reveal
      delay={delay}
      className={`group flex flex-col bg-ink p-6 transition-colors hover:bg-[#0d0d10] ${cell.span}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-[#0c0c0e] text-[#22d3ee]">
          <Icon size={16} strokeWidth={2} />
        </span>
        <h3 className={`${sans} text-[16px] font-semibold text-paper`}>
          {cell.title}
        </h3>
      </div>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-ash">
        {cell.body}
      </p>
      <div className="mt-auto">{cell.visual}</div>
    </Reveal>
  );
}

export function BentoGrid() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1220px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <Kicker>Platform</Kicker>
          <h2
            className={`${sans} mt-4 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.03em] text-paper`}
          >
            Everything the edge should have shipped with.
          </h2>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-bone">
            Primitives that engineers reach for — measured, documented, and
            benchmarked. No feature ships without a number behind it.
          </p>
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-xl border border-line bg-line">
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
            {CELLS.map((c, i) => (
              <BentoCell key={c.title} cell={c} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
