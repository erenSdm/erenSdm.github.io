import type { CSSProperties } from "react";
import type { Transition } from "framer-motion";

/**
 * PULSE light palette. Every text colour clears WCAG AA (4.5:1) on both
 * `surface` (#FFFFFF) and `canvas` (#F4F5F7) unless noted "graphic only".
 */
export const C = {
  canvas: "#F4F5F7",
  surface: "#FFFFFF",
  ink: "#14171C",
  ink2: "#545C67",
  /** 4.78:1 on white — use on surface only */
  ink3: "#6B7380",
  line: "#E4E7EB",
  /** accent for text, buttons, active states (4.93:1 on white) */
  accent: "#CC3D22",
  accentSoft: "#FDECE7",
  /** ring colours — graphic only, each ≥ 3:1 on white */
  move: "#EE5535",
  exercise: "#0E9670",
  stand: "#2F64D9",
  /** text-safe variants of the ring hues */
  moveText: "#C23A1F",
  exerciseText: "#0A7A5B",
  standText: "#2F64D9",
  water: "#1C8FC4",
  waterText: "#13729E",
  sleepDeep: "#1E2F57",
  sleepCore: "#4A68B0",
  sleepRem: "#8FA6DA",
  sleepAwake: "#E8B4A6",
} as const;

export type RingKey = "move" | "exercise" | "stand";

export const RING_META: Record<RingKey, { label: string; unit: string; color: string; text: string }> = {
  move: { label: "Move", unit: "kcal", color: C.move, text: C.moveText },
  exercise: { label: "Exercise", unit: "min", color: C.exercise, text: C.exerciseText },
  stand: { label: "Stand", unit: "hr", color: C.stand, text: C.standText },
};

export const SPRING: Transition = { type: "spring", stiffness: 260, damping: 30 };
export const SOFT: Transition = { type: "spring", stiffness: 120, damping: 22 };
export const SHEET: Transition = { type: "spring", stiffness: 320, damping: 34 };

/** Inline style for the condensed numeral face. */
export const NUM_STYLE: CSSProperties = {
  fontFamily: "var(--pulse-num), var(--pulse-ui), system-ui, sans-serif",
  fontVariationSettings: "'wdth' 75, 'opsz' 96",
  fontVariantNumeric: "tabular-nums lining-nums",
  letterSpacing: "-0.02em",
};

/** heart-rate zone colours, Z1 to Z5 (graphic only) */
export const ZONE_COLORS = ["#9AA3AE", "#2F64D9", "#0E9670", "#E39B1B", "#CC3D22"] as const;
