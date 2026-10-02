"use client";

import { createContext, memo, useContext } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Heart } from "lucide-react";
import { AlbumCover } from "./Cover";
import { formatTime, getArtist, type Track } from "./data";

/* Design tokens (warm graphite base; colour comes from artwork). */
export const C = {
  bg: "#131211",
  surface: "#1D1B1A",
  raised: "#282524",
  line: "rgba(255,248,240,0.08)",
  text: "#F4EFE9",
  muted: "#A8A29B",
  faint: "#6F6A64",
} as const;

export const STROKE = 1.75;
export const SPRING = { type: "spring", stiffness: 380, damping: 36, mass: 0.9 } as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type Route =
  | { kind: "album"; id: string }
  | { kind: "mix"; id: string }
  | { kind: "artist"; id: string }
  | { kind: "liked"; id: "liked" };

interface Nav {
  push: (route: Route) => void;
  pop: () => void;
  openPlayer: () => void;
}

export const NavContext = createContext<Nav | null>(null);
export function useNav() {
  const nav = useContext(NavContext);
  if (!nav) throw new Error("useNav outside WavesApp");
  return nav;
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** Three-bar "now playing" indicator. CSS-only so it never re-renders. */
export function Equalizer({ playing, color }: { playing: boolean; color: string }) {
  return (
    <span className="wv-eq inline-flex h-3.5 items-end gap-[2px]" data-playing={playing} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="block w-[3px] rounded-[1px]" style={{ background: color, animationDelay: `${i * -0.27}s` }} />
      ))}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-5">
      <h2 className="wv-display text-[21px] font-bold tracking-[-0.03em]" style={{ color: C.text }}>
        {children}
      </h2>
      {action}
    </div>
  );
}

export function BackButton({ label = "Back" }: { label?: string }) {
  const { pop } = useNav();
  return (
    <button
      type="button"
      onClick={pop}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-black/30 backdrop-blur-md transition active:scale-95"
      style={{ color: C.text }}
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={STROKE} />
    </button>
  );
}

export function Pressable({
  children,
  className,
  onClick,
  label,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      onClick={onClick}
      aria-label={label}
      className={`text-left ${className ?? ""}`}
      style={style}
    >
      {children}
    </motion.button>
  );
}

export const TrackRow = memo(function TrackRow({
  track,
  lead,
  active,
  playing,
  liked,
  accent,
  onPlay,
}: {
  track: Track;
  /** "cover" shows artwork, a number shows the track position */
  lead: "cover" | number;
  active: boolean;
  playing: boolean;
  liked: boolean;
  accent: string;
  onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="flex w-full items-center gap-3 px-5 py-2 text-left transition-colors active:bg-white/[0.04]"
    >
      {lead === "cover" ? (
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md">
          <AlbumCover albumId={track.albumId} className="h-full w-full" />
          {active && (
            <div className="absolute inset-0 grid place-items-center bg-black/45">
              <Equalizer playing={playing} color="#fff" />
            </div>
          )}
        </div>
      ) : (
        <span className="grid w-5 shrink-0 place-items-center text-[14px] tabular-nums" style={{ color: C.faint }}>
          {active ? <Equalizer playing={playing} color={accent} /> : lead}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className="block truncate text-[15.5px] font-medium tracking-[-0.01em] transition-colors duration-500"
          style={{ color: active ? accent : C.text }}
        >
          {track.title}
        </span>
        <span className="mt-0.5 block truncate text-[13px]" style={{ color: C.muted }}>
          {getArtist(track.artistId).name}
        </span>
      </span>
      {liked && <Heart className="h-3.5 w-3.5 shrink-0" fill={accent} stroke={accent} strokeWidth={STROKE} aria-label="Liked" />}
      <span className="w-10 shrink-0 text-right text-[13px] tabular-nums" style={{ color: C.faint }}>
        {formatTime(track.duration)}
      </span>
    </button>
  );
});

/** Horizontal scroll shelf with snap and edge padding. */
export function Shelf({ children }: { children: React.ReactNode }) {
  return (
    <div className="wv-noscroll flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-5 px-5 pb-1">
      {children}
    </div>
  );
}
