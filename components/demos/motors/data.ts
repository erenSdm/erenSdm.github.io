// ─────────────────────────────────────────────────────────────
// APEX Solstice — product + configurator data
// ─────────────────────────────────────────────────────────────

export const MODEL = {
  marque: "APEX",
  name: "Solstice",
  designation: "S/1020 Dual-Motor AWD",
  tagline: "Silence, engineered into speed.",
  basePrice: 128_000,
} as const;

export type Paint = {
  id: string;
  name: string;
  /** hex used for the swatch + tint overlay */
  hex: string;
  /** image file in /public/demos/motors — different per paint so the shot visibly changes */
  seed: string;
  /** tint opacity applied over the base shot */
  tint: number;
  finish: string;
  priceDelta: number;
};

export const PAINTS: Paint[] = [
  {
    id: "obsidian",
    name: "Obsidian",
    hex: "#0b0b0d",
    seed: "obsidian",
    tint: 0.5,
    finish: "Deep solid",
    priceDelta: 0,
  },
  {
    id: "nurburgring",
    name: "Nürburgring Silver",
    hex: "#b7bcc2",
    seed: "silver",
    tint: 0.34,
    finish: "Metallic",
    priceDelta: 1_800,
  },
  {
    id: "voltage",
    name: "Voltage Amber",
    hex: "#ffb800",
    seed: "amber",
    tint: 0.4,
    finish: "Signature multi-coat",
    priceDelta: 4_500,
  },
  {
    id: "storm",
    name: "Storm Blue",
    hex: "#2b4a6b",
    seed: "storm",
    tint: 0.42,
    finish: "Metallic",
    priceDelta: 2_200,
  },
  {
    id: "bianco",
    name: "Bianco",
    hex: "#eceae4",
    seed: "bianco",
    tint: 0.3,
    finish: "Pearl",
    priceDelta: 1_500,
  },
];

export type Wheel = {
  id: string;
  name: string;
  size: string;
  detail: string;
  priceDelta: number;
  rangeDelta: number; // km WLTP impact
};

export const WHEELS: Wheel[] = [
  {
    id: "aero20",
    name: "Aero 20″",
    size: '20"',
    detail: "Turbine-flow, range-optimised",
    priceDelta: 0,
    rangeDelta: 0,
  },
  {
    id: "sport21",
    name: "Sport 21″",
    size: '21"',
    detail: "Forged, staggered",
    priceDelta: 3_400,
    rangeDelta: -18,
  },
  {
    id: "track22",
    name: "Track 22″",
    size: '22"',
    detail: "Carbon-lip, track compound",
    priceDelta: 6_900,
    rangeDelta: -34,
  },
];

export type Interior = {
  id: string;
  name: string;
  detail: string;
  priceDelta: number;
};

export const INTERIORS: Interior[] = [
  {
    id: "graphite",
    name: "Graphite / Alcantara",
    detail: "Standard",
    priceDelta: 0,
  },
  {
    id: "bone",
    name: "Bone / Nappa",
    detail: "Full-grain leather",
    priceDelta: 3_200,
  },
];

// Count-up performance figures for the spec band.
export type SpecFigure = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  unit: string;
  decimals?: number;
};

export const FIGURES: SpecFigure[] = [
  { label: "Top speed", value: 322, unit: "km/h" },
  { label: "Peak torque", value: 1420, unit: "Nm" },
  { label: "Peak charge rate", value: 350, unit: "kW" },
  { label: "Drag coefficient", value: 0.197, unit: "Cd", decimals: 3 },
  { label: "Usable battery", value: 118, unit: "kWh" },
];

// Hero spec triad.
export const TRIAD = [
  { k: "0–100 km/h", v: "2.1", unit: "s" },
  { k: "WLTP range", v: "724", unit: "km" },
  { k: "System output", v: "1,020", unit: "hp" },
] as const;

// Design / feature scroll bands.
export const FEATURES = [
  {
    seed: "aero",
    index: "01",
    kicker: "Aerodynamics",
    title: "Air, moved out of the way.",
    body: "Active underbody vanes and a flush-glass profile hold the Solstice at a class-leading 0.197 Cd — every kilometre of range earned in the wind tunnel, not the brochure.",
  },
  {
    seed: "interior",
    index: "02",
    kicker: "Interior",
    title: "A cabin tuned to silence.",
    body: "Laminated acoustic glass, a driver-oriented fascia, and sustainably tanned Nappa. The loudest thing at 200 km/h is the person beside you.",
  },
  {
    seed: "glassroof",
    index: "03",
    kicker: "Glass roof",
    title: "One pane, horizon to horizon.",
    body: "A single electrochromic panoramic roof dims from clear to shade in 0.3 seconds — no shade, no seams, no compromise on headroom.",
  },
  {
    seed: "display",
    index: "04",
    kicker: "Driver display",
    title: "Instruments that recede.",
    body: "A 14-inch curved cluster surfaces only what the drive demands. Amber accents mark the redline of a car that never revs.",
  },
];

// Full spec table.
export const SPEC_TABLE: { group: string; rows: [string, string][] }[] = [
  {
    group: "Powertrain",
    rows: [
      ["Configuration", "Dual permanent-magnet, AWD"],
      ["System output", "1,020 hp (761 kW)"],
      ["Peak torque", "1,420 Nm"],
      ["0–100 km/h", "2.1 s"],
      ["0–200 km/h", "6.4 s"],
      ["Top speed", "322 km/h (limited)"],
    ],
  },
  {
    group: "Battery & Charging",
    rows: [
      ["Usable capacity", "118 kWh"],
      ["Architecture", "900 V"],
      ["Peak DC charge", "350 kW"],
      ["10–80 % DC", "≈ 18 min"],
      ["WLTP range", "724 km"],
      ["Onboard AC", "22 kW"],
    ],
  },
  {
    group: "Chassis & Dimensions",
    rows: [
      ["Suspension", "Adaptive air, active roll"],
      ["Brakes", "Carbon-ceramic, 6-piston"],
      ["Drag coefficient", "0.197 Cd"],
      ["Kerb weight", "2,190 kg"],
      ["Length", "5,004 mm"],
      ["Wheelbase", "3,010 mm"],
    ],
  },
];

// Charging curve — % state of charge → kW delivered.
export const CHARGE_CURVE: { soc: number; kw: number }[] = [
  { soc: 10, kw: 262 },
  { soc: 20, kw: 350 },
  { soc: 30, kw: 344 },
  { soc: 40, kw: 318 },
  { soc: 50, kw: 286 },
  { soc: 60, kw: 244 },
  { soc: 70, kw: 196 },
  { soc: 80, kw: 150 },
];

export function formatUSD(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function heroImage(seed: string): string {
  return `/demos/motors/${seed}.webp`;
}
