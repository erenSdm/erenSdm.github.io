"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { WheelOutro } from "@/lib/useWheelScroll";
import { cn } from "@/lib/utils";

/*
 * Mobile → Systems handoff. Once the last phone reaches the wheel's apex the
 * pin keeps going: the phone drifts to centre, turns over to show a logic
 * board printed "BACK END", its SoC lights up, and the camera pushes into the
 * chip. Traces fan out to the named services, the chip passes the lens and a
 * single bus line is left running off the bottom edge, which <TraceBridge />
 * picks up at the top of the Systems section.
 */

const VOLT = "#ccff00";
const COPY = {
  kicker: { en: "Behind the screen", tr: "Ekranın arkası" },
  line: {
    en: "The interface is the surface. The real work runs on the systems underneath.",
    tr: "Arayüz işin yüzeyi. Asıl iş, altında çalışan sistemlerde döner.",
  },
} as const;

/* ---------------------------------------------------------------- chip */

/** SoC package centred on (cx, cy), `s` wide — chamfered pin-1 corner, 7 pins a side */
function Chip({ cx, cy, s, id }: { cx: number; cy: number; s: number; id: string }) {
  const h = s / 2;
  const c = s * 0.12; // chamfer
  const pinLen = s * 0.09;
  const pinW = s * 0.034;
  const pitch = (s * 0.7) / 6;
  const die = s * 0.27;
  const pins: React.ReactNode[] = [];
  for (let side = 0; side < 4; side++) {
    for (let k = 0; k < 7; k++) {
      const o = (k - 3) * pitch;
      pins.push(
        <rect
          key={`${side}-${k}`}
          x={-pinW / 2 + o}
          y={-h - pinLen}
          width={pinW}
          height={pinLen + 1}
          fill="#9a9b91"
          transform={`rotate(${side * 90})`}
        />
      );
    }
  }
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <defs>
        <pattern id={`${id}-grid`} width={s * 0.045} height={s * 0.045} patternUnits="userSpaceOnUse">
          <path d={`M ${s * 0.045} 0 V ${s * 0.045} H 0`} fill="none" stroke={VOLT} strokeOpacity="0.28" strokeWidth={s * 0.004} />
        </pattern>
      </defs>
      {pins}
      <polygon
        points={`${-h + c},${-h} ${h},${-h} ${h},${h} ${-h},${h} ${-h},${-h + c}`}
        fill="#161712"
        stroke="#f4f4ef"
        strokeOpacity="0.22"
        strokeWidth={s * 0.008}
      />
      <circle cx={-h + c * 1.4} cy={-h + c * 1.4} r={s * 0.022} fill="#f4f4ef" fillOpacity="0.35" />
      <rect x={-die} y={-die} width={die * 2} height={die * 2} fill="#0c0d0b" stroke={VOLT} strokeOpacity="0.7" strokeWidth={s * 0.008} />
      <rect x={-die} y={-die} width={die * 2} height={die * 2} fill={`url(#${id}-grid)`} />
      <DieLabel s={s} ink="#f4f4ef" />
      {/* lit state: volt die with dark ink, faded in over the idle label */}
      <g className="chip-glow" opacity="0">
        <rect x={-die} y={-die} width={die * 2} height={die * 2} fill={VOLT} />
        <DieLabel s={s} ink="#0c0d0b" />
      </g>
      <text
        x="0"
        y={h - s * 0.07}
        textAnchor="middle"
        fill="#f4f4ef"
        fillOpacity="0.4"
        fontSize={s * 0.05}
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        letterSpacing={s * 0.01}
      >
        MNLTH · 26
      </text>
    </g>
  );
}

function DieLabel({ s, ink }: { s: number; ink: string }) {
  return (
    <text
      x="0"
      y={s * 0.035}
      textAnchor="middle"
      fill={ink}
      fontSize={s * 0.11}
      fontFamily="var(--font-plex-mono), ui-monospace, monospace"
      fontWeight="600"
      letterSpacing={s * 0.004}
    >
      M-01
    </text>
  );
}

/* ---------------------------------------------------------- phone body */

/** depth of the turning phone as a share of its width — a real phone is ~0.11 */
export const PHONE_DEPTH = 0.1;
const SLICES = 12;

/**
 * Titanium body between the front and back faces. Flat walls cover the
 * straight sides (solid when seen edge-on); stacked rounded slices fill in
 * the corners. Expects `--phone-depth` on the preserve-3d parent.
 */
export function PhoneEdge() {
  return (
    <>
      {Array.from({ length: SLICES }, (_, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[3rem] bg-[#1e1e1c] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]"
          // kept just inside the faces so they never z-fight
          style={{ transform: `translateZ(calc(var(--phone-depth) * ${((i / (SLICES - 1) - 0.5) * 0.94).toFixed(3)}))` }}
        />
      ))}
      {[-1, 1].map((side) => (
        <div
          key={side}
          aria-hidden
          className="pointer-events-none absolute inset-y-[3rem] bg-[linear-gradient(90deg,#262624,#55554f_50%,#262624)]"
          style={{
            width: "var(--phone-depth)",
            [side < 0 ? "left" : "right"]: "calc(var(--phone-depth) / -2)",
            transform: `rotateY(${side * 90}deg)`,
          }}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------- phone back */

/** rear face of the last phone — smoked glass over a logic board */
export function PhoneBack({ className }: { className?: string }) {
  const mono = "var(--font-plex-mono), ui-monospace, monospace";
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-[3rem] p-[2px] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(0,0,0,0.6)]",
        "bg-[linear-gradient(210deg,#4a4a46_0%,#111_18%,#0a0a0a_50%,#111_82%,#3a3a36_100%)]",
        className
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.85rem] bg-[#11120f]">
        <svg viewBox="0 0 360 780" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="pb-dots" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#f4f4ef" fillOpacity="0.07" />
            </pattern>
          </defs>
          <rect width="360" height="780" fill="url(#pb-dots)" />

          {/* board traces */}
          <g fill="none" strokeWidth="1.4" strokeLinejoin="round">
            <path d="M180 360 V300 L210 270 H270 V215" stroke="#f4f4ef" strokeOpacity="0.16" />
            <path d="M160 360 V320 L120 280 V200" stroke="#f4f4ef" strokeOpacity="0.16" />
            <path d="M240 420 H290 L320 390 V120" stroke="#f4f4ef" strokeOpacity="0.16" />
            <path d="M120 420 H70 L40 450 V610" stroke="#f4f4ef" strokeOpacity="0.16" />
            <path d="M200 480 V520 L230 550" stroke={VOLT} strokeOpacity="0.55" />
            <path d="M180 480 V560" stroke={VOLT} strokeOpacity="0.7" />
            <path d="M160 480 V520 L130 550" stroke={VOLT} strokeOpacity="0.55" />
            <path d="M240 440 H300 V700" stroke="#f4f4ef" strokeOpacity="0.12" />
            <path d="M120 400 H60 V180 L80 160" stroke="#f4f4ef" strokeOpacity="0.12" />
          </g>
          {[
            [270, 215],
            [120, 200],
            [320, 120],
            [40, 610],
            [300, 700],
            [80, 160],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="#11120f" stroke="#f4f4ef" strokeOpacity="0.4" strokeWidth="1.2" />
          ))}

          {/* camera module */}
          <rect x="22" y="22" width="134" height="134" rx="34" fill="#1b1c18" stroke="#f4f4ef" strokeOpacity="0.1" />
          {[
            [60, 60],
            [60, 118],
            [118, 89],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="23" fill="#0a0a09" stroke="#2c2d28" strokeWidth="3" />
              <circle cx={x} cy={y} r="12" fill="#050505" stroke="#22231f" strokeWidth="2" />
              <circle cx={x - 4} cy={y - 4} r="3" fill="#f4f4ef" fillOpacity="0.18" />
            </g>
          ))}
          <circle cx="122" cy="44" r="6" fill="#e8e3c8" fillOpacity="0.5" />

          {/* memory */}
          <rect x="196" y="176" width="112" height="40" fill="#161712" stroke="#f4f4ef" strokeOpacity="0.18" />
          <text x="206" y="201" fill="#f4f4ef" fillOpacity="0.45" fontSize="10" fontFamily={mono} letterSpacing="1.5">
            RAM · 12G
          </text>

          {/* SoC */}
          <g className="back-chip">
            <Chip cx={180} cy={420} s={120} id="pb-chip" />
          </g>

          {/* battery cell — the print that gives the turn its joke */}
          <rect x="40" y="590" width="280" height="140" fill="none" stroke="#f4f4ef" strokeOpacity="0.12" strokeDasharray="4 4" />
          <text x="56" y="650" fill="#f4f4ef" fontSize="26" fontFamily="var(--font-lexend-exa), sans-serif" letterSpacing="1">
            BACK END
          </text>
          <text x="56" y="676" fill="#f4f4ef" fillOpacity="0.4" fontSize="10" fontFamily={mono} letterSpacing="1.5">
            REV.04 · EA SILICON
          </text>
          <rect x="56" y="694" width="44" height="6" fill={VOLT} />
        </svg>
        {/* smoked glass sheen */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(235deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_30%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.03)_100%)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- overlay */

const CX = 800;
const CY = 500;
const PKG = 170;
const PITCH = (PKG * 0.7) / 6;

/** service names printed at trace vias, keyed by `${side}-${pin}` (0 top, 1 right, 2 bottom, 3 left) */
const LABELS: Record<string, string> = {
  "0-0": "RAG",
  "0-6": "LLM",
  "1-1": "WEBHOOK",
  "1-5": "QUEUE",
  "2-0": "POSTGRES",
  "2-6": "CRON",
  "3-1": "ERP",
  "3-5": "REST API",
};

type Trace = { key: string; d: string; via: [number, number] | null; label?: string };

/** fan of traces leaving each side of the package; built for the top side, rotated for the rest */
const TRACES: Trace[] = (() => {
  const out: Trace[] = [];
  const start = PKG / 2 + PKG * 0.09;
  for (let side = 0; side < 4; side++) {
    const a = (side * Math.PI) / 2;
    const rot = (x: number, y: number): [number, number] => [
      CX + x * Math.cos(a) - y * Math.sin(a),
      CY + x * Math.sin(a) + y * Math.cos(a),
    ];
    for (let k = 0; k < 7; k++) {
      // bottom centre pin stays free — the bus line takes it in the last beat
      if (side === 2 && k === 3) continue;
      const o = (k - 3) * PITCH;
      const run = 36 + (3 - Math.abs(k - 3)) * 22;
      const dx = o * 3;
      const p0 = rot(o, -start);
      const p1 = rot(o, -start - run);
      const p2 = rot(o + dx, -start - run - Math.abs(dx));
      const p3 = rot(o + dx, -1400);
      const pts = k === 3 ? [p0, p3] : [p0, p1, p2, p3];
      out.push({
        key: `${side}-${k}`,
        d: "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L"),
        via: k === 3 ? null : p2,
        label: LABELS[`${side}-${k}`],
      });
    }
  }
  return out;
})();

export function ChipOverlay({ locale }: { locale: "en" | "tr" }) {
  return (
    <div aria-hidden className="chip-overlay pointer-events-none invisible absolute inset-0 z-[150] bg-carbon">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g className="chip-traces" fill="none" strokeLinejoin="round">
          {TRACES.map((t) => (
            <path
              key={`b-${t.key}`}
              className="trace-base"
              d={t.d}
              pathLength={1}
              stroke="#f4f4ef"
              strokeOpacity={t.label ? 0.32 : 0.14}
              strokeWidth="1.5"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          ))}
          {TRACES.map((t) => (
            <path
              key={`p-${t.key}`}
              className="trace-pulse"
              d={t.d}
              pathLength={1}
              stroke={VOLT}
              strokeWidth="2.5"
              strokeLinecap="square"
              style={{ strokeDasharray: "0.05 2", strokeDashoffset: 0.05 }}
            />
          ))}
          <g className="trace-vias">
            {TRACES.filter((t) => t.via).map((t) => (
              <g key={`v-${t.key}`}>
                <circle
                  cx={t.via![0]}
                  cy={t.via![1]}
                  r={t.label ? 5 : 3.5}
                  fill="#0c0d0b"
                  stroke={t.label ? VOLT : "#f4f4ef"}
                  strokeOpacity={t.label ? 1 : 0.35}
                  strokeWidth="1.5"
                />
                {t.label && (
                  <text
                    x={t.via![0] + 12}
                    y={t.via![1] - 10}
                    fill="#f4f4ef"
                    fillOpacity="0.7"
                    fontSize="13"
                    fontFamily="var(--font-plex-mono), ui-monospace, monospace"
                    letterSpacing="1.5"
                    stroke="none"
                  >
                    {t.label}
                  </text>
                )}
              </g>
            ))}
          </g>
        </g>
        <g className="chip-zoom">
          <Chip cx={CX} cy={CY} s={PKG} id="ov-chip" />
        </g>
      </svg>

      {/* telemetry, top right */}
      <div className="chip-caption ui absolute right-4 top-[calc(56px+3dvh)] flex flex-col items-end gap-1 text-[10px] text-paper/55 md:right-10 lg:right-[8.5vw]">
        <span className="tabular">M-01 / SOC</span>
        <span className="tabular">8 SERVICES · 4 SYSTEMS</span>
        <span className="flex items-center gap-2 text-volt">
          <span className="h-1.5 w-1.5 animate-pulse bg-volt" />
          LIVE
        </span>
      </div>

      {/* caption, bottom left */}
      <div className="chip-caption absolute bottom-10 left-4 max-w-[38ch] md:left-10 lg:left-[8.5vw]">
        <div className="ui mb-3 flex items-center gap-3 text-paper/80">
          <span className="h-1.5 w-1.5 rounded-full bg-volt" />
          {COPY.kicker[locale]}
        </div>
        <p className="font-plex text-sm leading-[1.7] text-paper/65">{COPY.line[locale]}</p>
      </div>

      {/* bus line — the one trace that survives the push-in and leaves through the bottom edge */}
      <div className="chip-bus absolute bottom-0 left-1/2 top-1/2 w-px origin-top scale-y-0 bg-volt" />
      <div className="chip-bus-via absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 scale-0 bg-volt" />
    </div>
  );
}

/* ------------------------------------------------------------ timeline */

/** length of the outro in wheel steps; keep in sync with the positions below */
const UNITS = 3.4;

export const chipOutro: WheelOutro = {
  units: UNITS,
  build(tl, at, wrap) {
    const q = gsap.utils.selector(wrap);
    const stage = q(".flip-stage")[0] as HTMLElement | undefined;
    const area = q(".wheel-area")[0] as HTMLElement | undefined;
    const overlay = q(".chip-overlay")[0];
    if (!stage || !area || !overlay) return;

    // centre the phone in the pinned viewport, and grow it to ~80% of its height
    const lift = () =>
      wrap.clientHeight / 2 -
      (area.getBoundingClientRect().top - wrap.getBoundingClientRect().top + stage.offsetHeight / 2);
    const fit = () => Math.min(1.4, (wrap.clientHeight * 0.8) / stage.offsetHeight);
    const chip = { svgOrigin: `${CX} ${CY}` };

    gsap.set(stage, { transformPerspective: 1800 });

    // 1 — clear the stage
    tl.to(q(".mobile-copy, .mobile-glow"), { autoAlpha: 0, y: -24, duration: 0.5, ease: "power1.in" }, at)
      .to(q(".wheel-dim"), { autoAlpha: 0, duration: 0.45, ease: "power1.in" }, at)
      .to(stage, { y: lift, scale: fit, duration: 0.8, ease: "power2.inOut" }, at)

      // 2 — turn the phone over
      .fromTo(stage, { rotationY: 0 }, { rotationY: 180, duration: 1, ease: "power2.inOut" }, at + 0.45)
      .to(
        stage,
        { keyframes: [{ rotationZ: -5, duration: 0.5, ease: "sine.out" }, { rotationZ: 0, duration: 0.5, ease: "sine.in" }] },
        at + 0.45
      )

      // backface-visibility alone leaks the live iframe's layers, so swap faces
      // explicitly at the edge-on midpoint of the turn
      .to(q(".flip-front"), { autoAlpha: 0, duration: 0.01 }, at + 0.95)

      // 3 — the SoC wakes up
      .to(q(".back-chip .chip-glow"), { opacity: 1, duration: 0.25, ease: "power2.out" }, at + 1.4)

      // 4 — push in: the phone blows past the lens, the big chip resolves behind it.
      // Fade the face, not the stage: opacity on a preserve-3d node flattens it.
      .to(stage, { scale: () => fit() * 2.6, duration: 0.5, ease: "power2.in" }, at + 1.65)
      .to(q(".flip-back"), { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, at + 1.75)
      .to(overlay, { autoAlpha: 1, duration: 0.2, ease: "none" }, at + 1.8)
      .fromTo(q(".chip-zoom"), { scale: 0.45, opacity: 0, ...chip }, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out", ...chip }, at + 1.8)
      .fromTo(q(".chip-zoom .chip-glow"), { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "power1.out" }, at + 2.05)

      // 5 — traces fan out to the services, signal runs along them
      .to(q(".trace-base"), { strokeDashoffset: 0, duration: 0.6, stagger: 0.008, ease: "power2.out" }, at + 2.05)
      .fromTo(q(".trace-vias"), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" }, at + 2.35)
      .fromTo(q(".chip-caption"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, at + 2.2)
      .to(q(".trace-pulse"), { strokeDashoffset: -1.05, duration: 0.8, stagger: 0.006, ease: "none" }, at + 2.3)

      // 6 — through the die; one bus line is left running down into Systems
      .to(q(".chip-zoom"), { scale: 8, opacity: 0, duration: 0.55, ease: "power3.in", ...chip }, at + 2.75)
      .to(q(".chip-traces"), { scale: 2.2, opacity: 0, duration: 0.5, ease: "power2.in", ...chip }, at + 2.75)
      .to(q(".chip-caption"), { autoAlpha: 0, y: -12, duration: 0.25, ease: "power1.in" }, at + 2.75)
      .to(q(".chip-bus-via"), { scale: 1, duration: 0.2, ease: "back.out(3)" }, at + 3.0)
      .to(q(".chip-bus"), { scaleY: 1, duration: 0.35, ease: "power2.out" }, at + 3.05);
  },
};

/* -------------------------------------------------------------- bridge */

/**
 * Top of the Systems section: picks the bus line up at the viewport centre,
 * routes it left and drops it onto the section kicker's dot.
 */
export function TraceBridge() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 40%", scrub: 0.6 },
      });
      tl.fromTo(el.querySelector(".tb-h"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 })
        .fromTo(el.querySelector(".tb-v"), { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 0.6 });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-36 md:block">
      <div className="mx-auto h-full max-w-[1680px] px-10 lg:px-[8.5vw]">
        <div className="relative h-full">
          <span className="absolute left-1/2 top-0 h-1/2 w-px bg-volt" />
          <span className="tb-h absolute left-[3px] right-1/2 top-1/2 h-px origin-right bg-volt" />
          <span className="tb-v absolute -bottom-2 left-[3px] top-1/2 w-px origin-top bg-volt" />
        </div>
      </div>
    </div>
  );
}
