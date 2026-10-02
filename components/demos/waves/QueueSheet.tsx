"use client";

import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { Repeat, Repeat1, Shuffle, X } from "lucide-react";
import { AlbumCover } from "./Cover";
import { formatTime, getArtist, getTrack } from "./data";
import { usePlayer } from "./player";
import { C, Equalizer, SPRING, STROKE } from "./ui";

export function QueueSheet({ onClose }: { onClose: () => void }) {
  const { state, current, jumpTo, removeAt, toggleShuffle, cycleRepeat } = usePlayer();
  const controls = useDragControls();
  const reduce = useReducedMotion();
  const upcoming = state.queue.map((id, i) => ({ id, i })).filter(({ i }) => i > state.index);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close queue"
        className="absolute inset-0 z-40 bg-black/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-label="Up next"
        className="absolute inset-x-0 bottom-0 z-50 flex h-[74%] flex-col rounded-t-[28px] border-t border-white/10"
        style={{ background: "color-mix(in oklab, var(--pal-deep) 70%, #161413)" }}
        initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
        transition={SPRING}
        drag="y"
        dragListener={false}
        dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.9 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 600) onClose();
        }}
      >
        <div className="shrink-0 cursor-grab touch-none px-5 pb-3 pt-2.5" onPointerDown={(e) => controls.start(e)}>
          <div className="mx-auto h-1 w-10 rounded-full bg-white/25" />
          <div className="mt-4 flex items-center justify-between">
            <h2 className="wv-display text-[22px] font-bold tracking-[-0.03em] text-white">Up next</h2>
            <div className="flex gap-2">
              <ToggleChip on={state.shuffle} onClick={toggleShuffle} label="Shuffle">
                <Shuffle className="h-4 w-4" strokeWidth={STROKE} />
              </ToggleChip>
              <ToggleChip on={state.repeat !== "off"} onClick={cycleRepeat} label={`Repeat: ${state.repeat}`}>
                {state.repeat === "one" ? <Repeat1 className="h-4 w-4" strokeWidth={STROKE} /> : <Repeat className="h-4 w-4" strokeWidth={STROKE} />}
              </ToggleChip>
            </div>
          </div>
        </div>

        <div className="wv-noscroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(var(--safe-bottom)+16px)]">
          <p className="px-5 pb-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">Now playing</p>
          <div className="flex items-center gap-3 px-5 py-2">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md">
              <AlbumCover albumId={current.albumId} className="h-full w-full" />
              <div className="absolute inset-0 grid place-items-center bg-black/40">
                <Equalizer playing={state.playing} color="#fff" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15.5px] font-semibold" style={{ color: "var(--pal-accent)" }}>
                {current.title}
              </p>
              <p className="truncate text-[13px] text-white/60">{getArtist(current.artistId).name}</p>
            </div>
          </div>

          <p className="px-5 pb-1.5 pt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Next from {state.context}
          </p>
          {upcoming.length === 0 ? (
            <div className="mx-5 mt-1 rounded-2xl px-4 py-6 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-[15px] font-semibold text-white">Nothing queued after this song</p>
              <p className="mt-1 text-[13px] text-white/60">
                {state.repeat === "all" ? "Repeat is on, so the queue starts over." : "Play an album or mix to fill the queue."}
              </p>
            </div>
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {upcoming.map(({ id, i }) => {
                  const tr = getTrack(id);
                  return (
                    <motion.li
                      key={id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                      transition={SPRING}
                      className="flex items-center gap-1 pr-3"
                    >
                      <button type="button" onClick={() => jumpTo(i)} className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-5 text-left active:opacity-70">
                        <AlbumCover albumId={tr.albumId} className="h-11 w-11 shrink-0 rounded-md" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium text-white">{tr.title}</span>
                          <span className="block truncate text-[13px] text-white/60">
                            {getArtist(tr.artistId).name} · {formatTime(tr.duration)}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAt(i)}
                        aria-label={`Remove ${tr.title} from queue`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/55 transition hover:text-white active:scale-90"
                      >
                        <X className="h-[18px] w-[18px]" strokeWidth={STROKE} />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.div>
    </>
  );
}

function ToggleChip({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={on}
      className="grid h-9 w-9 place-items-center rounded-full transition active:scale-95"
      style={{ background: on ? "var(--pal-accent)" : "rgba(255,255,255,0.08)", color: on ? "var(--pal-ink)" : C.text }}
    >
      {children}
    </button>
  );
}
