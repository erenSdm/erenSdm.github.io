"use client";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { CATEGORY_META } from "./data";
import { formatMoney } from "./format";
import { budgetLines, monthSeries, weekSeries, type Bar } from "./insights";
import { useWallet } from "./store";
import { ICON, softSpring, spring } from "./ui";

const W = 320;
const H = 150;
const PAD_B = 22;

function SpendChart({ bars, selected, onSelect }: { bars: Bar[]; selected: number; onSelect: (i: number) => void }) {
  const reduce = useReducedMotion();
  const max = Math.max(...bars.map((b) => b.value), 1) * 1.12;
  const avg = bars.reduce((s, b) => s + b.value, 0) / bars.length;
  const slot = W / bars.length;
  const bw = Math.min(34, slot * 0.56);
  const plotH = H - PAD_B;
  const avgY = plotH - (avg / max) * plotH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Spending chart">
      {[0.33, 0.66].map((g) => (
        <line key={g} x1={0} x2={W} y1={plotH * g} y2={plotH * g} stroke="#EEF0F3" strokeWidth={1} />
      ))}
      <line x1={0} x2={W} y1={plotH} y2={plotH} stroke="#E5E7EB" strokeWidth={1} />
      {bars.map((b, i) => {
        const h = Math.max(3, (b.value / max) * plotH);
        const x = slot * i + (slot - bw) / 2;
        const on = i === selected;
        return (
          <g key={`${b.label}-${i}`} onClick={() => onSelect(i)} className="cursor-pointer">
            <rect x={slot * i} y={0} width={slot} height={H} fill="transparent" />
            <motion.rect
              x={x}
              width={bw}
              rx={8}
              initial={reduce ? false : { y: plotH, height: 0 }}
              animate={{ y: plotH - h, height: h }}
              transition={softSpring}
              fill={on ? "#0A7A5E" : b.current ? "#9CCFBF" : "#D9DCE2"}
            />
            <text
              x={slot * i + slot / 2}
              y={H - 5}
              textAnchor="middle"
              fontSize={11}
              fontWeight={on ? 700 : 600}
              fill={on ? "#12161C" : "#727986"}
            >
              {b.label}
            </text>
          </g>
        );
      })}
      <motion.line
        x1={0}
        x2={W}
        animate={{ y1: avgY, y2: avgY }}
        transition={softSpring}
        stroke="#12161C"
        strokeOpacity={0.45}
        strokeDasharray="3 4"
        strokeWidth={1}
      />
    </svg>
  );
}

const WEEK_DAYS = ["Fri 18", "Sat 19", "Sun 20", "Mon 21", "Tue 22", "Wed 23", "Today"];
const MONTH_LABELS = ["1–7 Sep", "8–14 Sep", "15–21 Sep", "This week"];

export function BudgetScreen() {
  const { state, hidden, setTab, setFilter } = useWallet();
  const [range, setRange] = useState<"week" | "month">("week");
  const [selected, setSelected] = useState<{ week: number; month: number }>({ week: 6, month: 3 });
  const lines = budgetLines(state.txns);
  const spent = lines.reduce((s, l) => s + l.spent, 0);
  const planned = lines.reduce((s, l) => s + l.limit, 0);
  const bars = range === "week" ? weekSeries(state.txns) : monthSeries(state.txns);
  const sel = selected[range];
  const avg = bars.reduce((s, b) => s + b.value, 0) / bars.length;
  const money = (v: number, d = true) => (hidden ? "₺••••" : formatMoney(v, "TRY", { decimals: d }));

  return (
    <div className="h-full overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="px-5 pt-[calc(var(--safe-top)+10px)]">
        <div className="flex items-end justify-between">
          <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#12161C]">Budget</h1>
          <p className="pb-1 text-[13px] font-medium text-[#555D6B]">September 2026</p>
        </div>
      </header>

      <section className="px-5 pt-4" aria-label="Month summary">
        <p className="text-[14px] font-medium text-[#555D6B]">Spent so far</p>
        <p className="mt-1 text-[34px] font-bold leading-none tabular-nums tracking-[-0.04em] text-[#12161C]">
          {money(spent)}
        </p>
        <p className="mt-2 text-[13px] tabular-nums text-[#555D6B]">
          {money(planned - spent)} left of {money(planned, false)} · 6 days to go
        </p>
      </section>

      {/* chart */}
      <section className="mx-5 mt-5 rounded-[24px] bg-white p-4 shadow-[0_1px_2px_rgba(18,22,28,0.05)]" aria-label="Spending trend">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-[#555D6B]">
              {range === "week" ? WEEK_DAYS[sel] : MONTH_LABELS[sel]}
            </p>
            <p className="mt-0.5 text-[22px] font-bold tabular-nums tracking-[-0.03em] text-[#12161C]">
              {money(bars[sel]?.value ?? 0)}
            </p>
          </div>
          <LayoutGroup id="budget-range">
            <div className="flex rounded-full bg-[#F1F2F5] p-1" role="radiogroup" aria-label="Range">
              {(["week", "month"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={range === r}
                  onClick={() => setRange(r)}
                  className={`relative h-7 rounded-full px-3 text-[12px] font-semibold capitalize ${
                    range === r ? "text-[#12161C]" : "text-[#555D6B]"
                  }`}
                >
                  {range === r && (
                    <motion.span
                      layoutId="budget-range-pill"
                      transition={spring}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(18,22,28,0.12)]"
                    />
                  )}
                  <span className="relative">{r}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <div className="mt-3">
          <SpendChart
            key={range}
            bars={bars}
            selected={sel}
            onSelect={(i) => setSelected({ ...selected, [range]: i })}
          />
        </div>
        <p className="mt-1 flex items-center gap-2 text-[12px] tabular-nums text-[#555D6B]">
          <span className="inline-block w-4 border-t border-dashed border-[#12161C]/50" aria-hidden />
          Average {money(avg)} per {range === "week" ? "day" : "week"}
        </p>
      </section>

      {/* categories */}
      <section className="mt-6 px-5" aria-label="Category budgets">
        <h2 className="mb-2 text-[17px] font-bold tracking-[-0.02em] text-[#12161C]">By category</h2>
        <div className="rounded-[24px] bg-white p-1.5 shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
          {lines.map((l) => {
            const meta = CATEGORY_META[l.category];
            const Icon = meta.icon;
            const ratio = l.spent / l.limit;
            const over = ratio > 1;
            const near = !over && ratio >= 0.85;
            const barColor = over ? "#BE3A2C" : near ? "#B9770E" : meta.bar;
            return (
              <button
                key={l.category}
                type="button"
                onClick={() => {
                  setFilter({ category: l.category, query: "" });
                  setTab("activity");
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-3 text-left active:bg-[#F0F1F4]"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px]"
                  style={{ background: meta.bg, color: meta.fg }}
                  aria-hidden
                >
                  <Icon size={18} strokeWidth={ICON} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[15px] font-semibold text-[#12161C]">{meta.label}</span>
                    <span className="text-[13px] font-semibold tabular-nums text-[#12161C]">
                      {money(l.spent, false)}
                      <span className="font-medium text-[#727986]"> / {money(l.limit, false)}</span>
                    </span>
                  </span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#EEF0F3]">
                    <motion.span
                      className="block h-full rounded-full"
                      style={{ background: barColor, originX: 0 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: Math.min(1, ratio) }}
                      transition={softSpring}
                    />
                  </span>
                  <span
                    className={`mt-1.5 block text-[12px] font-medium tabular-nums ${
                      over ? "text-[#BE3A2C]" : near ? "text-[#9A5B06]" : "text-[#555D6B]"
                    }`}
                  >
                    {over
                      ? `${money(l.spent - l.limit)} over budget`
                      : near
                        ? `${money(l.limit - l.spent)} left · close to limit`
                        : `${money(l.limit - l.spent)} left`}
                  </span>
                </span>
                <ChevronRight size={16} strokeWidth={ICON} className="shrink-0 text-[#727986]" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
