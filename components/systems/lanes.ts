import type { LaneDef, StationDef } from "./types";

export const STATION_W = 56;
export const STATION_H = 56;
const CORNER = 14;
/** spacing of the arc-length lookup, in VB units */
export const SAMPLE = 2;

type Pt = [number, number];

export interface LaneGeo {
  id: string;
  d: string;
  len: number;
  /** x,y pairs every SAMPLE units along the lane */
  pts: Float32Array;
}

export function box(s: StationDef) {
  const hw = (s.w ?? STATION_W) / 2;
  const hh = (s.h ?? STATION_H) / 2;
  return { l: s.x - hw, r: s.x + hw, t: s.y - hh, b: s.y + hh };
}

/** Where a lane heading for `p` leaves the station: straight out of the facing edge. */
function anchor(s: StationDef, [px, py]: Pt): Pt {
  const r = box(s);
  if (py > r.t + 4 && py < r.b - 4) return [px > s.x ? r.r : r.l, py];
  if (px > r.l + 4 && px < r.r - 4) return [px, py > s.y ? r.b : r.t];
  const dx = px - s.x;
  const dy = py - s.y;
  const t = Math.min((r.r - s.x) / Math.abs(dx || 1e-6), (r.b - s.y) / Math.abs(dy || 1e-6));
  return [s.x + dx * t, s.y + dy * t];
}

function points(l: LaneDef, a: StationDef, b: StationDef): Pt[] {
  if (l.via?.length) return [anchor(a, l.via[0]), ...l.via, anchor(b, l.via[l.via.length - 1])];
  const A = box(a);
  const B = box(b);
  const lo = Math.max(A.t, B.t);
  const hi = Math.min(A.b, B.b);
  if (hi - lo > 8) {
    const smaller = (a.h ?? STATION_H) <= (b.h ?? STATION_H) ? a.y : b.y;
    const y = smaller >= lo && smaller <= hi ? smaller : (lo + hi) / 2;
    return [anchor(a, [b.x, y]), anchor(b, [a.x, y])];
  }
  const left = Math.max(A.l, B.l);
  const right = Math.min(A.r, B.r);
  if (right - left > 8) {
    const smaller = (a.w ?? STATION_W) <= (b.w ?? STATION_W) ? a.x : b.x;
    const x = smaller >= left && smaller <= right ? smaller : (left + right) / 2;
    return [anchor(a, [x, b.y]), anchor(b, [x, a.y])];
  }
  return points({ ...l, via: [[b.x, a.y]] }, a, b);
}

const unit = (a: Pt, b: Pt): Pt => {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
};

/** Orthogonal polyline with softened corners, plus a dense lookup for particles. */
export function buildLane(l: LaneDef, a: StationDef, b: StationDef): LaneGeo {
  const p = points(l, a, b);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  const dense: Pt[] = [p[0]];

  for (let i = 1; i < p.length - 1; i++) {
    const [ux, uy] = unit(p[i - 1], p[i]);
    const [vx, vy] = unit(p[i], p[i + 1]);
    const r = Math.min(
      CORNER,
      Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) / 2,
      Math.hypot(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]) / 2
    );
    const s: Pt = [p[i][0] - ux * r, p[i][1] - uy * r];
    const e: Pt = [p[i][0] + vx * r, p[i][1] + vy * r];
    d += ` L${s[0].toFixed(1)} ${s[1].toFixed(1)} Q${p[i][0]} ${p[i][1]} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
    dense.push(s);
    for (let k = 1; k <= 8; k++) {
      const t = k / 8;
      const m = 1 - t;
      dense.push([m * m * s[0] + 2 * m * t * p[i][0] + t * t * e[0], m * m * s[1] + 2 * m * t * p[i][1] + t * t * e[1]]);
    }
  }
  const last = p[p.length - 1];
  d += ` L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  dense.push(last);

  // resample to even arc-length steps
  const cum = [0];
  for (let i = 1; i < dense.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  }
  const len = cum[cum.length - 1];
  const n = Math.max(2, Math.ceil(len / SAMPLE) + 1);
  const pts = new Float32Array(n * 2);
  let j = 1;
  for (let i = 0; i < n; i++) {
    const s = Math.min(len, i * SAMPLE);
    while (j < cum.length - 1 && cum[j] < s) j++;
    const seg = cum[j] - cum[j - 1] || 1;
    const t = (s - cum[j - 1]) / seg;
    pts[i * 2] = dense[j - 1][0] + (dense[j][0] - dense[j - 1][0]) * t;
    pts[i * 2 + 1] = dense[j - 1][1] + (dense[j][1] - dense[j - 1][1]) * t;
  }
  return { id: l.id, d, len, pts };
}

/** Position at distance s along a lane. */
export function at(g: LaneGeo, s: number): Pt {
  const n = g.pts.length / 2;
  const f = Math.max(0, Math.min(n - 1, s / SAMPLE));
  const i = Math.floor(f);
  const k = Math.min(n - 1, i + 1);
  const t = f - i;
  return [g.pts[i * 2] + (g.pts[k * 2] - g.pts[i * 2]) * t, g.pts[i * 2 + 1] + (g.pts[k * 2 + 1] - g.pts[i * 2 + 1]) * t];
}

/** Deterministic 0..1 from a string or number, for stable "random" layouts. */
export function hash01(s: string | number) {
  const str = String(s);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}
