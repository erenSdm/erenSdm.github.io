"use client";

import { useEffect, useRef } from "react";
import { at, type LaneGeo } from "./lanes";
import { VB, type StreamDef } from "./types";

const CAP = 1400;
const HAZARD = "#ff3b1f";
const DEFAULT = ["#f4f4ef"];

/**
 * Ambient traffic. One canvas, struct-of-arrays particles, no React state in
 * the loop. Only runs while `live`; muted lanes stop spawning (an outage).
 */
export function ParticleCanvas({
  lanes,
  streams,
  live,
  muted,
}: {
  lanes: LaneGeo[];
  streams: StreamDef[];
  live: boolean;
  muted: Set<string>;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || !live) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const byId = new Map(lanes.map((l) => [l.id, l]));
    const live_ = streams
      .map((s) => ({ s, g: byId.get(s.lane)!, acc: Math.random() }))
      .filter((x) => x.g);

    const lane = new Int16Array(CAP);
    const pos = new Float32Array(CAP);
    const vel = new Float32Array(CAP);
    const off = new Float32Array(CAP * 2);
    const size = new Float32Array(CAP);
    const die = new Float32Array(CAP); // distance at which it gets rejected, -1 = never
    const dying = new Float32Array(CAP); // seconds since rejection, -1 = alive
    const rev = new Uint8Array(CAP);
    const color: string[] = new Array(CAP);
    let count = 0;

    let scale = 1;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      scale = (w / VB.w) * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const spawn = (si: number) => {
      if (count >= CAP) return;
      const { s, g } = live_[si];
      const i = count++;
      lane[i] = si;
      pos[i] = 0;
      vel[i] = (s.speed ?? 240) * (0.75 + Math.random() * 0.5);
      // busier lanes run as a wider bundle, so volume reads before any number does
      const spread = Math.min(14, 3 + s.rate / 5);
      off[i * 2] = (Math.random() - 0.5) * spread;
      off[i * 2 + 1] = (Math.random() - 0.5) * spread;
      size[i] = (s.size ?? 2.4) * 1.45 * (0.7 + Math.random() * 0.6);
      die[i] = s.drop && Math.random() < s.drop ? g.len * (s.dropAt ?? 0.85) : -1;
      dying[i] = -1;
      rev[i] = s.reverse ? 1 : 0;
      const cs = s.colors ?? DEFAULT;
      color[i] = cs[(Math.random() * cs.length) | 0];
    };

    const kill = (i: number) => {
      const j = --count;
      lane[i] = lane[j];
      pos[i] = pos[j];
      vel[i] = vel[j];
      off[i * 2] = off[j * 2];
      off[i * 2 + 1] = off[j * 2 + 1];
      size[i] = size[j];
      die[i] = die[j];
      dying[i] = dying[j];
      rev[i] = rev[j];
      color[i] = color[j];
    };

    // pre-warm so the stage never starts empty
    const warm = (dt: number) => {
      for (let si = 0; si < live_.length; si++) {
        const x = live_[si];
        if (mutedRef.current.has(x.s.lane)) continue;
        x.acc += x.s.rate * dt;
        while (x.acc >= 1) {
          x.acc -= 1;
          spawn(si);
        }
      }
      for (let i = count - 1; i >= 0; i--) {
        if (dying[i] >= 0) {
          dying[i] += dt;
          if (dying[i] > 0.45) kill(i);
          continue;
        }
        pos[i] += vel[i] * dt;
        if (die[i] >= 0 && pos[i] >= die[i]) dying[i] = 0;
        else if (pos[i] >= live_[lane[i]].g.len) kill(i);
      }
    };
    for (let k = 0; k < 90; k++) warm(1 / 30);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      warm(dt);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      for (let i = 0; i < count; i++) {
        const g = live_[lane[i]].g;
        const s = rev[i] ? g.len - pos[i] : pos[i];
        const back = rev[i] ? 1 : -1;
        const [x, y] = at(g, s);
        const ox = off[i * 2];
        const oy = off[i * 2 + 1];
        const z = size[i];

        if (dying[i] >= 0) {
          const t = dying[i] / 0.45;
          const r = z * (1 + t * 2.4);
          ctx.globalAlpha = 1 - t;
          ctx.strokeStyle = HAZARD;
          ctx.lineWidth = 1;
          ctx.strokeRect(x + ox - r, y + oy - r, r * 2, r * 2);
          ctx.fillStyle = HAZARD;
          ctx.fillRect(x + ox - z / 2, y + oy - z / 2, z, z);
          continue;
        }

        ctx.fillStyle = color[i];
        // short trail, so speed reads at a glance
        const step = vel[i] * 0.018;
        for (let k = 3; k >= 1; k--) {
          const [tx, ty] = at(g, s + back * step * k);
          ctx.globalAlpha = 0.16 * (4 - k);
          ctx.fillRect(tx + ox - z * 0.35, ty + oy - z * 0.35, z * 0.7, z * 0.7);
        }
        ctx.globalAlpha = 0.95;
        ctx.fillRect(x + ox - z / 2, y + oy - z / 2, z, z);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [lanes, streams, live]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
