"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  MoreVertical,
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Play,
  Pause,
  Heart,
} from "lucide-react";
import { Waveform } from "./Waveform";
import {
  ACCENT,
  NOW_PLAYING,
  PLAYLIST,
  UP_NEXT,
} from "./data";

/**
 * WAVES — mobile music player "now playing" screen.
 * Designed for a 390px column, fills the phone height. Violet-pink accent
 * used flat/editorial: no blurred orbs, no glow — just pigment on near-black.
 */
export function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);
  const [liked, setLiked] = useState(true);
  const [elapsed, setElapsed] = useState(NOW_PLAYING.startSec);

  // Advance the clock while playing. Uses a wall-clock delta so a backgrounded
  // tab doesn't drift, and clamps / loops at the end of the track.
  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setElapsed((prev) => {
        const next = prev + dt;
        if (next >= NOW_PLAYING.durationSec) {
          return repeat ? next - NOW_PLAYING.durationSec : NOW_PLAYING.durationSec;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, repeat]);

  // Stop at the very end when not repeating.
  useEffect(() => {
    if (!repeat && elapsed >= NOW_PLAYING.durationSec) setIsPlaying(false);
  }, [elapsed, repeat]);

  return (
    <section className="relative flex h-full min-h-[100dvh] flex-col overflow-hidden bg-[#0a090c] text-paper">
      {/* keyframes: album float + perpetual waveform pulse. Reduced-motion safe. */}
      <style>{`
        @keyframes waves-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes waves-pulse {
          0%, 100% { transform: scaleY(0.82); }
          50% { transform: scaleY(1); }
        }
        .waves-art { animation: waves-float 7s ease-in-out infinite; will-change: transform; }
        .waves-bar {
          transform-origin: center;
          animation: waves-pulse 1.5s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .waves-art, .waves-bar { animation: none !important; }
        }
      `}</style>

      {/* faint top hairline in accent — flat editorial marker, not a glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          opacity: 0.5,
        }}
      />

      {/* ---- top bar ---- */}
      <header className="flex items-center justify-between px-6 pt-5">
        <button
          type="button"
          aria-label="Collapse player"
          className="grid h-9 w-9 place-items-center rounded-full text-bone ring-1 ring-white/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90"
        >
          <ChevronDown size={18} strokeWidth={1.75} />
        </button>

        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ash">
            Playing From
          </span>
          <span className="mt-1 text-[13px] font-medium tracking-tight text-paper">
            {PLAYLIST}
          </span>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="grid h-9 w-9 place-items-center rounded-full text-bone ring-1 ring-white/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90"
        >
          <MoreVertical size={18} strokeWidth={1.75} />
        </button>
      </header>

      {/* ---- stage: artwork ---- */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-6">
        <div className="waves-art relative w-full max-w-[300px]">
          {/* double-bezel: outer tray + inner core */}
          <div className="rounded-[26px] bg-white/[0.04] p-2 ring-1 ring-white/10">
            <div className="relative overflow-hidden rounded-[18px] ring-1 ring-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
              <img
                src={`https://picsum.photos/seed/${NOW_PLAYING.seed}/600/600`}
                width={600}
                height={600}
                alt={`Album artwork for ${NOW_PLAYING.title} by ${NOW_PLAYING.artist}`}
                className="block aspect-square w-full object-cover"
              />
              {/* editorial corner tag */}
              <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/90 backdrop-blur-sm">
                Lossless
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- meta + waveform + controls + up next ---- */}
      <div className="px-6 pb-5">
        {/* title / artist / like */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-[26px] font-semibold leading-tight tracking-tight text-paper">
              {NOW_PLAYING.title}
            </h1>
            <p className="mt-0.5 truncate text-[15px] text-ash">
              {NOW_PLAYING.artist}
            </p>
          </div>
          <button
            type="button"
            aria-label={liked ? "Remove from Liked" : "Add to Liked"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
            className="mb-1 grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-white/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90"
          >
            <Heart
              size={19}
              strokeWidth={1.75}
              style={liked ? { color: ACCENT, fill: ACCENT } : { color: "#cbcbc2" }}
            />
          </button>
        </div>

        {/* waveform scrubber */}
        <div className="mt-5">
          <Waveform
            elapsed={elapsed}
            duration={NOW_PLAYING.durationSec}
            onSeek={(s) => setElapsed(s)}
          />
        </div>

        {/* transport controls */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Shuffle"
            aria-pressed={shuffle}
            onClick={() => setShuffle((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90"
            style={{ color: shuffle ? ACCENT : "#7f7f78" }}
          >
            <Shuffle size={19} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            aria-label="Previous track"
            className="grid h-11 w-11 place-items-center rounded-full text-paper transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90"
          >
            <SkipBack size={24} strokeWidth={1.9} fill="currentColor" />
          </button>

          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying((v) => !v)}
            className="grid h-16 w-16 place-items-center rounded-full text-[#0a090c] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.94]"
            style={{ backgroundColor: ACCENT }}
          >
            {isPlaying ? (
              <Pause size={26} strokeWidth={0} fill="currentColor" />
            ) : (
              <Play size={26} strokeWidth={0} fill="currentColor" className="translate-x-[2px]" />
            )}
          </button>

          <button
            type="button"
            aria-label="Next track"
            className="grid h-11 w-11 place-items-center rounded-full text-paper transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90"
          >
            <SkipForward size={24} strokeWidth={1.9} fill="currentColor" />
          </button>

          <button
            type="button"
            aria-label="Repeat"
            aria-pressed={repeat}
            onClick={() => setRepeat((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90"
            style={{ color: repeat ? ACCENT : "#7f7f78" }}
          >
            <Repeat size={19} strokeWidth={1.9} />
          </button>
        </div>

        {/* up next peek */}
        <div className="mt-6 border-t border-white/[0.07] pt-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ash">
              Up Next
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-dim">
              {UP_NEXT.length} tracks
            </span>
          </div>

          <ul className="mt-3 space-y-3">
            {UP_NEXT.map((t) => (
              <li key={t.seed} className="flex items-center gap-3">
                <img
                  src={`https://picsum.photos/seed/${t.seed}/120/120`}
                  width={120}
                  height={120}
                  alt={`Album artwork for ${t.title} by ${t.artist}`}
                  className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium tracking-tight text-paper">
                    {t.title}
                  </p>
                  <p className="truncate text-[12px] text-ash">{t.artist}</p>
                </div>
                <span
                  aria-hidden
                  className="flex h-4 items-end gap-[2px]"
                >
                  <span className="w-[2px] rounded-full bg-white/15" style={{ height: "40%" }} />
                  <span className="w-[2px] rounded-full bg-white/15" style={{ height: "80%" }} />
                  <span className="w-[2px] rounded-full bg-white/15" style={{ height: "55%" }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
