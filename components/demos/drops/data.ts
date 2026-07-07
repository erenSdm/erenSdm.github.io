export type Stock = "new" | "low" | "sold";

export type Product = {
  id: string;
  sku: string;
  name: string;
  colorway: string;
  category: "Footwear" | "Apparel";
  price: number;
  stock: Stock;
  units?: number; // remaining, for LOW STOCK counters
  seed: string;
  altSeed: string;
  sizes: string[];
};

export const CURRENCY = "€";

export const HERO = {
  name: ["VOLTAGE", "RUNNER"],
  colorway: "Magenta Static / OG",
  sku: "CDN-VLT-220",
  price: 220,
  units: 400,
  drop: "SS26 · VOLTAGE",
  sizes: ["40", "40.5", "41", "42", "42.5", "43", "44", "45", "46"],
  soldSizes: ["40", "46"],
  seed: "cad-voltage-hero",
};

export const TICKER = [
  "SS26 // VOLTAGE DROP",
  "FRI 18:00 CET",
  "400 PAIRS WORLDWIDE",
  "1 PER CUSTOMER",
  "NO RESTOCK",
];

export const HYPE = [
  "COP IT",
  "DROP 026",
  "LIMITED RUN",
  "MADE TO MOVE",
  "SS26",
  "NO RESTOCK",
  "HYPE ENGINE",
  "VOLTAGE",
];

const SNEAKER_SIZES = ["40", "41", "42", "43", "44", "45", "46"];
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const PRODUCTS: Product[] = [
  {
    id: "cadence-og-low",
    sku: "CDN-OGL-180",
    name: "Cadence OG Low",
    colorway: "Onyx / Magenta Hit",
    category: "Footwear",
    price: 180,
    stock: "low",
    units: 12,
    seed: "cad-og-low",
    altSeed: "cad-og-low-alt",
    sizes: SNEAKER_SIZES,
  },
  {
    id: "static-hoodie",
    sku: "CDN-STH-140",
    name: "Static Hoodie",
    colorway: "Bone / Screened",
    category: "Apparel",
    price: 140,
    stock: "new",
    seed: "cad-hoodie",
    altSeed: "cad-hoodie-alt",
    sizes: APPAREL_SIZES,
  },
  {
    id: "grid-cargo",
    sku: "CDN-GCG-160",
    name: "Grid Cargo Pant",
    colorway: "Coal / Ripstop",
    category: "Apparel",
    price: 160,
    stock: "new",
    seed: "cad-cargo",
    altSeed: "cad-cargo-alt",
    sizes: APPAREL_SIZES,
  },
  {
    id: "pulse-trainer",
    sku: "CDN-PLS-210",
    name: "Pulse Trainer",
    colorway: "Volt White",
    category: "Footwear",
    price: 210,
    stock: "sold",
    seed: "cad-pulse",
    altSeed: "cad-pulse-alt",
    sizes: SNEAKER_SIZES,
  },
  {
    id: "signal-puffer",
    sku: "CDN-SGP-320",
    name: "Signal Puffer",
    colorway: "Black Ops",
    category: "Apparel",
    price: 320,
    stock: "new",
    seed: "cad-puffer",
    altSeed: "cad-puffer-alt",
    sizes: APPAREL_SIZES,
  },
  {
    id: "overdrive-jacket",
    sku: "CDN-OVD-190",
    name: "Overdrive Track Jacket",
    colorway: "Magenta / Jet",
    category: "Apparel",
    price: 190,
    stock: "low",
    units: 7,
    seed: "cad-track",
    altSeed: "cad-track-alt",
    sizes: APPAREL_SIZES,
  },
  {
    id: "relay-tee",
    sku: "CDN-RLY-065",
    name: "Relay Tee",
    colorway: "Paper / Boxed Logo",
    category: "Apparel",
    price: 65,
    stock: "new",
    seed: "cad-tee",
    altSeed: "cad-tee-alt",
    sizes: APPAREL_SIZES,
  },
  {
    id: "amp-runner-mid",
    sku: "CDN-AMP-240",
    name: "Amp Runner Mid",
    colorway: "Static Grey",
    category: "Footwear",
    price: 240,
    stock: "low",
    units: 21,
    seed: "cad-amp",
    altSeed: "cad-amp-alt",
    sizes: SNEAKER_SIZES,
  },
];

export const SIZE_RUN: { size: string; state: "in" | "low" | "out" }[] = [
  { size: "40", state: "out" },
  { size: "40.5", state: "low" },
  { size: "41", state: "in" },
  { size: "42", state: "in" },
  { size: "42.5", state: "in" },
  { size: "43", state: "low" },
  { size: "44", state: "in" },
  { size: "45", state: "low" },
  { size: "46", state: "out" },
];

export function imgUrl(seed: string, w = 900, h = 1100) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}
