import type { Locale } from "@/lib/demos";
import type { BrandKey } from "./brands";

/** Bilingual string; plain strings are language-neutral (tech terms, payloads). */
export type Txt = string | { en: string; tr: string };

export const tx = (t: Txt, locale: Locale) => (typeof t === "string" ? t : t[locale]);

/** Every stage is drawn in the same coordinate space. */
export const VB = { w: 1000, h: 520 } as const;

export type StationKind = "ext" | "core" | "ai" | "store" | "gate";
export type IconKey =
  | "plug"
  | "cpu"
  | "shield"
  | "zap"
  | "db"
  | "bell"
  | "globe"
  | "scissors"
  | "sparkles"
  | "route"
  | "chat"
  | "quote"
  | "users"
  | "inbox"
  | "layers"
  | "chart";
export type WidgetKey = "candles" | "vectors" | "inbox" | "stock";

export interface StationDef {
  id: string;
  /** centre, in VB units */
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: Txt;
  kind?: StationKind;
  /** a real third-party service, drawn with its logo */
  brand?: BrandKey;
  /** one of our own services */
  icon?: IconKey;
  /** throughput tag printed under the station */
  load?: Txt;
  widget?: WidgetKey;
}

export interface LaneDef {
  id: string;
  from: string;
  to: string;
  /** orthogonal waypoints; ends snap to the nearest station edge */
  via?: [number, number][];
}

/** Ambient traffic on a lane. Rates are visual, not literal. */
export interface StreamDef {
  lane: string;
  /** particles per second */
  rate: number;
  /** hex colours; a particle picks one at random */
  colors?: string[];
  reverse?: boolean;
  /** share of particles that get rejected before reaching the far end */
  drop?: number;
  /** where along the lane rejected particles die, 0..1 */
  dropAt?: number;
  /** VB units per second */
  speed?: number;
  size?: number;
}

export interface MetricDef {
  k: Txt;
  v: number;
  unit?: string;
  decimals?: number;
  /** random wobble around v, absolute */
  jitter?: number;
  /** steady growth per second, for running totals */
  rate?: number;
}

export type StepState = "ok" | "warn" | "err";
export type BubbleSide = "top" | "bottom" | "left" | "right";

export interface StepDef {
  /** station the tracked item is at after this step */
  at: string;
  /** lane(s) it travels to get there; "~id" runs a lane backwards */
  via?: string | string[];
  /** real processing time of this step, ms — drives the waterfall */
  ms: number;
  title: Txt;
  /** what the data looks like at this point */
  payload?: string[];
  state?: StepState;
  bubble?: { text: Txt; tone: "in" | "out"; side?: BubbleSide };
  /** tells the station widgets what to show */
  cue?: string;
  /** lanes whose ambient traffic stops while this step is on screen */
  mute?: string[];
}

export interface StoryDef {
  id: string;
  label: Txt;
  /** the thing being followed: an order id, a thread, a query */
  entity: string;
  steps: StepDef[];
}

export interface SystemCopy {
  code: string;
  kicker: Txt;
  title: Txt;
  body: Txt;
  tags: string[];
  facts: { k: Txt; v: Txt }[];
  cta?: { label: Txt; href: string };
}

/** How much data survives each stage, drawn as shrinking bars on the stage. */
export interface FunnelDef {
  x: number;
  y: number;
  w: number;
  title: Txt;
  rows: { v: number; unit: Txt }[];
}

export interface SystemDef {
  slug: string;
  copy: SystemCopy;
  metrics: MetricDef[];
  funnel?: FunnelDef;
  stations: StationDef[];
  lanes: LaneDef[];
  streams: StreamDef[];
  stories: StoryDef[];
}
