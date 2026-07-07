/**
 * PULSE — believable "today" fitness data.
 * Organic figures only. No round fakes, no placeholder names.
 */

export interface RingDatum {
  key: "move" | "exercise" | "stand";
  label: string;
  /** percent of goal, 0–100 (clamped for the arc) */
  value: number;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

/** Move / Exercise / Stand — the three concentric activity rings. */
export const RINGS: RingDatum[] = [
  {
    key: "move",
    label: "Move",
    value: 78,
    current: 820,
    goal: 1050,
    unit: "KCAL",
    color: "#F0654A",
  },
  {
    key: "exercise",
    label: "Exercise",
    value: 64,
    current: 29,
    goal: 45,
    unit: "MIN",
    color: "#9BC24E",
  },
  {
    key: "stand",
    label: "Stand",
    value: 92,
    current: 11,
    goal: 12,
    unit: "HRS",
    color: "#48ADC4",
  },
];

export interface StatDatum {
  key: string;
  label: string;
  value: string;
  unit: string;
}

export const STATS: StatDatum[] = [
  { key: "steps", label: "Steps", value: "8,214", unit: "" },
  { key: "kcal", label: "Energy", value: "820", unit: "kcal" },
  { key: "dist", label: "Distance", value: "6.1", unit: "km" },
  { key: "bpm", label: "Resting", value: "58", unit: "bpm" },
];

export type WorkoutType = "run" | "strength" | "ride";

export interface WorkoutDatum {
  id: string;
  title: string;
  detail: string;
  type: WorkoutType;
  minutes: number;
  kcal: number;
  time: string;
  accent: string;
}

export const WORKOUTS: WorkoutDatum[] = [
  {
    id: "w1",
    title: "Morning Run",
    detail: "5.2 km · Outdoor",
    type: "run",
    minutes: 32,
    kcal: 412,
    time: "6:41 AM",
    accent: "#F0654A",
  },
  {
    id: "w2",
    title: "Push Day",
    detail: "Chest · Shoulders · Triceps",
    type: "strength",
    minutes: 48,
    kcal: 386,
    time: "12:15 PM",
    accent: "#9BC24E",
  },
  {
    id: "w3",
    title: "Evening Ride",
    detail: "14.8 km · Cycling",
    type: "ride",
    minutes: 41,
    kcal: 507,
    time: "6:05 PM",
    accent: "#48ADC4",
  },
];

/**
 * Heart-rate trend across the waking day — a believable resting-to-active
 * curve. viewBox is 320 × 96; y is inverted (smaller = higher BPM).
 */
export const HR_POINTS: Array<[number, number]> = [
  [0, 66],
  [24, 58],
  [48, 62],
  [72, 44],
  [96, 52],
  [120, 34],
  [144, 41],
  [168, 27],
  [192, 48],
  [216, 31],
  [240, 55],
  [264, 39],
  [288, 46],
  [312, 30],
];

export const HR_META = {
  current: 72,
  min: 54,
  max: 148,
  restingLabel: "Resting 58 bpm",
};

/** Header context. 2026-07-07 is a Tuesday. */
export const TODAY = {
  weekday: "Tue",
  day: "07",
  month: "Jul",
  greeting: "Good morning",
  name: "Elif",
  streak: 18,
  avatar: "https://i.pravatar.cc/120?img=47",
};
