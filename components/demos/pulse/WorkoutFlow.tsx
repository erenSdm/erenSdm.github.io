"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, HeartPulse, Pause, Play, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  HR_ZONES,
  NOW_MIN,
  WORKOUT_KINDS,
  WORKOUT_ORDER,
  duration,
  zoneIndex,
  type Workout,
  type WorkoutType,
} from "./data";
import { usePulse } from "./store";
import { C, NUM_STYLE, SHEET, SPRING, ZONE_COLORS } from "./tokens";
import { STROKE, WORKOUT_ICON } from "./ui";

type Stage = "pick" | "countdown" | "live" | "summary";


interface Sim {
  elapsedMs: number;
  hr: number;
  kcal: number;
  hrSum: number;
  hrN: number;
  maxHr: number;
  zoneSec: number[];
}

const freshSim = (): Sim => ({ elapsedMs: 0, hr: 92, kcal: 0, hrSum: 0, hrN: 0, maxHr: 0, zoneSec: [0, 0, 0, 0, 0] });

/** Big timer with fixed-width digit cells so the numerals never jitter. */
function Timer({ ms, paused }: { ms: number; paused: boolean }) {
  const text = duration(ms / 1000);
  return (
    <motion.div
      aria-live="off"
      className="flex justify-center text-[104px] font-semibold leading-none text-[#14171C]"
      style={NUM_STYLE}
      animate={{ opacity: paused ? [1, 0.35, 1] : 1 }}
      transition={paused ? { duration: 1.6, repeat: Infinity } : { duration: 0.2 }}
    >
      {text.split("").map((ch, i) => (
        <span key={i} className={cn("inline-block text-center", ch === ":" ? "w-[0.26em] -translate-y-[0.06em]" : "w-[0.5em]")}>
          {ch}
        </span>
      ))}
    </motion.div>
  );
}

function ZoneMeter({ hr }: { hr: number }) {
  const z = zoneIndex(hr);
  return (
    <div>
      <div className="flex gap-1">
        {HR_ZONES.map((zone, i) => (
          <motion.span
            key={zone.name}
            className="h-2 flex-1 rounded-full"
            animate={{ background: i <= z ? ZONE_COLORS[i] : "#E4E7EB", scaleY: i === z ? 1.5 : 1 }}
            transition={SPRING}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-[#545C67]">
        <span>
          Zone {z + 1} · <span className="font-semibold text-[#14171C]">{HR_ZONES[z].name}</span>
        </span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          {HR_ZONES[z].min}–{z === 4 ? "188" : HR_ZONES[z].max} bpm
        </span>
      </div>
    </div>
  );
}

export function WorkoutFlow() {
  const { state, dispatch } = usePulse();
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("pick");
  const [type, setType] = useState<WorkoutType>(state.flowPreset ?? "run");
  const [count, setCount] = useState(3);
  const [running, setRunning] = useState(false);
  const [sim, setSim] = useState<Sim>(freshSim);
  const lastTick = useRef(0);

  const kind = WORKOUT_KINDS[type];
  const close = () => dispatch({ type: "flow", open: false });

  const start = () => {
    setSim(freshSim());
    if (reduce) {
      setStage("live");
      setRunning(true);
      return;
    }
    setCount(3);
    setStage("countdown");
  };

  // 3-2-1 countdown
  useEffect(() => {
    if (stage !== "countdown") return;
    const t = window.setTimeout(() => {
      if (count > 1) setCount((c) => c - 1);
      else {
        setStage("live");
        setRunning(true);
      }
    }, 700);
    return () => window.clearTimeout(t);
  }, [stage, count]);

  // session clock + simulated sensor
  useEffect(() => {
    if (stage !== "live") return;
    lastTick.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = now - lastTick.current;
      lastTick.current = now;
      setSim((s) => {
        const t = s.elapsedMs / 1000;
        const target = running
          ? 92 + (kind.targetHr - 92) * Math.min(1, t / 75) + Math.sin(t / 6.5) * 4 + Math.sin(t / 2.1) * 1.6
          : 98;
        const hr = s.hr + (target - s.hr) * (running ? 0.12 : 0.04);
        if (!running) return { ...s, hr };
        const sec = dt / 1000;
        const z = zoneIndex(Math.round(hr));
        const zoneSec = s.zoneSec.slice();
        zoneSec[z] += sec;
        return {
          elapsedMs: s.elapsedMs + dt,
          hr,
          kcal: s.kcal + (kind.kcalPerMin / 60) * sec * (0.6 + (0.4 * Math.min(hr, kind.targetHr)) / kind.targetHr),
          hrSum: s.hrSum + hr * sec,
          hrN: s.hrN + sec,
          maxHr: Math.max(s.maxHr, hr),
          zoneSec,
        };
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [stage, running, kind]);

  const seconds = Math.floor(sim.elapsedMs / 1000);
  const avgHr = sim.hrN > 0 ? Math.round(sim.hrSum / sim.hrN) : 0;
  const distanceKm = kind.speedKmh ? (kind.speedKmh * sim.elapsedMs) / 3_600_000 : undefined;
  const canSave = seconds >= 10;

  const save = () => {
    const workout: Workout = {
      id: `w-live-${state.added.length + 1}`,
      type,
      title: kind.title,
      place: kind.place,
      start: NOW_MIN,
      durationSec: seconds,
      kcal: Math.max(1, Math.round(sim.kcal)),
      avgHr,
      maxHr: Math.round(sim.maxHr),
      distanceKm: distanceKm ? Math.round(distanceKm * 100) / 100 : undefined,
    };
    dispatch({ type: "save", workout });
  };

  const KindIcon = WORKOUT_ICON[type];

  return (
    <div className="absolute inset-0 z-40">
      {/* scrim */}
      <motion.button
        aria-label="Close"
        className="absolute inset-0 bg-[#14171C]/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={stage === "pick" ? close : undefined}
        tabIndex={-1}
      />

      <AnimatePresence mode="wait" initial={false}>
        {stage === "pick" ? (
          <motion.div
            key="pick"
            role="dialog"
            aria-modal="true"
            aria-label="Start a workout"
            className="absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col rounded-t-[28px] bg-white"
            style={{ paddingBottom: "var(--safe-bottom)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET}
          >
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-[#D9DDE2]" />
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#14171C]">Start a workout</h2>
              <button
                onClick={close}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-full bg-[#F1F2F4] text-[#14171C]"
              >
                <X size={16} strokeWidth={STROKE} />
              </button>
            </div>
            <ul role="radiogroup" aria-label="Workout type" className="min-h-0 flex-1 overflow-y-auto px-3">
              {WORKOUT_ORDER.map((t) => {
                const k = WORKOUT_KINDS[t];
                const Icon = WORKOUT_ICON[t];
                const sel = t === type;
                return (
                  <li key={t}>
                    <button
                      role="radio"
                      aria-checked={sel}
                      onClick={() => setType(t)}
                      className="relative flex w-full items-center gap-3 rounded-[16px] px-2 py-2.5 text-left"
                    >
                      {sel ? (
                        <motion.span layoutId="pulse-pick" transition={SPRING} className="absolute inset-0 rounded-[16px] bg-[#F4F5F7]" />
                      ) : null}
                      <span
                        className="relative grid size-10 place-items-center rounded-[12px] transition-colors"
                        style={{ background: sel ? C.accent : "#F1F2F4", color: sel ? "#fff" : C.ink }}
                      >
                        <Icon size={18} strokeWidth={STROKE} />
                      </span>
                      <span className="relative min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-[#14171C]">{k.label}</span>
                        <span className="block truncate text-[12px] text-[#545C67]">
                          {k.place} · about {Math.round(k.kcalPerMin * 30)} kcal per 30 min
                        </span>
                      </span>
                      <span
                        className={cn(
                          "relative grid size-5 place-items-center rounded-full border-[1.5px] transition-colors",
                          sel ? "border-[#CC3D22] bg-[#CC3D22] text-white" : "border-[#C9CED5]",
                        )}
                      >
                        {sel ? <Check size={12} strokeWidth={2.5} /> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="px-5 pt-3 pb-3">
              <button
                onClick={start}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#CC3D22] py-3.5 text-[16px] font-semibold text-white transition active:scale-[0.98]"
              >
                <Play size={16} strokeWidth={STROKE} fill="currentColor" />
                Start {kind.label.toLowerCase()}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="session"
            role="dialog"
            aria-modal="true"
            aria-label={stage === "summary" ? "Workout summary" : `${kind.label} in progress`}
            className="absolute inset-0 flex flex-col bg-[#F4F5F7]"
            style={{ paddingTop: "var(--safe-top)", paddingBottom: "var(--safe-bottom)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET}
          >
            <div className="flex items-center gap-3 px-5 pt-2">
              <span className="grid size-10 place-items-center rounded-[12px] bg-white text-[#CC3D22] ring-1 ring-[#E4E7EB]">
                <KindIcon size={18} strokeWidth={STROKE} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-[#14171C]">{stage === "summary" ? kind.title : kind.label}</p>
                <p className="truncate text-[12px] text-[#545C67]">{kind.place}</p>
              </div>
              {stage === "summary" ? null : (
                <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-[#14171C] ring-1 ring-[#E4E7EB]">
                  <span className={cn("size-1.5 rounded-full", running ? "bg-[#0E9670]" : "bg-[#E39B1B]")} />
                  {stage === "countdown" ? "Ready" : running ? "Recording" : "Paused"}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {stage === "countdown" ? (
                <motion.div
                  key="count"
                  className="grid flex-1 place-items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={count}
                      className="text-[180px] font-semibold leading-none text-[#CC3D22]"
                      style={NUM_STYLE}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.3, opacity: 0 }}
                      transition={SPRING}
                    >
                      {count}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              ) : stage === "live" ? (
                <motion.div
                  key="live"
                  className="flex flex-1 flex-col px-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-center text-[12px] font-medium tracking-[0.04em] text-[#545C67] uppercase">Elapsed</p>
                    <Timer ms={sim.elapsedMs} paused={!running} />
                  </div>

                  <div className="rounded-[22px] bg-white p-4 ring-1 ring-[#E4E7EB]">
                    <div className="mb-3 flex items-end justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <HeartPulse size={16} strokeWidth={STROKE} className="self-center text-[#CC3D22]" />
                        <span className="text-[44px] font-semibold leading-[0.9] text-[#14171C]" style={NUM_STYLE}>
                          {Math.round(sim.hr)}
                        </span>
                        <span className="text-[13px] text-[#545C67]">bpm</span>
                      </div>
                      <div className="text-right text-[12px] text-[#545C67]" style={{ fontVariantNumeric: "tabular-nums" }}>
                        <div>
                          Avg <span className="font-semibold text-[#14171C]">{avgHr || "--"}</span>
                        </div>
                        <div>
                          Max <span className="font-semibold text-[#14171C]">{sim.maxHr ? Math.round(sim.maxHr) : "--"}</span>
                        </div>
                      </div>
                    </div>
                    <ZoneMeter hr={Math.round(sim.hr)} />
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-[22px] bg-white p-4 ring-1 ring-[#E4E7EB]">
                      <dt className="text-[12px] font-semibold text-[#C23A1F]">Active kcal</dt>
                      <dd className="text-[34px] font-semibold leading-none text-[#14171C]" style={NUM_STYLE}>
                        {Math.round(sim.kcal)}
                      </dd>
                    </div>
                    <div className="rounded-[22px] bg-white p-4 ring-1 ring-[#E4E7EB]">
                      <dt className="text-[12px] font-semibold text-[#545C67]">{distanceKm !== undefined ? "Distance" : "Exercise"}</dt>
                      <dd className="text-[34px] font-semibold leading-none text-[#14171C]" style={NUM_STYLE}>
                        {distanceKm !== undefined ? `${distanceKm.toFixed(2)}` : Math.floor(seconds / 60)}
                        <span className="ml-1 text-[14px] text-[#545C67]">{distanceKm !== undefined ? "km" : "min"}</span>
                      </dd>
                    </div>
                  </dl>

                  <div className="flex items-center justify-center gap-6 py-6">
                    <button
                      onClick={() => {
                        setRunning(false);
                        setStage("summary");
                      }}
                      className="flex flex-col items-center gap-1.5 text-[12px] font-medium text-[#545C67]"
                    >
                      <span className="grid size-14 place-items-center rounded-full bg-white text-[#14171C] ring-1 ring-[#E4E7EB] transition active:scale-[0.95]">
                        <Square size={18} strokeWidth={STROKE} fill="currentColor" />
                      </span>
                      End
                    </button>
                    <button
                      onClick={() => setRunning((r) => !r)}
                      className="flex flex-col items-center gap-1.5 text-[12px] font-medium text-[#545C67]"
                    >
                      <motion.span
                        className="grid size-20 place-items-center rounded-full text-white transition active:scale-[0.95]"
                        animate={{ background: running ? C.accent : C.exercise }}
                      >
                        {running ? (
                          <Pause size={26} strokeWidth={STROKE} fill="currentColor" />
                        ) : (
                          <Play size={26} strokeWidth={STROKE} fill="currentColor" />
                        )}
                      </motion.span>
                      {running ? "Pause" : "Resume"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="summary"
                  className="flex min-h-0 flex-1 flex-col px-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={SPRING}
                >
                  <div className="min-h-0 flex-1 overflow-y-auto pt-6">
                    <p className="text-[12px] font-medium tracking-[0.04em] text-[#545C67] uppercase">Workout complete</p>
                    <p className="mt-1 text-[88px] font-semibold leading-[0.85] text-[#14171C]" style={NUM_STYLE}>
                      {duration(seconds)}
                    </p>
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#E4E7EB] pt-4">
                      {[
                        { k: "Active kcal", v: String(Math.round(sim.kcal)) },
                        { k: "Avg heart rate", v: avgHr ? `${avgHr} bpm` : "--" },
                        { k: "Max heart rate", v: sim.maxHr ? `${Math.round(sim.maxHr)} bpm` : "--" },
                        distanceKm !== undefined
                          ? { k: "Distance", v: `${distanceKm.toFixed(2)} km` }
                          : { k: "Exercise", v: `${Math.round(seconds / 60)} min` },
                      ].map((s) => (
                        <div key={s.k}>
                          <dt className="text-[12px] text-[#545C67]">{s.k}</dt>
                          <dd className="text-[28px] font-semibold leading-tight text-[#14171C]" style={NUM_STYLE}>
                            {s.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-5 rounded-[22px] bg-white p-4 ring-1 ring-[#E4E7EB]">
                      <p className="mb-2.5 text-[13px] font-semibold text-[#14171C]">Time in zones</p>
                      <ul className="flex flex-col gap-2">
                        {HR_ZONES.map((z, i) => {
                          const sec = sim.zoneSec[i];
                          const share = sim.hrN > 0 ? sec / sim.hrN : 0;
                          return (
                            <li key={z.name} className="flex items-center gap-2 text-[12px] text-[#545C67]">
                              <span className="w-[68px] shrink-0">{z.name}</span>
                              <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF0F2]">
                                <motion.span
                                  className="block h-full origin-left rounded-full"
                                  style={{ background: ZONE_COLORS[i] }}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: share }}
                                  transition={{ ...SPRING, delay: 0.1 + i * 0.05 }}
                                />
                              </span>
                              <span className="w-10 text-right font-semibold text-[#14171C]" style={{ fontVariantNumeric: "tabular-nums" }}>
                                {duration(sec)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {!canSave ? (
                      <p role="alert" className="mt-3 text-[13px] font-medium text-[#C23A1F]">
                        Record at least 10 seconds to save this workout.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2.5 py-4">
                    <button
                      onClick={() => {
                        setStage("live");
                        setRunning(true);
                      }}
                      aria-label="Back to workout"
                      className="grid size-[52px] shrink-0 place-items-center rounded-full bg-white text-[#14171C] ring-1 ring-[#E4E7EB]"
                    >
                      <ChevronLeft size={20} strokeWidth={STROKE} />
                    </button>
                    <button
                      onClick={close}
                      className="h-[52px] flex-1 rounded-full bg-white text-[15px] font-semibold text-[#14171C] ring-1 ring-[#E4E7EB] transition active:scale-[0.98]"
                    >
                      Discard
                    </button>
                    <button
                      onClick={save}
                      disabled={!canSave}
                      className="h-[52px] flex-[1.6] rounded-full bg-[#CC3D22] text-[15px] font-semibold text-white transition active:scale-[0.98] disabled:bg-[#D9DDE2] disabled:text-[#545C67]"
                    >
                      Save to today
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
