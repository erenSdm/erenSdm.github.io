"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CHART, type Range } from "./data";

const RANGES: Range[] = ["24H", "7D", "30D"];
const VW = 820;
const VH = 250;
const PT = 14;
const PB = 26;
const PX = 6;

function buildScale(edge: number[], origin: number[]) {
  const yMax = Math.max(...edge) * 1.08;
  const n = edge.length;
  const plotW = VW - PX * 2;
  const plotH = VH - PT - PB;
  const x = (i: number) => PX + (i / (n - 1)) * plotW;
  const y = (v: number) => PT + (1 - v / yMax) * plotH;
  const line = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = (arr: number[]) =>
    `${line(arr)} L${x(n - 1).toFixed(1)} ${(VH - PB).toFixed(1)} L${x(0).toFixed(1)} ${(VH - PB).toFixed(1)} Z`;
  return { x, y, line, area, yMax, n, plotH };
}

export function PrimaryChart() {
  const [range, setRange] = useState<Range>("24H");
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const reduce = useReducedMotion();

  const s = CHART[range];
  const geo = useMemo(() => buildScale(s.edge, s.origin), [s]);

  const gridY = [0.25, 0.5, 0.75].map((f) => PT + f * geo.plotH);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (geo.n - 1));
    setHover(Math.max(0, Math.min(geo.n - 1, idx)));
  }

  const totalEdge = s.edge.reduce((a, b) => a + b, 0);
  const offload = (1 - s.origin.reduce((a, b) => a + b, 0) / totalEdge) * 100;

  return (
    <section className="flex h-full flex-col border border-line bg-ink">
      {/* header */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="label text-[9px] text-ash">REQUEST VOLUME</span>
            <span className="font-mono text-[9px] tracking-[0.14em] text-dim">
              REQ/S · ×1000
            </span>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-acid" />
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-bone">
                EDGE
              </span>
              <span className="font-mono text-[13px] text-paper tabular-nums">
                {s.edge[hover ?? s.edge.length - 1]}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-[2px] w-3 bg-ash" />
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ash">
                ORIGIN
              </span>
              <span className="font-mono text-[13px] text-bone tabular-nums">
                {s.origin[hover ?? s.origin.length - 1]}
              </span>
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <div className="label text-[9px]">EDGE OFFLOAD</div>
            <div className="mt-1.5 font-mono text-[15px] text-acid tabular-nums">
              {offload.toFixed(1)}%
            </div>
          </div>
          {/* segmented toggle */}
          <div className="flex items-stretch border border-line" role="group" aria-label="Chart range">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRange(r);
                  setHover(null);
                }}
                aria-pressed={range === r}
                className={cn(
                  "px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] outline-none transition-colors duration-200 focus-visible:text-paper",
                  range === r
                    ? "bg-acid text-ink"
                    : "text-dim hover:text-bone"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* plot */}
      <div className="relative min-h-[220px] flex-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label={`Edge and origin request volume over the last ${range}`}
        >
          {/* gridlines */}
          {gridY.map((gy, i) => (
            <line
              key={i}
              x1={PX}
              y1={gy}
              x2={VW - PX}
              y2={gy}
              stroke="var(--color-line-soft)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <line
            x1={PX}
            y1={VH - PB}
            x2={VW - PX}
            y2={VH - PB}
            stroke="var(--color-line)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />

          {/* edge area fill (flat, no gradient) */}
          <motion.path
            key={`area-${range}`}
            d={geo.area(s.edge)}
            fill="var(--color-acid)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: reduce ? 0 : 0.6 }}
          />

          {/* origin line */}
          <motion.path
            key={`origin-${range}`}
            d={geo.line(s.origin)}
            fill="none"
            stroke="var(--color-ash)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* edge line */}
          <motion.path
            key={`edge-${range}`}
            d={geo.line(s.edge)}
            fill="none"
            stroke="var(--color-acid)"
            strokeWidth={1.75}
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* hover crosshair */}
          {hover !== null && (
            <g>
              <line
                x1={geo.x(hover)}
                y1={PT}
                x2={geo.x(hover)}
                y2={VH - PB}
                stroke="var(--color-bone)"
                strokeWidth={1}
                strokeDasharray="2 3"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={geo.x(hover) - 3}
                y={geo.y(s.edge[hover]) - 3}
                width={6}
                height={6}
                fill="var(--color-acid)"
              />
            </g>
          )}

          {/* live marker at latest edge sample */}
          <motion.circle
            cx={geo.x(geo.n - 1)}
            cy={geo.y(s.edge[geo.n - 1])}
            r={3}
            fill="var(--color-acid)"
            animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* x-axis labels */}
        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-between px-2">
          {s.labels.map((l) => (
            <span
              key={l}
              className="font-mono text-[9px] uppercase tracking-[0.1em] text-dim"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
