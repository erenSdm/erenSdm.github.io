"use client";

import { memo, useMemo, useRef, useState } from "react";
import { formatTime, peaks } from "./data";
import { useClockListener, useElapsedSeconds, usePlayer } from "./player";
import { C } from "./ui";

const BARS = 56;

/**
 * Waveform scrubber. Two identical bar layers: the bright one is clipped to the
 * playhead via a direct style write on every clock tick, so the bars themselves
 * never re-render while playing. Tap or drag anywhere to seek.
 */
export const WaveScrubber = memo(function WaveScrubber({ trackId, duration }: { trackId: string; duration: number }) {
  const { seek } = usePlayer();
  const bars = useMemo(() => peaks(trackId, BARS), [trackId]);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const seconds = useElapsedSeconds();

  useClockListener((sec) => {
    const el = fillRef.current;
    if (!el) return;
    const pct = Math.min(100, (sec / duration) * 100);
    el.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  });

  const seekFrom = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  return (
    <div>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration)}
        aria-valuenow={seconds}
        aria-valuetext={`${formatTime(seconds)} of ${formatTime(duration)}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          seekFrom(e.clientX);
        }}
        onPointerMove={(e) => dragging && seekFrom(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") seek(seconds + 5);
          if (e.key === "ArrowLeft") seek(seconds - 5);
        }}
        className="relative h-12 cursor-pointer touch-none select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <div
          key={trackId}
          className="absolute inset-0 flex items-center gap-[2.5px] transition-transform duration-300"
          style={{ transform: dragging ? "scaleY(1.18)" : undefined }}
        >
          <Bars bars={bars} color="rgba(255,248,240,0.2)" />
        </div>
        <div
          key={`${trackId}-fill`}
          ref={fillRef}
          className="absolute inset-0 flex items-center gap-[2.5px] transition-transform duration-300"
          style={{ transform: dragging ? "scaleY(1.18)" : undefined }}
        >
          <Bars bars={bars} color="var(--pal-accent)" />
        </div>
      </div>
      <div className="mt-1.5 flex justify-between text-[12px] font-medium tabular-nums" style={{ color: dragging ? C.text : "rgba(255,248,240,0.6)" }}>
        <span>{formatTime(seconds)}</span>
        <span>-{formatTime(Math.max(0, duration - seconds))}</span>
      </div>
    </div>
  );
});

const Bars = memo(function Bars({ bars, color }: { bars: number[]; color: string }) {
  return bars.map((h, i) => (
    <span
      key={i}
      className="wv-bar block flex-1 rounded-full"
      style={{ height: `${h * 100}%`, background: color, ["--i" as string]: i }}
    />
  ));
});

/** Hairline progress for the mini player; scaleX written directly per tick. */
export function MiniProgress({ duration }: { duration: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useClockListener((sec) => {
    if (ref.current) ref.current.style.transform = `scaleX(${Math.min(1, sec / duration)})`;
  });
  return (
    <div className="absolute inset-x-3 bottom-0 h-[2px] overflow-hidden rounded-full bg-white/10">
      <div ref={ref} className="h-full origin-left rounded-full" style={{ background: "var(--pal-accent)", transform: "scaleX(0)" }} />
    </div>
  );
}
