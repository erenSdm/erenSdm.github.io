// HELM — edge observability telemetry. Static, believable seed data.
// All figures are organic (no round marketing numbers).

export type Range = "24H" | "7D" | "30D";

export interface Series {
  edge: number[]; // requests served at edge (×1000 req/s)
  origin: number[]; // requests that reached origin (×1000 req/s)
  labels: string[]; // x-axis ticks (sparse)
}

export const CHART: Record<Range, Series> = {
  "24H": {
    edge: [
      142, 128, 119, 108, 99, 94, 101, 118, 139, 168, 191, 206, 214, 221, 216,
      229, 236, 224, 208, 190, 172, 159, 150, 146,
    ],
    origin: [
      28, 25, 23, 21, 19, 18, 20, 24, 29, 34, 38, 41, 42, 44, 43, 45, 47, 45,
      42, 38, 35, 32, 30, 29,
    ],
    labels: ["00", "04", "08", "12", "16", "20", "24"],
  },
  "7D": {
    edge: [186, 201, 178, 214, 229, 241, 233],
    origin: [39, 42, 37, 45, 47, 49, 48],
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  },
  "30D": {
    edge: [
      158, 164, 171, 155, 148, 162, 179, 188, 174, 169, 182, 197, 205, 193, 187,
      201, 214, 208, 196, 211, 225, 219, 207, 222, 236, 231, 224, 238, 244, 239,
    ],
    origin: [
      33, 35, 36, 32, 31, 34, 38, 40, 37, 36, 39, 42, 44, 41, 40, 43, 46, 45,
      42, 45, 48, 47, 44, 47, 50, 49, 48, 51, 52, 51,
    ],
    labels: ["W1", "W2", "W3", "W4", "NOW"],
  },
};

export interface Kpi {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: string;
  dir: "up" | "down";
  good: boolean; // whether the delta direction is favourable
  spark: number[];
  live?: boolean; // ticks in real time
}

export const KPIS: Kpi[] = [
  {
    id: "mrr",
    label: "MRR",
    value: "2.41",
    unit: "M USD",
    delta: "+4.7%",
    dir: "up",
    good: true,
    spark: [
      2.12, 2.15, 2.18, 2.16, 2.21, 2.24, 2.23, 2.28, 2.31, 2.29, 2.34, 2.37,
      2.39, 2.41,
    ],
  },
  {
    id: "sessions",
    label: "ACTIVE SESSIONS",
    value: "18,432",
    delta: "+12.3%",
    dir: "up",
    good: true,
    live: true,
    spark: [
      14.1, 14.8, 15.2, 15.0, 15.9, 16.4, 16.1, 16.8, 17.2, 17.0, 17.6, 17.9,
      18.2, 18.4,
    ],
  },
  {
    id: "conversion",
    label: "CONVERSION",
    value: "3.82",
    unit: "%",
    delta: "+0.24pt",
    dir: "up",
    good: true,
    spark: [
      3.41, 3.48, 3.52, 3.49, 3.55, 3.58, 3.61, 3.59, 3.66, 3.7, 3.68, 3.74,
      3.79, 3.82,
    ],
  },
  {
    id: "churn",
    label: "CHURN",
    value: "1.94",
    unit: "%",
    delta: "-0.31pt",
    dir: "down",
    good: true,
    spark: [
      2.61, 2.55, 2.5, 2.53, 2.44, 2.38, 2.41, 2.3, 2.22, 2.25, 2.14, 2.08, 2.0,
      1.94,
    ],
  },
  {
    id: "latency",
    label: "P95 LATENCY",
    value: "142",
    unit: "MS",
    delta: "-6ms",
    dir: "down",
    good: true,
    spark: [168, 164, 159, 162, 155, 151, 153, 148, 146, 149, 145, 144, 143, 142],
  },
];

export interface NavItem {
  id: string;
  label: string;
  code: string;
}

export const NAV: NavItem[] = [
  { id: "overview", label: "Overview", code: "01" },
  { id: "revenue", label: "Revenue", code: "02" },
  { id: "cohorts", label: "Cohorts", code: "03" },
  { id: "realtime", label: "Realtime", code: "04" },
  { id: "sources", label: "Sources", code: "05" },
  { id: "settings", label: "Settings", code: "06" },
];

export type FeedKind =
  | "DEPLOY"
  | "SIGNUP"
  | "PAYMENT"
  | "ALERT"
  | "WEBHOOK"
  | "SCALE"
  | "AUTH";

export interface FeedEvent {
  id: number;
  t: string; // HH:MM:SS
  kind: FeedKind;
  msg: string;
  alert?: boolean;
}

// Seed feed — newest first. Timestamps descend from 14:42:07.
export const FEED_SEED: FeedEvent[] = [
  { id: 1, t: "14:42:07", kind: "PAYMENT", msg: "Cormorant Data upgraded to Scale — $4,900/mo" },
  { id: 2, t: "14:41:52", kind: "DEPLOY", msg: "edge-fleet build 6f2a1c promoted → prod" },
  { id: 3, t: "14:41:38", kind: "SCALE", msg: "ap-southeast-2 autoscaled 12 → 18 nodes" },
  { id: 4, t: "14:41:19", kind: "SIGNUP", msg: "halden.systems provisioned workspace" },
  { id: 5, t: "14:40:57", kind: "ALERT", msg: "p99 breach us-east-1 — 812ms sustained", alert: true },
  { id: 6, t: "14:40:31", kind: "WEBHOOK", msg: "stripe.charge.succeeded × 34 delivered" },
  { id: 7, t: "14:40:08", kind: "AUTH", msg: "SSO handshake — Vireo Networks (Okta)" },
  { id: 8, t: "14:39:44", kind: "DEPLOY", msg: "config drift reconciled on gateway-3" },
];

// Pool of plausible streamed events used to synthesise new rows client-side.
export const FEED_POOL: { kind: FeedKind; msg: string }[] = [
  { kind: "SIGNUP", msg: "atlas-freight.io provisioned workspace" },
  { kind: "PAYMENT", msg: "Northwind Robotics renewed — $2,180/mo" },
  { kind: "WEBHOOK", msg: "github.push received — helm-labs/edge-core" },
  { kind: "SCALE", msg: "eu-west-1 autoscaled 8 → 11 nodes" },
  { kind: "DEPLOY", msg: "canary 4% → 20% on router-1a" },
  { kind: "AUTH", msg: "token rotated — svc/ingest-pipeline" },
  { kind: "PAYMENT", msg: "Vireo Networks added 6 seats — $540/mo" },
  { kind: "WEBHOOK", msg: "stripe.invoice.paid × 12 delivered" },
  { kind: "SIGNUP", msg: "port-of-halden.no started trial" },
  { kind: "DEPLOY", msg: "edge-fleet build 9d4b70 promoted → prod" },
  { kind: "SCALE", msg: "us-east-1 drained 2 unhealthy nodes" },
  { kind: "AUTH", msg: "SSO handshake — Cormorant Data (Azure AD)" },
];

export interface Source {
  host: string;
  tag: string;
  sessions: number;
  conv: number; // %
  revenue: number; // USD
  share: number; // % of total
}

export const SOURCES: Source[] = [
  { host: "console.helm.sh", tag: "DIRECT", sessions: 8214, conv: 4.62, revenue: 982400, share: 34.1 },
  { host: "github.com/helm-labs", tag: "REFERRAL", sessions: 4102, conv: 3.18, revenue: 438100, share: 17.0 },
  { host: "news.ycombinator.com", tag: "REFERRAL", sessions: 3548, conv: 2.41, revenue: 211900, share: 14.7 },
  { host: "npmjs.com/@helm", tag: "REFERRAL", sessions: 2910, conv: 2.86, revenue: 174600, share: 12.1 },
  { host: "producthunt.com", tag: "SOCIAL", sessions: 1764, conv: 3.95, revenue: 203200, share: 7.3 },
  { host: "docs.helm.sh", tag: "ORGANIC", sessions: 1522, conv: 5.1, revenue: 166800, share: 6.3 },
  { host: "x.com/helmhq", tag: "SOCIAL", sessions: 1190, conv: 1.87, revenue: 88400, share: 4.9 },
  { host: "changelog.rss", tag: "SYNDICATION", sessions: 842, conv: 2.13, revenue: 52700, share: 3.5 },
];

export function fmtUSD(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}
