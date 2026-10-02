"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Droplet, Flame, Footprints, HeartPulse, Minus, MoonStar, Plus, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { GLASS_ML, TODAY_INDEX, fmt, type Day, type Sleep } from "../data";
import { Rings } from "../Rings";
import { HeartRateChart } from "../HeartRateChart";
import { usePulse } from "../store";
import { C, NUM_STYLE, RING_META, SPRING, type RingKey } from "../tokens";
import { Bar, Card, CardHead, Num, STROKE, WorkoutRow } from "../ui";

function DayStrip() {
  const { state, dispatch, days } = usePulse();
  const g = state.goals;
  return (
    <div role="tablist" aria-label="Choose a day this week" className="grid grid-cols-7 gap-1">
      {days.map((d, i) => {
        const active = i === state.day;
        return (
          <button
            key={d.key}
            role="tab"
            aria-selected={active}
            aria-label={`${d.weekday} ${d.date} ${d.month}${d.isFuture ? ", upcoming" : ""}`}
            disabled={d.isFuture}
            onClick={() => dispatch({ type: "day", day: i })}
            className="relative flex flex-col items-center gap-1.5 rounded-[16px] py-2 transition active:scale-[0.96] disabled:opacity-40"
          >
            {active ? (
              <motion.span layoutId="pulse-day" transition={SPRING} className="absolute inset-0 rounded-[16px] bg-[#14171C]" />
            ) : null}
            <span className={cn("relative text-[11px] font-medium", active ? "text-white/75" : "text-[#545C67]")}>
              {d.isToday ? "Today" : d.short}
            </span>
            <span className="relative">
              {d.isFuture ? (
                <span className="block size-[30px] rounded-full border-[3.5px] border-dashed border-[#C9CED5]" />
              ) : (
                <span className={cn("block rounded-full", active && "bg-white")}>
                  <Rings
                    size={30}
                    stroke={3.5}
                    gap={1}
                    values={{ move: d.move / g.move, exercise: d.exercise / g.exercise, stand: d.stand / g.stand }}
                  />
                </span>
              )}
            </span>
            <span
              className={cn("relative text-[15px] font-semibold", active ? "text-white" : "text-[#14171C]")}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {d.date}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ActivityCard({ day }: { day: Day }) {
  const { state, dispatch } = usePulse();
  const g = state.goals;
  const values: Record<RingKey, number> = { move: day.move, exercise: day.exercise, stand: day.stand };
  const goals: Record<RingKey, number> = { move: g.move, exercise: g.exercise, stand: g.stand };
  const left = g.move - day.move;
  return (
    <Card>
      <div className="flex items-center gap-4">
        <Rings
          size={148}
          stroke={15}
          gap={3}
          label={`Move ${day.move} of ${g.move} kcal, exercise ${day.exercise} of ${g.exercise} minutes, stand ${day.stand} of ${g.stand} hours`}
          values={{ move: day.move / g.move, exercise: day.exercise / g.exercise, stand: day.stand / g.stand }}
        />
        <dl className="flex min-w-0 flex-1 flex-col gap-3">
          {(Object.keys(RING_META) as RingKey[]).map((k) => (
            <div key={k}>
              <dt className="text-[12px] font-semibold" style={{ color: RING_META[k].text }}>
                {RING_META[k].label}
              </dt>
              <dd className="flex items-baseline gap-1">
                <Num value={fmt(values[k])} dir={state.dir} className="text-[30px]" />
                <span className="text-[12px] text-[#545C67]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  / {fmt(goals[k])} {RING_META[k].unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E4E7EB] pt-3">
        <p className="text-[13px] text-[#545C67]">
          {left > 0 ? (
            <>
              <span className="font-semibold text-[#14171C]">{left} kcal</span> left to close Move
            </>
          ) : (
            <>
              Move closed, <span className="font-semibold text-[#14171C]">+{-left} kcal</span> over
            </>
          )}
        </p>
        {day.isToday ? (
          <button
            onClick={() => dispatch({ type: "flow", open: true })}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#CC3D22] px-3.5 py-2 text-[13px] font-semibold text-white transition active:scale-[0.97]"
          >
            <Play size={14} strokeWidth={STROKE} fill="currentColor" aria-hidden />
            Start workout
          </button>
        ) : null}
      </div>
    </Card>
  );
}

function StepsCard({ day }: { day: Day }) {
  const { state } = usePulse();
  const goal = state.goals.steps;
  const pct = Math.round((day.steps / goal) * 100);
  return (
    <Card>
      <CardHead title="Steps" icon={Footprints} right={<span className="text-[12px] text-[#545C67]">{pct}% of {fmt(goal)}</span>} />
      <Num value={fmt(day.steps)} dir={state.dir} className="text-[68px]" />
      <div className="mt-3">
        <Bar value={day.steps / goal} color={C.ink} />
      </div>
      <div className="mt-2.5 flex gap-4 text-[12px] text-[#545C67]" style={{ fontVariantNumeric: "tabular-nums" }}>
        <span>
          <span className="font-semibold text-[#14171C]">{day.distanceKm.toFixed(2)}</span> km
        </span>
        <span>
          <span className="font-semibold text-[#14171C]">{day.floors}</span> floors
        </span>
        <span>
          <span className="font-semibold text-[#14171C]">{fmt(Math.max(0, goal - day.steps))}</span> to goal
        </span>
      </div>
    </Card>
  );
}

function WaterCard({ index }: { index: number }) {
  const { state, dispatch } = usePulse();
  const count = state.water[index];
  const goal = state.goals.water;
  const tiles = Math.max(goal, count);
  const set = (value: number) => dispatch({ type: "water", day: index, value });
  const litres = (n: number) => ((n * GLASS_ML) / 1000).toFixed(2);
  return (
    <Card>
      <CardHead
        title="Water"
        icon={Droplet}
        color={C.waterText}
        right={
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Remove a glass"
              disabled={count === 0}
              onClick={() => set(count - 1)}
              className="grid size-8 place-items-center rounded-full bg-[#F1F2F4] text-[#14171C] transition active:scale-[0.94] disabled:opacity-35"
            >
              <Minus size={15} strokeWidth={STROKE} />
            </button>
            <button
              aria-label="Add a glass"
              disabled={count >= 14}
              onClick={() => set(count + 1)}
              className="grid size-8 place-items-center rounded-full bg-[#14171C] text-white transition active:scale-[0.94] disabled:opacity-35"
            >
              <Plus size={15} strokeWidth={STROKE} />
            </button>
          </div>
        }
      />
      <div className="flex items-baseline gap-1.5">
        <Num value={litres(count)} className="text-[40px]" />
        <span className="text-[13px] text-[#545C67]">of {litres(goal)} L</span>
        <AnimatePresence>
          {count > goal ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="ml-auto rounded-full bg-[#E3F2F9] px-2 py-0.5 text-[11px] font-semibold text-[#13729E]"
            >
              Goal met
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(tiles, 10)}, minmax(0, 1fr))` }}>
        {Array.from({ length: tiles }, (_, i) => {
          const filled = i < count;
          return (
            <button
              key={i}
              aria-label={`Set water to ${i + 1 === count ? i : i + 1} glasses`}
              onClick={() => set(i + 1 === count ? i : i + 1)}
              className="relative h-11 overflow-hidden rounded-[10px] bg-[#EEF4F8] transition active:scale-[0.94]"
            >
              <motion.span
                className="absolute inset-0 origin-bottom rounded-[10px]"
                style={{ background: C.water }}
                initial={false}
                animate={{ scaleY: filled ? 1 : 0 }}
                transition={{ ...SPRING, delay: filled ? 0 : 0.02 }}
              />
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[12px] text-[#545C67]">Tap a glass to log it. One glass is {GLASS_ML} ml.</p>
    </Card>
  );
}

function SleepCard({ sleep }: { sleep: Sleep }) {
  const asleep = sleep.deep + sleep.core + sleep.rem;
  const total = asleep + sleep.awake;
  const stages = [
    { k: "Deep", v: sleep.deep, c: C.sleepDeep },
    { k: "Core", v: sleep.core, c: C.sleepCore },
    { k: "REM", v: sleep.rem, c: C.sleepRem },
    { k: "Awake", v: sleep.awake, c: C.sleepAwake },
  ];
  return (
    <Card className="flex flex-col">
      <CardHead title="Sleep" icon={MoonStar} color={C.sleepDeep} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={sleep.bed}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-baseline gap-0.5" style={NUM_STYLE}>
            <span className="text-[40px] font-semibold leading-[0.9] text-[#14171C]">{Math.floor(asleep / 60)}</span>
            <span className="mr-1 text-[15px] font-semibold text-[#545C67]">h</span>
            <span className="text-[40px] font-semibold leading-[0.9] text-[#14171C]">{String(asleep % 60).padStart(2, "0")}</span>
            <span className="text-[15px] font-semibold text-[#545C67]">m</span>
          </div>
          <p className="mt-1 text-[12px] text-[#545C67]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {sleep.bed} to {sleep.wake} · score {sleep.score}
          </p>
          <div className="mt-3 flex h-2 w-full gap-[2px] overflow-hidden rounded-full">
            {stages.map((s) => (
              <motion.span
                key={s.k}
                className="h-full"
                style={{ background: s.c }}
                initial={{ flexGrow: 0 }}
                animate={{ flexGrow: s.v / total }}
                transition={SPRING}
              />
            ))}
          </div>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-[#545C67]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {stages.map((s) => (
              <li key={s.k} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: s.c }} />
                {s.k} <span className="ml-auto font-semibold text-[#14171C]">{s.v}m</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

function StreakCard() {
  const { streak, todayClosed, days, state } = usePulse();
  return (
    <Card className="flex flex-col">
      <CardHead title="Streak" icon={Flame} color={C.moveText} />
      <Num value={String(streak)} className="text-[56px]" />
      <p className="mt-1 text-[12px] leading-snug text-[#545C67]">
        {todayClosed ? "days of closed Move rings" : `days. Close Move today for ${streak + 1}.`}
      </p>
      <div className="mt-auto flex gap-1 pt-3" aria-label="This week">
        {days.slice(0, TODAY_INDEX + 1).map((d) => {
          const closed = d.move >= state.goals.move;
          return (
            <span
              key={d.key}
              title={`${d.weekday}: ${closed ? "closed" : "open"}`}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: closed ? C.move : "#E4E7EB" }}
            />
          );
        })}
      </div>
    </Card>
  );
}

export function TodayScreen() {
  const { state, days } = usePulse();
  const day = days[state.day];
  const newIds = new Set(state.added.map((w) => w.id));
  return (
    <div className="flex flex-col gap-3 px-4 pb-6">
      <DayStrip />
      <ActivityCard day={day} />
      <StepsCard day={day} />
      <Card>
        <CardHead title="Heart rate" icon={HeartPulse} color={C.moveText} />
        <HeartRateChart key={day.key} hr={day.hr} restingHr={day.restingHr} isToday={day.isToday} />
      </Card>
      <WaterCard index={state.day} />
      <div className="grid grid-cols-[1.3fr_1fr] gap-3">
        {day.sleep ? <SleepCard sleep={day.sleep} /> : null}
        <StreakCard />
      </div>
      <Card>
        <CardHead
          title={day.isToday ? "Today's workouts" : `Workouts on ${day.weekday}`}
          right={<span className="text-[12px] text-[#545C67]">{day.workouts.length} logged</span>}
        />
        <ul className="-my-3 divide-y divide-[#E4E7EB]">
          {day.workouts.map((w) => (
            <WorkoutRow key={w.id} workout={w} fresh={newIds.has(w.id)} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
