"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { EARLIER, TODAY_INDEX, WORKOUT_KINDS, WORKOUT_ORDER, duration, fmt, type Workout, type WorkoutType } from "../data";
import { usePulse } from "../store";
import { NUM_STYLE, SPRING } from "../tokens";
import { Card, STROKE, WORKOUT_ICON, WorkoutRow } from "../ui";

type Filter = "all" | WorkoutType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "run", label: "Run" },
  { value: "ride", label: "Cycle" },
  { value: "strength", label: "Strength" },
  { value: "hiit", label: "HIIT" },
  { value: "swim", label: "Swim" },
  { value: "yoga", label: "Yoga" },
  { value: "walk", label: "Walk" },
];

export function WorkoutsScreen() {
  const { state, dispatch, days } = usePulse();
  const [filter, setFilter] = useState<Filter>("all");
  const newIds = new Set(state.added.map((w) => w.id));

  const groups = useMemo(() => {
    const thisWeek = days
      .slice(0, TODAY_INDEX + 1)
      .map((d, i) => ({
        label: i === TODAY_INDEX ? "Today" : i === TODAY_INDEX - 1 ? "Yesterday" : `${d.weekday}, ${d.date} ${d.month}`,
        workouts: d.workouts,
      }))
      .reverse();
    return [...thisWeek, ...EARLIER]
      .map((g) => ({ ...g, workouts: g.workouts.filter((w) => filter === "all" || w.type === filter) }))
      .filter((g) => g.workouts.length > 0);
  }, [days, filter]);

  const week: Workout[] = days.slice(0, TODAY_INDEX + 1).flatMap((d) => d.workouts);
  const weekSec = week.reduce((n, w) => n + w.durationSec, 0);
  const weekKcal = week.reduce((n, w) => n + w.kcal, 0);
  const weekKm = week.reduce((n, w) => n + (w.distanceKm ?? 0), 0);

  return (
    <div className="flex flex-col gap-3 px-4 pb-6">
      <Card className="bg-[#14171C] ring-0">
        <p className="text-[12px] font-medium text-white/70">This week</p>
        <dl className="mt-2 grid grid-cols-[1.2fr_1fr_1fr] gap-2 text-white">
          {[
            { k: "Time", v: duration(weekSec) },
            { k: "Active kcal", v: fmt(weekKcal) },
            { k: "km", v: weekKm.toFixed(1) },
          ].map((s) => (
            <div key={s.k}>
              <dd className="text-[32px] font-semibold leading-none" style={NUM_STYLE}>
                {s.v}
              </dd>
              <dt className="mt-1 text-[12px] text-white/70">{s.k}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[12px] text-white/70">{week.length} sessions since Monday</p>
      </Card>

      <section aria-labelledby="pulse-quick">
        <div className="mb-2 flex items-baseline justify-between px-1 pt-2">
          <h2 id="pulse-quick" className="text-[17px] font-semibold tracking-[-0.02em] text-[#14171C]">
            Start a workout
          </h2>
          <button
            onClick={() => dispatch({ type: "flow", open: true })}
            className="text-[13px] font-semibold text-[#CC3D22]"
          >
            All types
          </button>
        </div>
        <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {WORKOUT_ORDER.map((t) => {
            const Icon = WORKOUT_ICON[t];
            const k = WORKOUT_KINDS[t];
            return (
              <button
                key={t}
                onClick={() => dispatch({ type: "flow", open: true, preset: t })}
                className="flex w-[118px] shrink-0 snap-start flex-col items-start gap-6 rounded-[20px] bg-white p-3.5 text-left ring-1 ring-[#E4E7EB] transition active:scale-[0.97]"
              >
                <span className="flex w-full items-center justify-between">
                  <Icon size={20} strokeWidth={STROKE} className="text-[#14171C]" />
                  <span className="grid size-7 place-items-center rounded-full bg-[#FDECE7] text-[#CC3D22]">
                    <Play size={12} strokeWidth={STROKE} fill="currentColor" />
                  </span>
                </span>
                <span className="text-[14px] font-semibold leading-tight text-[#14171C]">{k.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="pulse-history">
        <h2 id="pulse-history" className="px-1 pt-3 pb-2 text-[17px] font-semibold tracking-[-0.02em] text-[#14171C]">
          History
        </h2>
        <div role="tablist" aria-label="Filter by type" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          {FILTERS.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "relative shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 transition-colors",
                  active ? "text-white ring-transparent" : "bg-white text-[#545C67] ring-[#E4E7EB]",
                )}
              >
                {active ? (
                  <motion.span layoutId="pulse-filter" transition={SPRING} className="absolute inset-0 rounded-full bg-[#14171C]" />
                ) : null}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {groups.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[22px] border border-dashed border-[#C9CED5] px-5 py-8 text-center"
            >
              <p className="text-[15px] font-semibold text-[#14171C]">No {FILTERS.find((f) => f.value === filter)?.label.toLowerCase()} sessions in the last two weeks</p>
              <p className="mt-1 text-[13px] text-[#545C67]">Record one now and it will show up here.</p>
              <button
                onClick={() => dispatch({ type: "flow", open: true, preset: filter === "all" ? undefined : filter })}
                className="mt-4 rounded-full bg-[#CC3D22] px-4 py-2 text-[13px] font-semibold text-white"
              >
                Start workout
              </button>
            </motion.div>
          ) : (
            groups.map((g) => (
              <motion.div
                key={g.label}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={SPRING}
                className="mb-3"
              >
                <Card className="py-1">
                  <p className="pt-3 text-[12px] font-semibold text-[#545C67]">{g.label}</p>
                  <ul className="divide-y divide-[#E4E7EB]">
                    {g.workouts.map((w) => (
                      <WorkoutRow key={w.id} workout={w} fresh={newIds.has(w.id)} />
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
