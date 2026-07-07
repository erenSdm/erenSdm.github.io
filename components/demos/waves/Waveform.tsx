"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ACCENT, WAVEFORM, formatTime } from "./data";

interface WaveformProps {
  /** elapsed seconds */
  elapsed: number;
  /** total duration seconds */
  duration: number;
  /** seek callback with an absolute second value */
  onSeek: (seconds: number) => void;
}

/**
 * Animated waveform scrubber. Each vertical bar is sized to its amplitude and
 * carries a subtle perpetual scaleY pulse (staggered per bar). The played
 * portion is filled with the accent; the remainder sits in a dim neutral.
 * Doubles as an accessible slider — pointer to scrub, arrow keys to nudge.
 */
export function Waveform({ elapsed, duration, onSeek }: WaveformProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;
  const remaining = Math.max(0, duration - elapsed);

  const seekFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    onSeek(Math.min(1, Math.max(0, ratio)) * duration);
  };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek within track"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={Math.round(elapsed)}
        aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          seekFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) seekFromClientX(e.clientX);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            onSeek(Math.min(duration, elapsed + 5));
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            onSeek(Math.max(0, elapsed - 5));
          } else if (e.key === "Home") {
            e.preventDefault();
            onSeek(0);
          } else if (e.key === "End") {
            e.preventDefault();
            onSeek(duration);
          }
        }}
        className="group relative flex h-16 w-full cursor-pointer touch-none items-center justify-between rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#9b87e8]/70"
      >
        {WAVEFORM.map((amp, i) => {
          const barFraction = i / (WAVEFORM.length - 1);
          const played = barFraction <= progress;
          const height = 6 + amp * 46; // px
          return (
            <span
              key={i}
              className="waves-bar block w-[3px] shrink-0 rounded-full"
              style={{
                height: `${height}px`,
                backgroundColor: played ? ACCENT : "rgba(244,244,239,0.16)",
                animationDelay: `${(i % 12) * 90}ms`,
                opacity: played ? 1 : 0.9,
              }}
            />
          );
        })}

        {/* playhead knob */}
        <span
          className="pointer-events-none absolute top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0b0a0d]"
          style={{
            left: `${progress * 100}%`,
            backgroundColor: ACCENT,
          }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] tracking-wide">
        <span className="text-paper/80">{formatTime(elapsed)}</span>
        <span className={cn("text-ash")}>-{formatTime(remaining)}</span>
      </div>
    </div>
  );
}
