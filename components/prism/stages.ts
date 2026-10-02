/**
 * Prism stage poses. Every numeric field is interpolated between stages,
 * then damped per frame inside the scene.
 *
 * x / y are fractions of the half-viewport (−1 = left/bottom edge, 1 = right/top edge),
 * so poses hold up at any aspect ratio.
 */
export const STAGES = [
  "hero",
  "manifesto",
  "services",
  "work",
  "mobile",
  "process",
  "contact",
] as const;

export type Stage = (typeof STAGES)[number];

export type Pose = {
  x: number;
  y: number;
  z: number;
  /** uniform scale */
  s: number;
  rx: number;
  ry: number;
  rz: number;
  /** idle spin speed (rad/s around Y) */
  spin: number;
  /** 0 = whole monolith, 1 = shards drifting apart */
  split: number;
  /** 0 = refractive glass, 1 = wireframe edges */
  wire: number;
  /** 0 = clear glass, 1 = lime-tinted */
  tint: number;
  /** inner core glow */
  glow: number;
  /** light beam passing behind the prism */
  beam: number;
  /** depth multiplier (phone slab = thin) */
  thin: number;
  /** width multiplier */
  wide: number;
};

export const POSE_KEYS: (keyof Pose)[] = [
  "x", "y", "z", "s", "rx", "ry", "rz", "spin", "split",
  "wire", "tint", "glow", "beam", "thin", "wide",
];

const base: Pose = {
  x: 0, y: 0, z: 0, s: 1, rx: 0, ry: 0, rz: 0, spin: 0, split: 0,
  wire: 0, tint: 0, glow: 0.3, beam: 0, thin: 1, wide: 1,
};

const p = (o: Partial<Pose>): Pose => ({ ...base, ...o });

export const DESKTOP_POSES: Record<Stage, Pose> = {
  hero: p({ x: 0.42, y: -0.02, s: 1.2, rx: 0.1, ry: -0.55, rz: 0.1, spin: 0.22, glow: 0.4, beam: 1 }),
  manifesto: p({ x: 0.36, y: -0.08, s: 0.88, rx: 0.35, ry: 0.5, rz: -0.2, spin: 0.1, split: 1, glow: 0.15, beam: 0.25, tint: 0.1 }),
  services: p({ x: 0.55, y: 0, s: 0.95, rx: 0.08, ry: -0.2, rz: 0.04, spin: 0, glow: 0.35, beam: 0.45 }),
  work: p({ x: 0.84, y: 0.42, s: 0.55, rx: 0.4, ry: 0.6, rz: 0.55, spin: 0.35, tint: 1, glow: 0.6, beam: 0 }),
  mobile: p({ x: 0.58, y: 0, s: 1.0, rx: 0, ry: -0.3, rz: 0, spin: 0, tint: 0.35, glow: 0.95, thin: 0.28, wide: 0.92, beam: 0.15 }),
  process: p({ x: 0.5, y: 0, s: 1.05, rx: 0.55, ry: 0.8, rz: 0.3, spin: 0.18, split: 0.4, wire: 1, tint: 0.7, glow: 0, beam: 0 }),
  contact: p({ x: 0, y: 0.04, s: 1.1, rx: 0.12, ry: 0.35, rz: 0, spin: 0.2, tint: 0.3, glow: 1, beam: 1 }),
};

/** Phones: smaller, centred-ish, sitting behind the headline. */
export const MOBILE_POSES: Record<Stage, Pose> = {
  hero: p({ ...DESKTOP_POSES.hero, x: 0.18, y: 0.12, s: 0.72 }),
  manifesto: p({ ...DESKTOP_POSES.manifesto, x: 0.1, y: 0.05, s: 0.62 }),
  services: p({ ...DESKTOP_POSES.services, x: 0.3, y: 0.1, s: 0.55 }),
  work: p({ ...DESKTOP_POSES.work, x: 0.62, y: 0.55, s: 0.4 }),
  mobile: p({ ...DESKTOP_POSES.mobile, x: 0.2, y: 0.08, s: 0.62 }),
  process: p({ ...DESKTOP_POSES.process, x: 0.2, y: 0.05, s: 0.6 }),
  contact: p({ ...DESKTOP_POSES.contact, x: 0, y: 0.15, s: 0.7 }),
};

/** Shared, mutable scroll state written by the DOM side, read in useFrame. */
export type ScrollState = {
  /** pose index A */
  a: number;
  /** pose index B */
  b: number;
  /** blend weight A→B, 0..1 */
  w: number;
  /** fractional service-step index (facet rotation) */
  step: number;
  /** 0 = dark backdrop, 1 = light backdrop */
  light: number;
  /** sampled page background (linear-ish 0..1 sRGB) */
  bg: [number, number, number];
  /** pointer, −1..1 */
  mx: number;
  my: number;
};

export const createScrollState = (): ScrollState => ({
  a: 0, b: 0, w: 0, step: 0, light: 0, bg: [0.04, 0.04, 0.04], mx: 0, my: 0,
});
