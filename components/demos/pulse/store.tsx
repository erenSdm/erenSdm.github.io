"use client";

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import {
  DEFAULT_GOALS,
  STREAK_BEFORE_WEEK,
  TODAY_INDEX,
  WEEK,
  type Day,
  type Goals,
  type Workout,
  type WorkoutType,
} from "./data";

export type Tab = "today" | "workouts" | "progress" | "profile";

export interface Prefs {
  reminders: boolean;
  weeklyDigest: boolean;
  autoPause: boolean;
}

interface State {
  tab: Tab;
  day: number;
  /** +1 when moving forward in the week, -1 backward (drives slide direction) */
  dir: 1 | -1;
  goals: Goals;
  water: number[];
  /** sessions recorded in the demo, always on today */
  added: Workout[];
  flowOpen: boolean;
  flowPreset: WorkoutType | null;
  toast: { id: number; text: string } | null;
  prefs: Prefs;
}

type Action =
  | { type: "tab"; tab: Tab }
  | { type: "day"; day: number }
  | { type: "goal"; key: keyof Goals; value: number }
  | { type: "water"; day: number; value: number }
  | { type: "flow"; open: boolean; preset?: WorkoutType }
  | { type: "save"; workout: Workout }
  | { type: "toast"; text: string | null }
  | { type: "pref"; key: keyof Prefs };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "tab":
      return { ...s, tab: a.tab };
    case "day":
      if (a.day === s.day || WEEK[a.day]?.isFuture) return s;
      return { ...s, day: a.day, dir: a.day > s.day ? 1 : -1 };
    case "goal":
      return { ...s, goals: { ...s.goals, [a.key]: a.value } };
    case "water": {
      const water = s.water.slice();
      water[a.day] = Math.max(0, Math.min(14, a.value));
      return { ...s, water };
    }
    case "flow":
      return { ...s, flowOpen: a.open, flowPreset: a.preset ?? null };
    case "save":
      return {
        ...s,
        added: [a.workout, ...s.added],
        flowOpen: false,
        tab: "today",
        dir: TODAY_INDEX >= s.day ? 1 : -1,
        day: TODAY_INDEX,
        toast: { id: (s.toast?.id ?? 0) + 1, text: `${a.workout.kcal} kcal added to Move` },
      };
    case "toast":
      return { ...s, toast: a.text ? { id: (s.toast?.id ?? 0) + 1, text: a.text } : null };
    case "pref":
      return { ...s, prefs: { ...s.prefs, [a.key]: !s.prefs[a.key] } };
  }
}

const initial: State = {
  tab: "today",
  day: TODAY_INDEX,
  dir: 1,
  goals: DEFAULT_GOALS,
  water: WEEK.map((d) => d.water),
  added: [],
  flowOpen: false,
  flowPreset: null,
  toast: null,
  prefs: { reminders: true, weeklyDigest: true, autoPause: false },
};

interface Ctx {
  state: State;
  dispatch: Dispatch<Action>;
  /** week days with demo-recorded sessions merged into today */
  days: Day[];
  /** consecutive closed Move rings ending today (today counts once closed) */
  streak: number;
  todayClosed: boolean;
}

const PulseCtx = createContext<Ctx | null>(null);

export function PulseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const value = useMemo<Ctx>(() => {
    const days = WEEK.map((d, i) => {
      if (i !== TODAY_INDEX || state.added.length === 0) return d;
      const kcal = state.added.reduce((n, w) => n + w.kcal, 0);
      const mins = state.added.reduce((n, w) => n + Math.round(w.durationSec / 60), 0);
      return {
        ...d,
        move: d.move + kcal,
        exercise: d.exercise + mins,
        workouts: [...state.added, ...d.workouts],
      };
    });
    let streak = STREAK_BEFORE_WEEK;
    for (let i = 0; i < TODAY_INDEX; i++) {
      streak = days[i].move >= state.goals.move ? streak + 1 : 0;
    }
    const todayClosed = days[TODAY_INDEX].move >= state.goals.move;
    if (todayClosed) streak += 1;
    return { state, dispatch, days, streak, todayClosed };
  }, [state]);

  return <PulseCtx.Provider value={value}>{children}</PulseCtx.Provider>;
}

export function usePulse(): Ctx {
  const ctx = useContext(PulseCtx);
  if (!ctx) throw new Error("usePulse must be used inside <PulseProvider>");
  return ctx;
}
