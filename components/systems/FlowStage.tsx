"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { ParticleCanvas } from "./ParticleCanvas";
import { Station, type StationState } from "./Station";
import { Widget } from "./widgets";
import { STATION_H, STATION_W, at, buildLane, type LaneGeo } from "./lanes";
import { TRAVEL } from "./useStory";
import { VB, tx, type BubbleSide, type FunnelDef, type StationDef, type StoryDef, type SystemDef } from "./types";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const hops = (via?: string | string[]) => (via ? (Array.isArray(via) ? via : [via]) : []);
const parse = (raw: string) => (raw.startsWith("~") ? { id: raw.slice(1), rev: true } : { id: raw, rev: false });

export function FlowStage({
  sys,
  story,
  step,
  run,
  live,
}: {
  sys: SystemDef;
  story: StoryDef;
  step: number;
  run: number;
  live: boolean;
}) {
  const { locale } = useLanguage();
  const reduce = !!useReducedMotion();
  const byId = useMemo(() => new Map(sys.stations.map((s) => [s.id, s])), [sys.stations]);
  const geo = useMemo(
    () => sys.lanes.map((l) => buildLane(l, byId.get(l.from)!, byId.get(l.to)!)),
    [sys.lanes, byId]
  );
  const geoById = useMemo(() => new Map(geo.map((g) => [g.id, g])), [geo]);

  const cur = step >= 0 ? story.steps[step] : undefined;
  const key = `${run}-${step}`;
  const travels = hops(cur?.via).length > 0 && !reduce;
  const [arrivedKey, setArrivedKey] = useState("");
  const arrived = !travels || arrivedKey === key;

  /* derived state of every station and lane for this frame */
  const { stations, doneLanes, cues } = useMemo(() => {
    const st = new Map<string, StationState>();
    const lanes = new Set<string>();
    const cs: string[] = [];
    for (let i = 0; i <= step; i++) {
      const s = story.steps[i];
      const now = i === step;
      if (now && !arrived) continue;
      const hot: StationState = s.state === "err" ? "err" : s.state === "warn" ? "warn" : "active";
      st.set(s.at, now ? hot : hot === "active" ? "done" : hot);
      if (!now) hops(s.via).forEach((v) => lanes.add(parse(v).id));
      if (s.cue) cs.push(s.cue);
    }
    return { stations: st, doneLanes: lanes, cues: cs };
  }, [story, step, arrived]);

  const muted = useMemo(() => new Set(cur?.mute ?? []), [cur]);

  return (
    <div
      className="@container relative w-full select-none text-[clamp(8.5px,1.12cqw,12px)]"
      style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
    >
      <svg aria-hidden viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="fl-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.7" fill="#f4f4ef" opacity="0.1" />
          </pattern>
        </defs>
        <rect width={VB.w} height={VB.h} fill="url(#fl-grid)" />
        {geo.map((g) => (
          <g key={g.id}>
            <path d={g.d} fill="none" stroke="#f4f4ef" strokeOpacity={0.13} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            {doneLanes.has(g.id) && (
              <path d={g.d} fill="none" stroke="#ccff00" strokeOpacity={0.35} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
            )}
          </g>
        ))}
        {cur &&
          hops(cur.via).map((raw, i) => {
            const { id, rev } = parse(raw);
            const g = geoById.get(id);
            if (!g) return null;
            const bad = cur.state === "err";
            return (
              <motion.path
                key={`${key}-${i}`}
                d={g.d}
                fill="none"
                stroke={bad ? "#ff3b1f" : "#ccff00"}
                strokeWidth={1.8}
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0, pathOffset: rev ? 1 : 0 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: TRAVEL / 1000, delay: (i * TRAVEL) / 1000, ease }}
              />
            );
          })}
      </svg>

      {sys.funnel && <Funnel f={sys.funnel} />}

      <ParticleCanvas lanes={geo} streams={sys.streams} live={live && !reduce} muted={muted} />

      {sys.stations.map((s) => (
        <Station key={s.id} s={s} state={stations.get(s.id) ?? "idle"}>
          {s.widget ? <Widget k={s.widget} live={live} cues={cues} cue={arrived ? cur?.cue : undefined} run={run} /> : null}
        </Station>
      ))}

      {cur && (
        <Token
          key={key}
          entity={story.entity}
          via={cur.via}
          geo={geoById}
          rest={byId.get(cur.at)!}
          state={cur.state}
          reduce={reduce}
          onArrive={() => setArrivedKey(key)}
        />
      )}

      <AnimatePresence>
        {cur?.bubble && arrived && (
          <Bubble key={key} s={byId.get(cur.at)!} tone={cur.bubble.tone} side={cur.bubble.side} text={tx(cur.bubble.text, locale)} reduce={reduce} />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Log-scaled bars: thousands in, a handful out. */
function Funnel({ f }: { f: FunnelDef }) {
  const { locale } = useLanguage();
  const max = Math.log10(Math.max(...f.rows.map((r) => r.v)) + 1);
  const loc = locale === "tr" ? "tr-TR" : "en-US";
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: `${(f.x / VB.w) * 100}%`, top: `${(f.y / VB.h) * 100}%`, width: `${(f.w / VB.w) * 100}%` }}
    >
      <div className="ui mb-[0.6em] text-[0.82em] text-paper/40">{tx(f.title, locale)}</div>
      <ol className="flex flex-col gap-[0.45em]">
        {f.rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[5.2em_1fr] items-center gap-[0.6em]">
            <span className="font-wide text-right text-[1.05em] leading-none tabular">{r.v.toLocaleString(loc)}</span>
            <span className="flex items-center gap-[0.5em]">
              <span
                className={cn("h-[0.55em]", i === f.rows.length - 1 ? "bg-volt" : "bg-paper/70")}
                style={{ width: `${Math.max(2, (Math.log10(r.v + 1) / max) * 62)}%` }}
              />
              <span className="font-plex whitespace-nowrap text-[0.84em] text-paper/50">{tx(r.unit, locale)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The one item we follow, riding the lanes with its id on a tag. */
function Token({
  entity,
  via,
  geo,
  rest,
  state,
  reduce,
  onArrive,
}: {
  entity: string;
  via?: string | string[];
  geo: Map<string, LaneGeo>;
  rest: StationDef;
  state?: string;
  reduce: boolean;
  onArrive: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const arrive = useRef(onArrive);
  useEffect(() => {
    arrive.current = onArrive;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = (x: number, y: number) => {
      el.style.left = `${(x / VB.w) * 100}%`;
      el.style.top = `${(y / VB.h) * 100}%`;
    };
    const legs = hops(via)
      .map(parse)
      .map((p) => ({ g: geo.get(p.id), rev: p.rev }))
      .filter((l) => l.g) as { g: LaneGeo; rev: boolean }[];
    const park = () => place(rest.x, rest.y - (rest.h ?? STATION_H) / 2);

    if (!legs.length || reduce) {
      park();
      return;
    }
    const pos = (v: number) => {
      const f = Math.min(legs.length - 0.0001, v * legs.length);
      const leg = legs[Math.floor(f)];
      const t = f - Math.floor(f);
      const [x, y] = at(leg.g, (leg.rev ? 1 - t : t) * leg.g.len);
      place(x, y);
    };
    pos(0);
    const ctl = animate(0, 1, {
      duration: (legs.length * TRAVEL) / 1000,
      ease: legs.length > 1 ? "linear" : ease,
      onUpdate: pos,
      onComplete: () => {
        park();
        arrive.current();
      },
    });
    return () => ctl.stop();
  }, [via, geo, rest, reduce]);

  const bad = state === "err" || state === "warn";
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute z-[2]"
    >
      <span
        className={cn("absolute block h-[0.95em] w-[0.95em] -translate-x-1/2 -translate-y-1/2 border-2 border-carbon", bad ? "bg-hazard" : "bg-volt")}
        style={{ boxShadow: `0 0 0 1px ${bad ? "#ff3b1f" : "#ccff00"}` }}
      />
      <span
        lang="en"
        className={cn(
          "font-plex absolute bottom-[0.9em] left-1/2 -translate-x-1/2 whitespace-nowrap px-[0.45em] py-[0.15em] text-[0.86em] tabular text-carbon",
          bad ? "bg-hazard" : "bg-volt"
        )}
      >
        {entity}
      </span>
    </div>
  );
}

/** What the customer actually sees (out) or sends (in), pinned to the station. */
function Bubble({
  s,
  tone,
  text,
  side,
  reduce,
}: {
  s: StationDef;
  tone: "in" | "out";
  text: string;
  side?: BubbleSide;
  reduce: boolean;
}) {
  const w = s.w ?? STATION_W;
  const h = s.h ?? STATION_H;
  // right column talks to the left; everything else above or below, away from the edge
  const at: BubbleSide = side ?? (s.x > VB.w * 0.7 ? "left" : s.y < VB.h / 2 ? "bottom" : "top");
  const pc = (v: number, of: number) => `${(v / of) * 100}%`;
  const edgeX = s.x < VB.w * 0.3 ? "start" : s.x > VB.w * 0.7 ? "end" : "mid";

  const pos: CSSProperties =
    at === "left"
      ? { right: `calc(${pc(VB.w - s.x + w / 2, VB.w)} + 0.9em)`, top: pc(s.y - h / 2, VB.h) }
      : at === "right"
        ? { left: `calc(${pc(s.x + w / 2, VB.w)} + 0.9em)`, top: pc(s.y - h / 2, VB.h) }
        : {
            ...(edgeX === "start"
              ? { left: pc(s.x - w / 2, VB.w) }
              : edgeX === "end"
                ? { right: pc(VB.w - s.x - w / 2, VB.w) }
                : { left: pc(s.x, VB.w) }),
            ...(at === "bottom"
              ? { top: `calc(${pc(s.y + h / 2, VB.h)} + 4.8em)` }
              : { bottom: `calc(${pc(VB.h - s.y + h / 2, VB.h)} + 0.9em)` }),
          };
  const x = (at === "top" || at === "bottom") && edgeX === "mid" ? "-50%" : 0;
  const from = at === "left" ? { x: 8 } : at === "right" ? { x: -8 } : { y: at === "bottom" ? -8 : 8 };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x, ...from, scale: 0.96 }}
      animate={{ opacity: 1, x, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "font-plex absolute z-[3] w-max max-w-[17em] px-[0.8em] py-[0.55em] text-[1em] leading-snug shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)]",
        tone === "out" ? "bg-volt text-carbon" : "bg-paper text-carbon"
      )}
      style={pos}
    >
      <span className="mb-[0.2em] block text-[0.78em] uppercase tracking-[0.12em] opacity-60">
        {tone === "in" ? "← in" : "→ out"}
      </span>
      {text}
    </motion.div>
  );
}
