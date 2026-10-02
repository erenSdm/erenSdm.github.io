"use client";

import { motion } from "framer-motion";
import { Medal, Target } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GOAL_LIMITS, MONTH, RECORDS, TODAY_INDEX, fmt, type Goals } from "../data";
import { Rings } from "../Rings";
import { usePulse } from "../store";
import { C, SPRING } from "../tokens";
import { Card, CardHead, Num, Segmented, Stepper } from "../ui";

type Range = "week" | "month";
type Metric = "steps" | "move" | "exercise";

const METRIC: Record<Metric, { label: string; unit: string; color: string; text: string }> = {
  steps: { label: "Steps", unit: "steps", color: C.ink, text: C.ink },
  move: { label: "Move", unit: "kcal", color: C.move, text: C.moveText },
  exercise: { label: "Exercise", unit: "min", color: C.exercise, text: C.exerciseText },
};

const CHART_H = 150;

interface Point {
  label: string;
  short: string;
  value: number | null;
}

function BarChart({ points, goal, metric, range }: { points: Point[]; goal: number; metric: Metric; range: Range }) {
  const [sel, setSel] = useState<number | null>(null);
  const m = METRIC[metric];
  const values = points.map((p) => p.value ?? 0);
  const max = Math.max(goal * 1.2, ...values) * 1.05;
  const recorded = points.filter((p) => p.value !== null) as { label: string; value: number }[];
  const avg = Math.round(recorded.reduce((n, p) => n + p.value, 0) / Math.max(1, recorded.length));
  const hit = recorded.filter((p) => p.value >= goal).length;
  const selected = sel !== null ? points[sel] : null;
  const shown = selected?.value ?? avg;

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-[#545C67]">{selected ? selected.label : range === "week" ? "Daily average" : "30-day average"}</p>
          <div className="flex items-baseline gap-1.5">
            <Num value={fmt(shown)} className="text-[48px]" />
            <span className="text-[13px] text-[#545C67]">{m.unit}</span>
          </div>
        </div>
        <p className="pb-1 text-right text-[12px] leading-tight text-[#545C67]">
          Goal met
          <br />
          <span className="font-semibold text-[#14171C]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {hit} of {recorded.length} days
          </span>
        </p>
      </div>

      <div className="relative" style={{ height: CHART_H }}>
        <motion.div
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#9AA3AE]"
          initial={false}
          animate={{ y: CHART_H - (goal / max) * CHART_H }}
          transition={SPRING}
        >
          <span className="absolute -top-[18px] right-0 rounded bg-[#F4F5F7] px-1 text-[10px] font-semibold text-[#545C67]">
            Goal {fmt(goal)}
          </span>
        </motion.div>
        <div className={range === "week" ? "flex h-full items-end gap-2.5" : "flex h-full items-end gap-[3px]"}>
          {points.map((p, i) => {
            const v = p.value;
            const met = v !== null && v >= goal;
            const isSel = sel === i;
            return (
              <button
                key={`${range}-${p.label}`}
                disabled={v === null}
                aria-label={v === null ? `${p.label}, no data yet` : `${p.label}: ${fmt(v)} ${m.unit}`}
                aria-pressed={isSel}
                onClick={() => setSel(isSel ? null : i)}
                className="relative flex h-full flex-1 items-end"
              >
                {v === null ? (
                  <span className="block h-2 w-full rounded-full border border-dashed border-[#C9CED5]" />
                ) : (
                  <motion.span
                    className="block w-full origin-bottom"
                    style={{
                      height: "100%",
                      background: m.color,
                      borderRadius: range === "week" ? 8 : 3,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{
                      scaleY: v / max,
                      opacity: sel === null ? (met ? 1 : 0.38) : isSel ? 1 : 0.22,
                    }}
                    transition={{ ...SPRING, delay: range === "week" ? i * 0.03 : i * 0.008 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className={range === "week" ? "mt-2 flex gap-2.5" : "mt-2 flex justify-between"}>
        {range === "week"
          ? points.map((p) => (
              <span key={p.label} className="flex-1 text-center text-[11px] font-medium text-[#545C67]">
                {p.short}
              </span>
            ))
          : points
              .filter((_, i) => i % 7 === 1)
              .map((p) => (
                <span key={p.label} className="text-[11px] font-medium text-[#545C67]">
                  {p.label}
                </span>
              ))}
      </div>
    </div>
  );
}

const GOAL_KEYS: (keyof Goals)[] = ["move", "exercise", "stand", "steps", "water"];

export function ProgressScreen() {
  const { state, dispatch, days } = usePulse();
  const [range, setRange] = useState<Range>("week");
  const [metric, setMetric] = useState<Metric>("steps");
  const g = state.goals;
  const today = days[TODAY_INDEX];

  const points: Point[] =
    range === "week"
      ? days.map((d) => ({
          label: `${d.weekday}, ${d.date} ${d.month}`,
          short: d.short,
          value: d.isFuture ? null : d[metric],
        }))
      : MONTH.map((d, i) => ({
          label: d.label,
          short: d.label,
          value: i === MONTH.length - 1 ? today[metric] : d[metric],
        }));

  return (
    <div className="flex flex-col gap-3 px-4 pb-6">
      <Segmented
        id="range"
        label="Range"
        value={range}
        onChange={setRange}
        options={[
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
      />
      <Card>
        <div className="mb-4 flex gap-1.5">
          {(Object.keys(METRIC) as Metric[]).map((k) => {
            const active = k === metric;
            return (
              <button
                key={k}
                aria-pressed={active}
                onClick={() => setMetric(k)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ring-1 transition-colors",
                  active ? "bg-[#14171C] text-white ring-transparent" : "bg-white text-[#545C67] ring-[#E4E7EB]",
                )}
              >
                <span className="size-2 rounded-full" style={{ background: k === "steps" ? (active ? "#fff" : C.ink) : METRIC[k].color }} />
                {METRIC[k].label}
              </button>
            );
          })}
        </div>
        <BarChart key={`${range}-${metric}`} points={points} goal={g[metric]} metric={metric} range={range} />
      </Card>

      <Card>
        <CardHead title="Daily goals" icon={Target} right={<span className="text-[12px] text-[#545C67]">Rings update live</span>} />
        <div className="mb-3 flex items-center gap-4 rounded-[16px] bg-[#F4F5F7] p-3">
          <Rings
            size={72}
            stroke={7.5}
            gap={2}
            label="Today's rings with the current goals"
            values={{ move: today.move / g.move, exercise: today.exercise / g.exercise, stand: today.stand / g.stand }}
          />
          <p className="text-[13px] leading-snug text-[#545C67]">
            Today at these goals:{" "}
            <span className="font-semibold text-[#14171C]">
              Move {Math.round((today.move / g.move) * 100)}%, Exercise {Math.round((today.exercise / g.exercise) * 100)}%, Stand{" "}
              {Math.round((today.stand / g.stand) * 100)}%
            </span>
          </p>
        </div>
        <ul className="divide-y divide-[#E4E7EB]">
          {GOAL_KEYS.map((k) => {
            const lim = GOAL_LIMITS[k];
            return (
              <li key={k} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-[12px] font-semibold text-[#545C67]">{lim.label}</p>
                  <p className="flex items-baseline gap-1">
                    <Num value={fmt(g[k])} className="text-[28px]" />
                    <span className="text-[12px] text-[#545C67]">{lim.unit}</span>
                  </p>
                </div>
                <Stepper
                  label={`${lim.label} goal`}
                  value={g[k]}
                  min={lim.min}
                  max={lim.max}
                  step={lim.step}
                  onChange={(value) => dispatch({ type: "goal", key: k, value })}
                />
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <CardHead title="Personal records" icon={Medal} />
        <ul className="grid grid-cols-2 gap-x-3 gap-y-4">
          {RECORDS.map((r) => (
            <li key={r.label}>
              <p className="text-[12px] font-semibold text-[#545C67]">{r.label}</p>
              <p className="flex items-baseline gap-1">
                <Num value={r.value} className="text-[32px]" />
                {r.unit ? <span className="text-[12px] text-[#545C67]">{r.unit}</span> : null}
              </p>
              <p className="text-[11px] leading-snug text-[#6B7380]">{r.context}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
