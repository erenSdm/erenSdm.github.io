"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Flame,
  Footprints,
  Dumbbell,
  Bike,
  Heart,
  ChevronRight,
  House,
  Activity,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityRings } from "./ActivityRings";
import { HeartRateGraph } from "./HeartRateGraph";
import {
  RINGS,
  STATS,
  WORKOUTS,
  HR_META,
  TODAY,
  type WorkoutType,
} from "./data";

const WORKOUT_ICON: Record<WorkoutType, LucideIcon> = {
  run: Footprints,
  strength: Dumbbell,
  ride: Bike,
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Outer-shell + inner-core card (double-bezel). */
function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/[0.06] bg-white/[0.02] p-1">
      <div
        className={cn(
          "rounded-[1.25rem] border border-white/[0.05] bg-coal/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PulseScreen() {
  const reduce = useReducedMotion();
  const move = RINGS.find((r) => r.key === "move")!;
  const remaining = Math.max(0, move.goal - move.current);

  return (
    <div className="flex h-full flex-col bg-ink text-paper">
      {/* ambient warmth from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(240,101,74,0.12), transparent 70%)",
        }}
      />

      <motion.main
        variants={reduce ? undefined : container}
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "show"}
        className="relative flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* ── Header ─────────────────────────────── */}
        <motion.header
          variants={reduce ? undefined : item}
          className="flex items-start justify-between"
        >
          <div>
            <p className="label flex items-center gap-2 text-[0.6rem]">
              <span className="text-paper">
                {TODAY.weekday} · {TODAY.day} {TODAY.month}
              </span>
            </p>
            <h1 className="mt-1.5 font-grotesk text-[1.35rem] font-semibold leading-tight tracking-tight">
              {TODAY.greeting},
              <br />
              {TODAY.name}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full border border-[#F0654A]/25 bg-[#F0654A]/10 px-2.5 py-1.5">
              <Flame className="h-3.5 w-3.5 text-[#F0654A]" strokeWidth={2} />
              <span className="font-mono text-xs font-medium text-paper">
                {TODAY.streak}
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TODAY.avatar}
              alt="Your profile"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-white/10 object-cover"
            />
          </div>
        </motion.header>

        {/* ── Rings hero ─────────────────────────── */}
        <motion.section variants={reduce ? undefined : item} className="mt-5">
          <Panel className="!p-5">
            <ActivityRings />

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
              {RINGS.map((r) => (
                <div key={r.key} className="flex flex-col items-center gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="label text-[0.55rem]">{r.label}</span>
                  </span>
                  <span className="font-mono text-sm text-paper">
                    {r.current}
                    <span className="text-[0.6rem] text-ash">/{r.goal}</span>
                  </span>
                  <span className="label text-[0.5rem] text-dim">{r.unit}</span>
                </div>
              ))}
            </div>
          </Panel>
        </motion.section>

        {/* ── Stat row ───────────────────────────── */}
        <motion.section
          variants={reduce ? undefined : item}
          className="mt-3 grid grid-cols-4 overflow-hidden rounded-[1.25rem] border border-white/[0.06] bg-white/[0.02]"
        >
          {STATS.map((s, i) => (
            <div
              key={s.key}
              className={cn(
                "flex flex-col items-center gap-1 px-1 py-3.5",
                i !== 0 && "border-l border-white/[0.06]"
              )}
            >
              <span className="font-mono text-base leading-none text-paper">
                {s.value}
              </span>
              <span className="font-mono text-[0.55rem] text-ash">
                {s.unit || " "}
              </span>
              <span className="label mt-0.5 text-[0.5rem] text-dim">
                {s.label}
              </span>
            </div>
          ))}
        </motion.section>

        {/* ── Heart-rate mini graph ──────────────── */}
        <motion.section variants={reduce ? undefined : item} className="mt-3">
          <Panel>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#F0654A]/12">
                  <Heart
                    className="h-3.5 w-3.5 text-[#F0654A]"
                    strokeWidth={2.5}
                    fill="#F0654A"
                  />
                </span>
                <span className="label text-[0.6rem]">Heart Rate</span>
              </div>
              <div className="flex items-baseline gap-1">
                <motion.span
                  aria-hidden
                  className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#F0654A]"
                  animate={
                    reduce ? undefined : { opacity: [1, 0.25, 1], scale: [1, 0.8, 1] }
                  }
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="font-mono text-xl leading-none text-paper">
                  {HR_META.current}
                </span>
                <span className="font-mono text-[0.6rem] text-ash">bpm</span>
              </div>
            </div>

            <div className="mt-3">
              <HeartRateGraph />
            </div>

            <div className="mt-2 flex items-center justify-between font-mono text-[0.6rem] text-dim">
              <span>{HR_META.restingLabel}</span>
              <span>
                {HR_META.min}–{HR_META.max} bpm today
              </span>
            </div>
          </Panel>
        </motion.section>

        {/* ── Workouts ───────────────────────────── */}
        <motion.section variants={reduce ? undefined : item} className="mt-5">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <h2 className="label text-[0.6rem] text-bone">Today's Activity</h2>
            <span className="label text-[0.55rem] text-dim">3 sessions</span>
          </div>

          <ul className="flex flex-col gap-2">
            {WORKOUTS.map((w) => {
              const Icon = WORKOUT_ICON[w.type];
              return (
                <li key={w.id}>
                  <button
                    type="button"
                    className="group flex w-full items-center gap-3 rounded-[1.1rem] border border-white/[0.06] bg-white/[0.02] p-2.5 text-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem]"
                      style={{ backgroundColor: `${w.accent}1f` }}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={2}
                        style={{ color: w.accent }}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-grotesk text-sm font-medium text-paper">
                          {w.title}
                        </span>
                        <span className="shrink-0 font-mono text-[0.6rem] text-ash">
                          {w.time}
                        </span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 font-mono text-[0.65rem] text-ash">
                        <span className="truncate">{w.detail}</span>
                      </span>
                      <span className="mt-1 flex items-center gap-2.5 font-mono text-[0.6rem]">
                        <span style={{ color: w.accent }}>{w.kcal} kcal</span>
                        <span className="text-dim">·</span>
                        <span className="text-ash">{w.minutes} min</span>
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-dim transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.section>

        {/* ── Close-your-rings nudge ─────────────── */}
        <motion.section variants={reduce ? undefined : item} className="mt-3">
          <div
            className="relative overflow-hidden rounded-[1.4rem] p-[1px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(240,101,74,0.45), rgba(155,194,78,0.16) 60%, transparent)",
            }}
          >
            <div className="rounded-[1.35rem] bg-coal/90 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-grotesk text-sm font-semibold text-paper">
                    Close your Move ring
                  </p>
                  <p className="mt-1 font-mono text-[0.7rem] text-ash">
                    <span className="text-[#F0654A]">{remaining} kcal</span> to go
                    — a brisk 20-min walk does it.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#F0654A] pl-4 pr-2 text-xs font-semibold text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97]"
                >
                  Start
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/15">
                    <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                </button>
              </div>

              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #F0654A, #F79172)",
                  }}
                  initial={{ width: reduce ? `${move.value}%` : "0%" }}
                  animate={{ width: `${move.value}%` }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>

      {/* ── Bottom nav ───────────────────────────── */}
      <nav className="relative flex shrink-0 items-center justify-around border-t border-white/[0.06] bg-ink/95 px-2 pb-3 pt-2.5 backdrop-blur-sm">
        {[
          { icon: House, label: "Today", active: true },
          { icon: Activity, label: "Trends", active: false },
          { icon: Trophy, label: "Awards", active: false },
          { icon: User, label: "You", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-1 transition-colors",
              active ? "text-[#F0654A]" : "text-dim"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
            <span className="font-mono text-[0.55rem] tracking-wide">
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
