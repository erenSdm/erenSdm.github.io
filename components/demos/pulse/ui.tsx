"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bike,
  Dumbbell,
  Footprints,
  Flame,
  Minus,
  Plus,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { clock, type Workout, type WorkoutType } from "./data";
import { C, NUM_STYLE, SPRING } from "./tokens";

export const STROKE = 1.75;

export const WORKOUT_ICON: Record<WorkoutType, LucideIcon> = {
  run: Footprints,
  ride: Bike,
  strength: Dumbbell,
  hiit: Zap,
  swim: Waves,
  yoga: Wind,
  walk: Footprints,
};

export const MoveIcon = Flame;

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-[22px] bg-white p-4 shadow-[0_1px_0_rgba(20,23,28,0.04),0_8px_24px_-16px_rgba(20,23,28,0.18)] ring-1 ring-[#E4E7EB]/70",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHead({
  title,
  icon: Icon,
  color = C.ink,
  right,
}: {
  title: string;
  icon?: LucideIcon;
  color?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.01em]" style={{ color }}>
        {Icon ? <Icon size={15} strokeWidth={STROKE} aria-hidden /> : null}
        {title}
      </h2>
      {right}
    </header>
  );
}

/**
 * Condensed numeral that slides when its value changes.
 * `dir` controls whether new values enter from below (+1) or above (-1).
 */
export function Num({
  value,
  className,
  dir = 1,
  color = C.ink,
}: {
  value: string;
  className?: string;
  dir?: 1 | -1;
  color?: string;
}) {
  return (
    <span className={cn("relative inline-flex overflow-hidden leading-[0.9]", className)} style={{ ...NUM_STYLE, color }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: `${dir * 60}%`, opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: `${dir * -60}%`, opacity: 0 }}
          transition={SPRING}
          className="inline-block font-semibold"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  id,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  id: string;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex rounded-full bg-[#ECEEF1] p-[3px]">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative flex-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
              active ? "text-[#14171C]" : "text-[#545C67]",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`seg-${id}`}
                transition={SPRING}
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(20,23,28,0.12)]"
              />
            ) : null}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Stepper({
  value,
  label,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  label: string;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  const btn =
    "grid size-9 place-items-center rounded-full bg-[#F1F2F4] text-[#14171C] transition active:scale-[0.94] disabled:opacity-35";
  return (
    <div className="flex items-center gap-2">
      <button
        className={btn}
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <Minus size={16} strokeWidth={STROKE} />
      </button>
      <button
        className={btn}
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <Plus size={16} strokeWidth={STROKE} />
      </button>
    </div>
  );
}

export function Bar({ value, color, track = "#EEF0F2" }: { value: number; color: string; track?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: track }}>
      <motion.div
        className="h-full origin-left rounded-full"
        style={{ background: color }}
        initial={false}
        animate={{ scaleX: Math.max(0.02, Math.min(1, value)) }}
        transition={SPRING}
      />
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={cn("relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors", on ? "bg-[#CC3D22]" : "bg-[#D9DDE2]")}
    >
      <motion.span
        className="absolute top-[3px] left-[3px] size-6 rounded-full bg-white shadow-[0_1px_3px_rgba(20,23,28,0.25)]"
        animate={{ x: on ? 20 : 0 }}
        transition={SPRING}
      />
    </button>
  );
}

export function WorkoutRow({ workout, fresh = false }: { workout: Workout; fresh?: boolean }) {
  const Icon = WORKOUT_ICON[workout.type];
  const mins = Math.round(workout.durationSec / 60);
  return (
    <motion.li
      layout
      initial={fresh ? { opacity: 0, y: -8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="flex items-center gap-3 py-3"
    >
      <span
        className="grid size-10 shrink-0 place-items-center rounded-[12px]"
        style={{ background: fresh ? C.accentSoft : "#F1F2F4", color: fresh ? C.accent : C.ink }}
      >
        <Icon size={18} strokeWidth={STROKE} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold text-[#14171C]">{workout.title}</span>
        <span className="block truncate text-[12px] text-[#545C67]">
          {clock(workout.start)} · {workout.place}
        </span>
      </span>
      <span className="text-right">
        <span className="block text-[15px] font-semibold text-[#14171C]" style={NUM_STYLE}>
          {workout.distanceKm ? `${workout.distanceKm.toFixed(2)} km` : `${mins} min`}
        </span>
        <span className="block text-[12px] text-[#545C67]" style={{ fontVariantNumeric: "tabular-nums" }}>
          {workout.distanceKm ? `${mins} min · ` : ""}
          {workout.kcal} kcal
        </span>
      </span>
    </motion.li>
  );
}
