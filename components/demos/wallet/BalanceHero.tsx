"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Eye, EyeOff, TrendingUp } from "lucide-react";
import { BALANCE, money } from "./data";
import { useCountUp } from "./useCountUp";

export function BalanceHero() {
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const { ref, value } = useCountUp(BALANCE.total);

  const shown = money(value);
  const [whole, cents] = shown.split(".");

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="px-5 pt-1"
      aria-label="Total balance"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
          Total balance
        </span>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          aria-pressed={hidden}
          aria-label={hidden ? "Show balance" : "Hide balance"}
          className="grid h-7 w-7 place-items-center rounded-full text-white/45 transition-colors duration-300 hover:text-white/80 active:scale-95"
        >
          {hidden ? (
            <EyeOff className="h-[15px] w-[15px]" strokeWidth={1.7} />
          ) : (
            <Eye className="h-[15px] w-[15px]" strokeWidth={1.7} />
          )}
        </button>
      </div>

      <div ref={ref} className="mt-2 flex items-end gap-1">
        {hidden ? (
          <span
            className="font-mono text-[44px] leading-none tracking-tight text-white"
            aria-label="Balance hidden"
          >
            ••••••
          </span>
        ) : (
          <>
            <span className="font-mono text-[26px] font-medium leading-none text-white/60">
              {BALANCE.currency}
            </span>
            <span className="font-mono text-[44px] font-semibold leading-[0.9] tracking-tight text-white tabular-nums">
              {whole}
            </span>
            <span className="mb-[3px] font-mono text-[24px] font-medium leading-none tracking-tight text-white/45 tabular-nums">
              .{cents}
            </span>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full bg-[#2FBF8C]/12 px-2 py-1 text-[12px] font-semibold text-[#2FBF8C]"
          style={{ backgroundColor: "rgba(47,191,140,0.12)" }}
        >
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.2} />
          {BALANCE.deltaUp ? "+" : "-"}
          {BALANCE.currency}
          {money(BALANCE.deltaAmount)}
        </span>
        <span className="text-[12px] text-white/40">
          {BALANCE.deltaUp ? "up" : "down"} {BALANCE.deltaPct}% this month
        </span>
        <ArrowUpRight className="ml-auto h-4 w-4 text-white/30" strokeWidth={1.8} />
      </div>
    </motion.section>
  );
}
