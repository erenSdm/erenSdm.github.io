"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SPENDING, SPENT_THIS_MONTH, money } from "./data";

export function SpendingBreakdown() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Spending breakdown"
      className="mx-5 mt-6 rounded-[22px] border border-white/[0.06] bg-white/[0.03] p-4"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold tracking-tight text-white">
          Spending
        </h2>
        <div className="text-right">
          <span className="font-mono text-[15px] font-semibold text-white tabular-nums">
            ${money(SPENT_THIS_MONTH)}
          </span>
          <span className="ml-1 text-[11px] text-white/40">this month</span>
        </div>
      </div>

      {/* segmented bar — reveals left to right via scaleX (GPU-safe) */}
      <div className="mt-4 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ originX: 0 }}
          className="flex h-2.5 w-full gap-[3px]"
        >
          {SPENDING.map((s) => (
            <span
              key={s.label}
              className="h-full rounded-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            />
          ))}
        </motion.div>
      </div>

      {/* legend */}
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {SPENDING.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="min-w-0 flex-1 truncate text-[12px] text-white/60">
              {s.label}
            </span>
            <span className="font-mono text-[12px] font-medium text-white/85 tabular-nums">
              {s.pct.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
