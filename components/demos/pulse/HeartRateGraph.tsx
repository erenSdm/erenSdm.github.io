"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HR_POINTS } from "./data";

const W = 320;
const H = 96;
const ACCENT = "#F0654A";

/** Build a smooth catmull-rom-ish path from the point list. */
function buildPath(points: Array<[number, number]>) {
  if (points.length === 0) return "";
  const d = [`M ${points[0][0]},${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const mx = (x0 + x1) / 2;
    d.push(`C ${mx},${y0} ${mx},${y1} ${x1},${y1}`);
  }
  return d.join(" ");
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function HeartRateGraph() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  const line = buildPath(HR_POINTS);
  const area = `${line} L ${W},${H} L 0,${H} Z`;
  const [lastX, lastY] = HR_POINTS[HR_POINTS.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-[96px] w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Heart rate trend across the day"
    >
      <defs>
        <linearGradient id="pulse-hr-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
          <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* area wash — fades in after the line has begun drawing */}
      <motion.path
        d={area}
        fill="url(#pulse-hr-fill)"
        initial={{ opacity: animate ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: animate ? 0.9 : 0 }}
      />

      {/* animated line draw */}
      <motion.path
        d={line}
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: animate ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        style={{ filter: `drop-shadow(0 0 5px ${ACCENT}66)` }}
      />

      {/* live endpoint — perpetual pulse */}
      <motion.circle
        cx={lastX}
        cy={lastY}
        r={7}
        fill={ACCENT}
        fillOpacity={0.25}
        initial={{ scale: 1, opacity: 0.5 }}
        animate={
          animate
            ? { scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }
            : { scale: 1, opacity: 0.4 }
        }
        transition={{
          duration: 1.8,
          repeat: animate ? Infinity : 0,
          ease: "easeInOut",
          delay: animate ? 1.4 : 0,
        }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <motion.circle
        cx={lastX}
        cy={lastY}
        r={3.5}
        fill={ACCENT}
        initial={{ opacity: animate ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: animate ? 1.4 : 0, duration: 0.3 }}
      />
    </svg>
  );
}
