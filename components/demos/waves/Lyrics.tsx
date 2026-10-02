"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { getAlbum, lyricTimes, type Track } from "./data";
import { usePlayer } from "./player";

/**
 * Time-synced lyrics. Subscribes to the clock but only re-renders when the
 * active line index changes. Tap a line to jump to it.
 */
export function Lyrics({ track }: { track: Track }) {
  const { clock, seek } = usePlayer();
  const times = useMemo(() => lyricTimes(track), [track]);
  const lines = track.lyrics ?? [];

  const lineAt = (sec: number) => {
    let idx = -1;
    for (let i = 0; i < times.length; i++) if (sec >= times[i]) idx = i;
    return idx;
  };
  const active = useSyncExternalStore(
    clock.subscribe,
    () => lineAt(clock.get()),
    () => -1,
  );

  const scroller = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const box = scroller.current;
    const el = lineRefs.current[Math.max(0, active)];
    if (!box || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: el.offsetTop - box.clientHeight * 0.32, behavior: reduce ? "auto" : "smooth" });
  }, [active, track.id]);

  if (!lines.length) {
    const instrumental = getAlbum(track.albumId).instrumental;
    return (
      <div className="grid h-full place-items-center px-6 text-center">
        <div>
          <p className="wv-display text-[24px] font-bold tracking-[-0.03em] text-white">
            {instrumental ? "Instrumental" : "No lyrics for this song"}
          </p>
          <p className="mt-2 text-[14px] text-white/60">
            {instrumental ? "Nothing to sing along to here. Just listen." : "The artist hasn't published lyrics for it."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scroller}
      className="wv-noscroll h-full overflow-y-auto overscroll-contain px-1 py-[38%]"
      style={{ maskImage: "linear-gradient(transparent, #000 14%, #000 80%, transparent)", WebkitMaskImage: "linear-gradient(transparent, #000 14%, #000 80%, transparent)" }}
    >
      {lines.map((line, i) => {
        const state = i === active ? "on" : i < active ? "past" : "next";
        return (
          <button
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            type="button"
            onClick={() => seek(times[i] + 0.05)}
            className="wv-display block w-full origin-left py-1.5 text-left text-[26px] font-bold leading-[1.15] tracking-[-0.03em] transition-[color,transform,opacity] duration-500"
            style={{
              color: state === "on" ? "#fff" : state === "past" ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.28)",
              transform: state === "on" ? "scale(1)" : "scale(0.96)",
            }}
          >
            {line}
          </button>
        );
      })}
    </div>
  );
}
