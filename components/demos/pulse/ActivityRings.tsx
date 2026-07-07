"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RINGS } from "./data";

/** Ring geometry — outer(Move) → inner(Stand). Shared 220×220 canvas. */
const GEO = [
  { key: "move", r: 92 },
  { key: "exercise", r: 70 },
  { key: "stand", r: 48 },
] as const;

const SIZE = 220;
const CENTER = SIZE / 2;
const STROKE = 17;

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** requestAnimationFrame count-up that honours reduced motion. */
function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(active ? 0 : target);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, duration]);

  return value;
}

export function ActivityRings() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  const move = RINGS.find((r) => r.key === "move")!;
  const shown = useCountUp(move.value, animate);

  return (
    <div className="relative mx-auto aspect-square w-[220px] max-w-full">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={`Move ${move.value}% of goal, ${RINGS[1].value}% exercise, ${RINGS[2].value}% stand`}
      >
        {GEO.map(({ key, r }) => {
          const datum = RINGS.find((d) => d.key === key)!;
          const c = 2 * Math.PI * r;
          const clamped = Math.min(datum.value, 100) / 100;
          const target = c * (1 - clamped);
          return (
            <g key={key}>
              {/* track */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={r}
                fill="none"
                stroke={datum.color}
                strokeOpacity={0.15}
                strokeWidth={STROKE}
              />
              {/* value arc */}
              <motion.circle
                cx={CENTER}
                cy={CENTER}
                r={r}
                fill="none"
                stroke={datum.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: animate ? c : target }}
                animate={{ strokeDashoffset: target }}
                transition={{
                  duration: 1.5,
                  ease: EASE,
                  delay: 0.15,
                }}
                style={{ filter: `drop-shadow(0 0 4px ${datum.color}40)` }}
              />
            </g>
          );
        })}
      </svg>

      {/* center readout */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-5xl leading-none"
          style={{ color: move.color }}
        >
          {Math.round(shown)}
          <span className="align-top text-xl">%</span>
        </span>
        <span className="label mt-1.5 text-[0.6rem] text-ash">of move goal</span>
      </div>
    </div>
  );
}
