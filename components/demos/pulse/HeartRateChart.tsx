"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { HR_STEP_MIN, clock } from "./data";
import { C, NUM_STYLE, SPRING } from "./tokens";

const W = 326;
const H = 124;
const PAD_R = 24;
const PAD_T = 8;
const PAD_B = 18;
const DAY_SAMPLES = (24 * 60) / HR_STEP_MIN;

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = 0.18;
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function HeartRateChart({ hr, restingHr, isToday }: { hr: number[]; restingHr: number; isToday: boolean }) {
  const reduce = useReducedMotion();
  const [scrub, setScrub] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const { pts, line, area, yMin, yMax, max, min } = useMemo(() => {
    const max = Math.max(...hr);
    const min = Math.min(...hr);
    const yMin = 40;
    const yMax = Math.max(160, Math.ceil((max + 12) / 20) * 20);
    const plotW = W - PAD_R;
    const plotH = H - PAD_T - PAD_B;
    const pts = hr.map<[number, number]>((v, i) => [
      (i / (DAY_SAMPLES - 1)) * plotW,
      PAD_T + plotH - ((v - yMin) / (yMax - yMin)) * plotH,
    ]);
    const line = smoothPath(pts);
    const last = pts[pts.length - 1];
    const area = `${line} L${last[0].toFixed(1)},${H - PAD_B} L0,${H - PAD_B} Z`;
    return { pts, line, area, yMin, yMax, max, min };
  }, [hr]);

  const yOf = (v: number) => PAD_T + (H - PAD_T - PAD_B) - ((v - yMin) / (yMax - yMin)) * (H - PAD_T - PAD_B);

  const pick = useCallback(
    (clientX: number) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((clientX - r.left) / r.width) * W;
      const i = Math.round((x / (W - PAD_R)) * (DAY_SAMPLES - 1));
      setScrub(Math.max(0, Math.min(hr.length - 1, i)));
    },
    [hr.length],
  );

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    pick(e.clientX);
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (dragging.current) pick(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = e.shiftKey ? 6 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const from = scrub ?? hr.length - 1;
      const next = from + (e.key === "ArrowRight" ? step : -step);
      setScrub(Math.max(0, Math.min(hr.length - 1, next)));
    } else if (e.key === "Escape") {
      setScrub(null);
    }
  };

  const active = scrub ?? null;
  const shownIndex = active ?? hr.length - 1;
  const shown = hr[shownIndex];
  const p = pts[shownIndex];

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[44px] font-semibold leading-[0.9]" style={{ ...NUM_STYLE, color: C.ink }}>
            {shown}
          </span>
          <span className="text-[13px] font-medium text-[#545C67]">bpm</span>
        </div>
        <div className="text-right text-[12px] leading-tight text-[#545C67]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active === null ? "summary" : "scrub"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {active === null ? (
                <>
                  <div className="font-medium text-[#14171C]">{isToday ? `Latest · ${clock(shownIndex * HR_STEP_MIN)}` : "Last reading · 23:50"}</div>
                  <div>
                    Resting {restingHr} · Range {min}–{max}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-[#14171C]">
                    {clock(active * HR_STEP_MIN)}–{clock(active * HR_STEP_MIN + HR_STEP_MIN)}
                  </div>
                  <button className="font-medium text-[#CC3D22]" onClick={() => setScrub(null)}>
                    Clear selection
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full touch-none select-none outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#CC3D22]/50"
        role="slider"
        tabIndex={0}
        aria-label="Heart rate over the day. Drag or use arrow keys to read values."
        aria-valuemin={0}
        aria-valuemax={hr.length - 1}
        aria-valuenow={shownIndex}
        aria-valuetext={`${shown} beats per minute at ${clock(shownIndex * HR_STEP_MIN)}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
      >
        <defs>
          <linearGradient id="pulse-hr-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={C.move} stopOpacity={0.18} />
            <stop offset="100%" stopColor={C.move} stopOpacity={0} />
          </linearGradient>
        </defs>

        {[60, 100, 140].map((v) => (
          <g key={v}>
            <line x1={0} x2={W - PAD_R} y1={yOf(v)} y2={yOf(v)} stroke={C.line} strokeDasharray="2 4" />
            <text x={W - PAD_R + 4} y={yOf(v) + 3.5} fontSize={10} fill={C.ink3} style={{ fontVariantNumeric: "tabular-nums" }}>
              {v}
            </text>
          </g>
        ))}
        {["00", "06", "12", "18", "24"].map((l, i) => (
          <text
            key={l}
            x={(i / 4) * (W - PAD_R)}
            y={H - 4}
            fontSize={10}
            fill={C.ink3}
            textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
          >
            {l}
          </text>
        ))}

        <motion.path d={area} fill="url(#pulse-hr-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
        <motion.path
          d={line}
          fill="none"
          stroke={C.move}
          strokeWidth={1.75}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        {isToday && active === null ? (
          <motion.circle
            cx={p[0]}
            cy={p[1]}
            fill={C.move}
            opacity={0.18}
            initial={{ r: 6 }}
            animate={reduce ? { r: 7 } : { r: [4, 9, 4] }}
            transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {active !== null || isToday ? (
          <motion.g initial={false} animate={{ x: p[0], y: 0 }} transition={SPRING}>
            {active !== null ? (
              <line x1={0} x2={0} y1={PAD_T - 4} y2={H - PAD_B} stroke={C.ink} strokeWidth={1} strokeOpacity={0.5} />
            ) : null}
          </motion.g>
        ) : null}
        {active !== null || isToday ? (
          <motion.circle
            r={4}
            fill="#fff"
            stroke={C.move}
            strokeWidth={2}
            initial={false}
            animate={{ cx: p[0], cy: p[1] }}
            transition={SPRING}
          />
        ) : null}
      </svg>
    </div>
  );
}
