"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Pause, Play, Shuffle } from "lucide-react";
import { getCollection } from "./collections";
import { AlbumCover, ArtistAvatar, CollectionCover } from "./Cover";
import { artistAlbums, getAlbum, getTrack } from "./data";
import { usePlayer } from "./player";
import { BackButton, C, Pressable, SectionTitle, Shelf, STROKE, TrackRow, useNav } from "./ui";

export function CollectionScreen({ kind, id }: { kind: "album" | "mix" | "liked"; id: string }) {
  const { state, current, playList, toggle, toggleShuffle } = usePlayer();
  const nav = useNav();
  const col = getCollection(kind, id, state.liked);
  const pal = col.palette;

  const scroller = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scroller });
  const barOpacity = useTransform(scrollY, [220, 300], [0, 1]);
  const coverScale = useTransform(scrollY, [0, 240], [1, 0.82]);
  const coverOpacity = useTransform(scrollY, [60, 260], [1, 0.25]);

  const isThis = state.context === col.title && col.trackIds.includes(current.id);
  const showPause = isThis && state.playing;
  const empty = col.trackIds.length === 0;

  const play = (index: number) => playList(col.trackIds, index, col.title);
  const more = col.artistId ? artistAlbums(col.artistId).filter((a) => a.id !== col.id) : [];

  return (
    <div className="relative h-full">
      {/* compact bar that fades in once the title scrolls away */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[calc(var(--safe-top)+52px)]"
        style={{ opacity: barOpacity, background: `linear-gradient(${pal.deep}, ${pal.deep}f2)` }}
      />
      <div className="absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <BackButton />
        <motion.span className="truncate text-[15px] font-semibold" style={{ opacity: barOpacity, color: C.text }}>
          {col.title}
        </motion.span>
      </div>

      <div ref={scroller} className="wv-noscroll h-full overflow-y-auto overscroll-contain">
        <div
          className="pb-[calc(var(--safe-bottom)+150px)]"
          style={{ background: `linear-gradient(180deg, ${pal.mid} 0px, ${pal.deep} 340px, ${C.bg} 560px)` }}
        >
          <div className="flex justify-center" style={{ paddingTop: "calc(var(--safe-top) + 52px)" }}>
            <motion.div style={{ scale: coverScale, opacity: coverOpacity }} className="origin-bottom">
              <CollectionCover kind={col.kind} id={col.id} className="h-[228px] w-[228px] overflow-hidden rounded-2xl shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75)]" />
            </motion.div>
          </div>

          <div className="px-5 pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: pal.accent }}>
              {col.eyebrow}
            </p>
            <h1 className="wv-display mt-1.5 text-[30px] font-bold leading-[1.02] tracking-[-0.04em]" style={{ color: C.text }}>
              {col.title}
            </h1>
            {col.description && (
              <p className="mt-2 text-[14px] leading-snug" style={{ color: C.muted }}>
                {col.description}
              </p>
            )}

            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                {col.artistId ? (
                  <button type="button" onClick={() => nav.push({ kind: "artist", id: col.artistId! })} className="flex items-center gap-2">
                    <ArtistAvatar artistId={col.artistId} albumId={col.id} className="h-6 w-6 text-[7px]" />
                    <span className="truncate text-[14px] font-semibold" style={{ color: C.text }}>
                      {col.byline}
                    </span>
                  </button>
                ) : (
                  <p className="truncate text-[14px] font-semibold" style={{ color: C.text }}>
                    {col.byline}
                  </p>
                )}
                <p className="mt-1 text-[12.5px]" style={{ color: C.muted }}>
                  {col.meta}
                </p>
              </div>

              {!empty && (
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => (isThis ? toggleShuffle() : playList(col.trackIds, 0, col.title, { shuffle: true }))}
                    aria-label="Shuffle play"
                    aria-pressed={isThis && state.shuffle}
                    className="grid h-10 w-10 place-items-center rounded-full transition active:scale-95"
                    style={{ color: isThis && state.shuffle ? pal.accent : C.muted, background: "rgba(255,255,255,0.06)" }}
                  >
                    <Shuffle className="h-[18px] w-[18px]" strokeWidth={STROKE} />
                  </button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => (isThis ? toggle() : play(0))}
                    aria-label={showPause ? "Pause" : "Play"}
                    className="grid h-14 w-14 place-items-center rounded-full shadow-[0_12px_28px_-12px_rgba(0,0,0,0.7)]"
                    style={{ background: pal.accent, color: pal.ink }}
                  >
                    {showPause ? (
                      <Pause className="h-6 w-6" fill="currentColor" strokeWidth={STROKE} />
                    ) : (
                      <Play className="ml-0.5 h-6 w-6" fill="currentColor" strokeWidth={STROKE} />
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            {empty ? (
              <div className="mx-5 rounded-2xl px-5 py-8 text-center" style={{ background: C.surface }}>
                <Heart className="mx-auto h-7 w-7" strokeWidth={STROKE} style={{ color: pal.accent }} />
                <p className="mt-3 text-[15px] font-semibold" style={{ color: C.text }}>
                  Songs you like show up here
                </p>
                <p className="mt-1 text-[13px]" style={{ color: C.muted }}>
                  Tap the heart in the player to save a song.
                </p>
              </div>
            ) : (
              col.trackIds.map((tid, i) => {
                const tr = getTrack(tid);
                const active = isThis && current.id === tid;
                return (
                  <TrackRow
                    key={tid}
                    track={tr}
                    lead={col.kind === "album" ? i + 1 : "cover"}
                    active={active}
                    playing={state.playing}
                    liked={col.kind !== "liked" && state.liked.includes(tid)}
                    accent={pal.accent}
                    onPlay={() => (active ? nav.openPlayer() : play(i))}
                  />
                );
              })
            )}
          </div>

          {more.length > 0 && (
            <section className="mt-9">
              <SectionTitle>More by {col.byline}</SectionTitle>
              <Shelf>
                {more.map((a) => (
                  <Pressable key={a.id} onClick={() => nav.push({ kind: "album", id: a.id })} className="w-[136px] shrink-0 snap-start">
                    <AlbumCover albumId={a.id} className="h-[136px] w-[136px] rounded-lg" />
                    <span className="mt-2 block truncate text-[13.5px] font-semibold" style={{ color: C.text }}>
                      {a.title}
                    </span>
                    <span className="mt-0.5 block text-[12.5px]" style={{ color: C.muted }}>
                      {a.kind} · {a.year}
                    </span>
                  </Pressable>
                ))}
              </Shelf>
            </section>
          )}
          {col.kind === "album" && (
            <p className="mt-8 px-5 text-[12px]" style={{ color: C.faint }}>
              ℗ {getAlbum(col.id).year} {col.byline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
