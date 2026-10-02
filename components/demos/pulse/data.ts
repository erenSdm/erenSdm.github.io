/**
 * PULSE: deterministic demo data (seeded, so server and client render identically).
 * The demo's "now" is Friday 2 October 2026, 14:52, Istanbul.
 */

export type WorkoutType = "run" | "ride" | "strength" | "yoga" | "swim" | "hiit" | "walk";

export interface WorkoutKind {
  label: string;
  /** default title used when a session is saved */
  title: string;
  place: string;
  kcalPerMin: number;
  targetHr: number;
  /** km/h for distance-based types */
  speedKmh?: number;
}

export const WORKOUT_KINDS: Record<WorkoutType, WorkoutKind> = {
  run: { label: "Outdoor run", title: "Moda seafront run", place: "Moda, Kadıköy", kcalPerMin: 11.6, targetHr: 152, speedKmh: 10.4 },
  ride: { label: "Indoor cycle", title: "Indoor cycle · Tempo", place: "Moda Ride Studio", kcalPerMin: 9.7, targetHr: 141 },
  strength: { label: "Strength", title: "Strength · Full body", place: "Kuzguncuk Athletic Club", kcalPerMin: 6.2, targetHr: 122 },
  hiit: { label: "HIIT", title: "HIIT · 40/20 intervals", place: "Kuzguncuk Athletic Club", kcalPerMin: 12.8, targetHr: 162 },
  swim: { label: "Pool swim", title: "Pool swim · 25 m lanes", place: "Enka Spor, Sarıyer", kcalPerMin: 9.1, targetHr: 138, speedKmh: 2.6 },
  yoga: { label: "Yoga", title: "Vinyasa flow", place: "Cihangir Shala", kcalPerMin: 4.1, targetHr: 96 },
  walk: { label: "Walk", title: "Afternoon walk", place: "Maçka Parkı", kcalPerMin: 4.4, targetHr: 102, speedKmh: 5.3 },
};

export const WORKOUT_ORDER: WorkoutType[] = ["run", "ride", "strength", "hiit", "swim", "yoga", "walk"];

export interface Workout {
  id: string;
  type: WorkoutType;
  title: string;
  place: string;
  /** minutes after midnight */
  start: number;
  durationSec: number;
  kcal: number;
  avgHr: number;
  maxHr: number;
  distanceKm?: number;
}

export interface Sleep {
  bed: string;
  wake: string;
  /** minutes */
  deep: number;
  core: number;
  rem: number;
  awake: number;
  score: number;
}

export interface Day {
  key: string;
  weekday: string;
  short: string;
  date: number;
  month: string;
  isToday: boolean;
  isFuture: boolean;
  steps: number;
  distanceKm: number;
  floors: number;
  /** totals for the day, including the listed workouts */
  move: number;
  exercise: number;
  stand: number;
  restingHr: number;
  /** one sample every 10 minutes from 00:00 */
  hr: number[];
  sleep: Sleep | null;
  water: number;
  workouts: Workout[];
}

export const NOW_MIN = 14 * 60 + 52;
export const TODAY_INDEX = 4;
export const HR_STEP_MIN = 10;
export const MAX_HR = 188;
export const GLASS_ML = 250;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hm = (h: number, m: number) => h * 60 + m;

function w(
  id: string,
  type: WorkoutType,
  title: string,
  place: string,
  start: number,
  min: number,
  sec: number,
  kcal: number,
  avgHr: number,
  maxHr: number,
  distanceKm?: number,
): Workout {
  return { id, type, title, place, start, durationSec: min * 60 + sec, kcal, avgHr, maxHr, distanceKm };
}

interface Seed {
  weekday: string;
  short: string;
  date: number;
  steps: number;
  floors: number;
  move: number;
  exercise: number;
  stand: number;
  restingHr: number;
  wakeMin: number;
  sleep: Sleep | null;
  water: number;
  workouts: Workout[];
}

const SEEDS: Seed[] = [
  {
    weekday: "Monday", short: "M", date: 28, steps: 11284, floors: 14, move: 704, exercise: 48, stand: 13, restingHr: 54,
    wakeMin: hm(6, 31),
    sleep: { bed: "23:12", wake: "06:31", deep: 74, core: 236, rem: 98, awake: 11, score: 84 },
    water: 9,
    workouts: [w("w-mon-1", "run", "Caddebostan coastal run", "Caddebostan sahili", hm(7, 4), 41, 37, 412, 148, 171, 6.82)],
  },
  {
    weekday: "Tuesday", short: "T", date: 29, steps: 9861, floors: 9, move: 655, exercise: 57, stand: 12, restingHr: 56,
    wakeMin: hm(6, 58),
    sleep: { bed: "00:06", wake: "06:58", deep: 52, core: 228, rem: 81, awake: 21, score: 71 },
    water: 7,
    workouts: [w("w-tue-1", "strength", "Strength · Upper body", "Kuzguncuk Athletic Club", hm(18, 32), 51, 12, 318, 121, 158)],
  },
  {
    weekday: "Wednesday", short: "W", date: 30, steps: 14906, floors: 31, move: 812, exercise: 71, stand: 12, restingHr: 53,
    wakeMin: hm(5, 47),
    sleep: { bed: "22:41", wake: "05:47", deep: 81, core: 221, rem: 104, awake: 8, score: 88 },
    water: 10,
    workouts: [w("w-wed-1", "run", "Belgrad Forest trail run", "Belgrad Ormanı", hm(6, 22), 64, 8, 587, 152, 176, 9.31)],
  },
  {
    weekday: "Thursday", short: "T", date: 1, steps: 10437, floors: 12, move: 671, exercise: 69, stand: 14, restingHr: 55,
    wakeMin: hm(6, 44),
    sleep: { bed: "23:37", wake: "06:44", deep: 63, core: 244, rem: 92, awake: 15, score: 79 },
    water: 8,
    workouts: [
      w("w-thu-2", "ride", "Indoor cycle · Tempo", "Moda Ride Studio", hm(19, 5), 45, 0, 436, 139, 167),
      w("w-thu-1", "walk", "Lunch walk", "Maçka Parkı", hm(12, 41), 24, 18, 96, 98, 112, 2.14),
    ],
  },
  {
    weekday: "Friday", short: "F", date: 2, steps: 6318, floors: 7, move: 486, exercise: 35, stand: 9, restingHr: 57,
    wakeMin: hm(6, 52),
    sleep: { bed: "23:48", wake: "06:52", deep: 58, core: 239, rem: 87, awake: 18, score: 76 },
    water: 4,
    workouts: [w("w-fri-1", "yoga", "Vinyasa flow", "Cihangir Shala", hm(7, 21), 35, 40, 142, 96, 118)],
  },
  {
    weekday: "Saturday", short: "S", date: 3, steps: 0, floors: 0, move: 0, exercise: 0, stand: 0, restingHr: 0,
    wakeMin: 0, sleep: null, water: 0, workouts: [],
  },
  {
    weekday: "Sunday", short: "S", date: 4, steps: 0, floors: 0, move: 0, exercise: 0, stand: 0, restingHr: 0,
    wakeMin: 0, sleep: null, water: 0, workouts: [],
  },
];

function buildHr(seed: Seed, index: number, endMin: number): number[] {
  const rand = mulberry32(9071 + index * 131);
  const out: number[] = [];
  const p1 = rand() * 6;
  const p2 = rand() * 6;
  let drift = 0;
  for (let m = 0; m <= endMin; m += HR_STEP_MIN) {
    drift = drift * 0.7 + (rand() - 0.5) * 6;
    const wave = Math.sin(m / 47 + p1) * 3 + Math.sin(m / 13 + p2) * 2;
    let v: number;
    if (m < seed.wakeMin) {
      v = seed.restingHr - 3 + wave * 0.5 + drift * 0.3;
    } else if (m > hm(22, 50)) {
      v = seed.restingHr + 6 + wave + drift * 0.5;
    } else {
      v = seed.restingHr + 19 + wave * 1.6 + drift;
      // a little morning bump after waking, and lunch
      if (m - seed.wakeMin < 40) v += 6;
      if (m > hm(12, 20) && m < hm(13, 30)) v += 7;
    }
    for (const wk of seed.workouts) {
      const end = wk.start + wk.durationSec / 60;
      if (m >= wk.start && m <= end + 10) {
        const t = (m - wk.start) / Math.max(1, end - wk.start);
        const ramp = m > end ? 0.45 : Math.min(1, t * 3.2);
        const peak = t > 0.55 && t < 0.85 ? (wk.maxHr - wk.avgHr) * 0.8 : 0;
        v = Math.max(v, v + (wk.avgHr - v) * ramp + peak * ramp);
      }
    }
    out.push(Math.round(v));
  }
  return out;
}

export const WEEK: Day[] = SEEDS.map((s, i) => {
  const isToday = i === TODAY_INDEX;
  const isFuture = i > TODAY_INDEX;
  return {
    key: `2026-${i < 3 ? "09" : "10"}-${String(s.date).padStart(2, "0")}`,
    weekday: s.weekday,
    short: s.short,
    date: s.date,
    month: i < 3 ? "Sep" : "Oct",
    isToday,
    isFuture,
    steps: s.steps,
    distanceKm: Math.round(s.steps * 0.000742 * 100) / 100,
    floors: s.floors,
    move: s.move,
    exercise: s.exercise,
    stand: s.stand,
    restingHr: s.restingHr,
    hr: isFuture ? [] : buildHr(s, i, isToday ? NOW_MIN : 24 * 60 - HR_STEP_MIN),
    sleep: s.sleep,
    water: s.water,
    workouts: s.workouts,
  };
});

/** Earlier sessions shown under "Last week" in the Workouts tab. */
export const EARLIER: { label: string; workouts: Workout[] }[] = [
  {
    label: "Sunday, 27 Sep",
    workouts: [w("w-sun-1", "run", "Bebek to Arnavutköy long run", "Bebek sahili", hm(8, 2), 58, 21, 641, 146, 169, 10.42)],
  },
  {
    label: "Saturday, 26 Sep",
    workouts: [
      w("w-sat-2", "swim", "Pool swim · 25 m lanes", "Enka Spor, Sarıyer", hm(17, 10), 38, 5, 352, 134, 155, 1.65),
      w("w-sat-1", "hiit", "HIIT · 40/20 intervals", "Kuzguncuk Athletic Club", hm(9, 30), 27, 44, 341, 159, 182),
    ],
  },
];

/** 30 days ending today, for the monthly view. Last five entries are this week. */
export interface DayTotals {
  label: string;
  steps: number;
  move: number;
  exercise: number;
}

export const MONTH: DayTotals[] = (() => {
  const rand = mulberry32(4421);
  const out: DayTotals[] = [];
  for (let i = 0; i < 25; i++) {
    const date = 3 + i; // 3 Sep .. 27 Sep
    const weekend = (date + 3) % 7 >= 5;
    const lazy = rand() < 0.16;
    const steps = Math.round(6200 + rand() * 7600 + (weekend ? 1800 : 0) - (lazy ? 3400 : 0));
    out.push({
      label: `${date} Sep`,
      steps,
      move: Math.round(steps * 0.052 + 120 + rand() * 90),
      exercise: Math.round((lazy ? 12 : 31) + rand() * 38),
    });
  }
  for (let i = 0; i <= TODAY_INDEX; i++) {
    const d = WEEK[i];
    out.push({ label: `${d.date} ${d.month}`, steps: d.steps, move: d.move, exercise: d.exercise });
  }
  return out;
})();

export interface PersonalRecord {
  label: string;
  value: string;
  unit: string;
  context: string;
}

export const RECORDS: PersonalRecord[] = [
  { label: "Fastest 5K", value: "23:41", unit: "", context: "Caddebostan sahili · 14 Sep" },
  { label: "Longest run", value: "21.31", unit: "km", context: "İstanbul Half Marathon · 26 Apr" },
  { label: "Most steps in a day", value: "24,318", unit: "steps", context: "Kapadokya hike · 9 Aug" },
  { label: "Longest move streak", value: "47", unit: "days", context: "June to July" },
];

/** closed-move streak before Monday 28 Sep */
export const STREAK_BEFORE_WEEK = 19;

export interface Goals {
  move: number;
  exercise: number;
  stand: number;
  steps: number;
  water: number;
}

export const DEFAULT_GOALS: Goals = { move: 620, exercise: 30, stand: 12, steps: 10000, water: 8 };

export const GOAL_LIMITS: Record<keyof Goals, { min: number; max: number; step: number; unit: string; label: string }> = {
  move: { min: 200, max: 1500, step: 10, unit: "kcal", label: "Move" },
  exercise: { min: 10, max: 120, step: 5, unit: "min", label: "Exercise" },
  stand: { min: 6, max: 16, step: 1, unit: "hr", label: "Stand" },
  steps: { min: 3000, max: 25000, step: 500, unit: "steps", label: "Daily steps" },
  water: { min: 4, max: 14, step: 1, unit: "glasses", label: "Water" },
};

export const HR_ZONES = [
  { name: "Warm up", min: 0, max: 112 },
  { name: "Fat burn", min: 113, max: 131 },
  { name: "Aerobic", min: 132, max: 150 },
  { name: "Threshold", min: 151, max: 169 },
  { name: "Max", min: 170, max: 999 },
] as const;

export function zoneIndex(hr: number): number {
  return HR_ZONES.findIndex((z) => hr >= z.min && hr <= z.max);
}

export const fmt = (n: number) => n.toLocaleString("en-US");

export function clock(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = Math.floor(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function duration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
