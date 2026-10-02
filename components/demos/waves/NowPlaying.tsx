"use client";

import { useState } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { ChevronDown, Heart, ListMusic, MicVocal, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { AlbumCover } from "./Cover";
import { getArtist } from "./data";
import { Lyrics } from "./Lyrics";
import { usePlayer } from "./player";
import { QueueSheet } from "./QueueSheet";
import { WaveScrubber } from "./Scrubber";
import { Equalizer, SPRING, STROKE, useNav } from "./ui";

/**
 * Full-screen player. Slides up over the app inside the device column and is
 * dismissed by dragging the header/artwork down. Every colour here resolves
 * from the --pal-* custom properties, which are registered with @property so
 * gradients and controls crossfade when the track (and album palette) changes.
 */
export function NowPlaying({ onClose }: { onClose: () => void }) {
  const { state, current, toggle, next, prev, toggleShuffle, cycleRepeat, toggleLike } = usePlayer();
  const nav = useNav();
  const reduce = useReducedMotion();
  const controls = useDragControls();
  const [view, setView] = useState<"art" | "lyrics">("art");
  const [queueOpen, setQueueOpen] = useState(false);
  const liked = state.liked.includes(current.id);
  const artist = getArtist(current.artistId);
  const upcoming = state.queue.length - state.index - 1;

  return (
    <motion.section
      aria-label="Now playing"
      className="absolute inset-0 z-50 flex flex-col overflow-hidden"
      initial={reduce ? { opacity: 0 } : { y: "100%" }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: "100%" }}
      transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 34, mass: 0.9 }}
      drag="y"
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 1 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 140 || info.velocity.y > 700) onClose();
      }}
    >
      {/* palette background: registered custom properties make this gradient interpolate */}
      <div className="wv-np-bg absolute inset-0" />
      <AnimatePresence initial={false}>
        <motion.div
          key={current.albumId}
          className="pointer-events-none absolute -inset-x-1/4 -top-[12%] h-[70%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: "blur(70px) saturate(1.15)" }}
        >
          <AlbumCover albumId={current.albumId} className="h-full w-full" />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />

      <div className="relative flex min-h-0 flex-1 flex-col px-6" style={{ paddingTop: "calc(var(--safe-top) + 2px)" }}>
        {/* drag handle + header */}
        <div className="flex shrink-0 touch-none items-center justify-between py-2" onPointerDown={(e) => controls.start(e)}>
          <button type="button" onClick={onClose} aria-label="Minimise player" className="grid h-10 w-10 -ml-2 place-items-center rounded-full text-white active:bg-white/10">
            <ChevronDown className="h-6 w-6" strokeWidth={STROKE} />
          </button>
          <div className="min-w-0 px-2 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/60">
              <Equalizer playing={state.playing} color="rgba(255,255,255,0.7)" />
              Playing from
            </p>
            <p className="truncate text-[13.5px] font-semibold text-white">{state.context}</p>
          </div>
          <div className="h-10 w-10" aria-hidden />
        </div>

        {/* artwork / lyrics stage */}
        <div className="relative mt-3 aspect-square w-full shrink-0">
          <AnimatePresence initial={false} mode="popLayout">
            {view === "art" ? (
              <motion.div
                key={`art-${current.id}`}
                className="absolute inset-0 touch-none"
                onPointerDown={(e) => controls.start(e)}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: state.playing ? 1 : 0.88 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={reduce ? { duration: 0 } : SPRING}
              >
                <AlbumCover
                  albumId={current.albumId}
                  className="h-full w-full rounded-[22px] shadow-[0_40px_70px_-28px_rgba(0,0,0,0.8)]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="lyrics"
                className="absolute inset-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
              >
                <Lyrics key={current.id} track={current} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* title row */}
        <div className="mt-7 flex shrink-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
              >
                <h2 className="wv-display truncate text-[25px] font-bold leading-tight tracking-[-0.035em] text-white">{current.title}</h2>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    nav.push({ kind: "artist", id: artist.id });
                  }}
                  className="mt-0.5 block max-w-full truncate text-left text-[16px] text-white/65 active:text-white"
                >
                  {artist.name}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.button
            type="button"
            onClick={() => toggleLike(current.id)}
            aria-label={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
            aria-pressed={liked}
            whileTap={{ scale: 0.8 }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
          >
            <motion.span key={liked ? "on" : "off"} initial={reduce || !liked ? false : { scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
              <Heart
                className="h-[26px] w-[26px] transition-colors duration-500"
                strokeWidth={STROKE}
                style={{ color: liked ? "var(--pal-accent)" : "rgba(255,255,255,0.8)" }}
                fill={liked ? "currentColor" : "none"}
              />
            </motion.span>
          </motion.button>
        </div>

        <div className="mt-4 shrink-0">
          <WaveScrubber trackId={current.id} duration={current.duration} />
        </div>

        {/* transport */}
        <div className="mt-3 flex shrink-0 items-center justify-between">
          <IconToggle on={state.shuffle} onClick={toggleShuffle} label={state.shuffle ? "Shuffle on" : "Shuffle off"}>
            <Shuffle className="h-[22px] w-[22px]" strokeWidth={STROKE} />
          </IconToggle>
          <motion.button type="button" whileTap={{ scale: 0.86 }} onClick={prev} aria-label="Previous" className="grid h-14 w-14 place-items-center text-white">
            <SkipBack className="h-8 w-8" fill="currentColor" strokeWidth={STROKE} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={toggle}
            aria-label={state.playing ? "Pause" : "Play"}
            className="wv-pal-bg grid h-[74px] w-[74px] place-items-center rounded-full shadow-[0_18px_36px_-16px_rgba(0,0,0,0.7)]"
            style={{ color: "var(--pal-ink)" }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={state.playing ? "pause" : "play"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.15 }}
              >
                {state.playing ? (
                  <Pause className="h-8 w-8" fill="currentColor" strokeWidth={STROKE} />
                ) : (
                  <Play className="ml-1 h-8 w-8" fill="currentColor" strokeWidth={STROKE} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.button type="button" whileTap={{ scale: 0.86 }} onClick={next} aria-label="Next" className="grid h-14 w-14 place-items-center text-white">
            <SkipForward className="h-8 w-8" fill="currentColor" strokeWidth={STROKE} />
          </motion.button>
          <IconToggle on={state.repeat !== "off"} onClick={cycleRepeat} label={`Repeat ${state.repeat}`}>
            {state.repeat === "one" ? <Repeat1 className="h-[22px] w-[22px]" strokeWidth={STROKE} /> : <Repeat className="h-[22px] w-[22px]" strokeWidth={STROKE} />}
          </IconToggle>
        </div>

        {/* secondary */}
        <div className="mt-auto flex shrink-0 items-center justify-between pb-[calc(var(--safe-bottom)+6px)] pt-3">
          <Pill on={view === "lyrics"} onClick={() => setView((v) => (v === "art" ? "lyrics" : "art"))} label="Lyrics">
            <MicVocal className="h-4 w-4" strokeWidth={STROKE} />
          </Pill>
          <Pill on={queueOpen} onClick={() => setQueueOpen(true)} label={upcoming > 0 ? `Up next · ${upcoming}` : "Up next"}>
            <ListMusic className="h-4 w-4" strokeWidth={STROKE} />
          </Pill>
        </div>
      </div>

      <AnimatePresence>{queueOpen && <QueueSheet onClose={() => setQueueOpen(false)} />}</AnimatePresence>
    </motion.section>
  );
}

function IconToggle({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      aria-label={label}
      aria-pressed={on}
      className="relative grid h-11 w-11 place-items-center transition-colors duration-500"
      style={{ color: on ? "var(--pal-accent)" : "rgba(255,255,255,0.62)" }}
    >
      {children}
      <span
        className="absolute bottom-0.5 h-1 w-1 rounded-full transition-opacity"
        style={{ background: "var(--pal-accent)", opacity: on ? 1 : 0 }}
      />
    </motion.button>
  );
}

function Pill({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition active:scale-95"
      style={{ background: on ? "var(--pal-accent)" : "rgba(255,255,255,0.1)", color: on ? "var(--pal-ink)" : "#fff" }}
    >
      {children}
      {label}
    </button>
  );
}
