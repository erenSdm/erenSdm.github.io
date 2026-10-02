"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipForward } from "lucide-react";
import { AlbumCover } from "./Cover";
import { getArtist } from "./data";
import { usePlayer } from "./player";
import { MiniProgress } from "./Scrubber";
import { STROKE } from "./ui";

/** Persistent player above the tab bar. Tap or drag up to expand. */
export function MiniPlayer({ onOpen }: { onOpen: () => void }) {
  const { state, current, toggle, next } = usePlayer();

  return (
    <div
      className="relative flex h-[60px] items-center gap-1 overflow-hidden rounded-2xl border border-white/[0.07] pr-1.5 shadow-[0_16px_32px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      style={{ background: "color-mix(in oklab, var(--pal-deep) 78%, rgba(40,37,36,0.92))" }}
    >
      <motion.div
        className="flex min-w-0 flex-1 cursor-pointer touch-none items-center gap-3 self-stretch pl-2"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.35, bottom: 0.05 }}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.y < -24 || info.velocity.y < -400) onOpen();
        }}
        onTap={onOpen}
        role="button"
        tabIndex={0}
        aria-label={`Open player: ${current.title} by ${getArtist(current.artistId).name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.22 }}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <AlbumCover albumId={current.albumId} className="h-11 w-11 shrink-0 rounded-[9px]" />
            <span className="min-w-0">
              <span className="block truncate text-[14.5px] font-semibold text-white">{current.title}</span>
              <span className="block truncate text-[12.5px] text-white/60">{getArtist(current.artistId).name}</span>
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.86 }}
        onClick={toggle}
        aria-label={state.playing ? "Pause" : "Play"}
        className="grid h-11 w-11 shrink-0 place-items-center text-white"
      >
        {state.playing ? (
          <Pause className="h-6 w-6" fill="currentColor" strokeWidth={STROKE} />
        ) : (
          <Play className="ml-0.5 h-6 w-6" fill="currentColor" strokeWidth={STROKE} />
        )}
      </motion.button>
      <motion.button type="button" whileTap={{ scale: 0.86 }} onClick={next} aria-label="Next" className="grid h-11 w-10 shrink-0 place-items-center text-white">
        <SkipForward className="h-[22px] w-[22px]" fill="currentColor" strokeWidth={STROKE} />
      </motion.button>

      <MiniProgress duration={current.duration} />
    </div>
  );
}
