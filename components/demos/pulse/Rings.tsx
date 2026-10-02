"use client";

import { motion } from "framer-motion";
import { RING_META, SOFT, type RingKey } from "./tokens";

const ORDER: RingKey[] = ["move", "exercise", "stand"];

/**
 * Three concentric activity rings, tuned for white: solid hue arcs on a
 * 14% tint of the same hue, round caps, no glow.
 */
export function Rings({
  values,
  size,
  stroke,
  gap = 3,
  label,
}: {
  /** fraction of goal per ring; values above 1 render as a full ring */
  values: Record<RingKey, number>;
  size: number;
  stroke: number;
  gap?: number;
  label?: string;
}) {
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="shrink-0 -rotate-90"
    >
      {ORDER.map((key, i) => {
        const r = c - stroke / 2 - i * (stroke + gap);
        if (r <= 0) return null;
        const v = Math.max(0, Math.min(1, values[key]));
        const color = RING_META[key].color;
        return (
          <g key={key}>
            <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeOpacity={0.14} strokeWidth={stroke} />
            <motion.circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: v === 0 ? 0.0001 : v, opacity: v === 0 ? 0 : 1 }}
              transition={{ ...SOFT, delay: i * 0.06 }}
            />
          </g>
        );
      })}
    </svg>
  );
}
