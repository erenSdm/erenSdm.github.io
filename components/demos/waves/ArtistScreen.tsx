"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { AlbumCover } from "./Cover";
import { FOLLOWED_ARTIST_IDS, artistAlbums, artistTracks, formatListeners, getArtist } from "./data";
import { usePlayer } from "./player";
import { BackButton, C, Pressable, SectionTitle, Shelf, STROKE, TrackRow, useNav } from "./ui";

export function ArtistScreen({ id }: { id: string }) {
  const artist = getArtist(id);
  const albums = artistAlbums(id);
  const latest = albums[0];
  const pal = latest.palette;
  // "Popular": vocal singles first, then catalog order.
  const popular = artistTracks(id)
    .slice()
    .sort((a, b) => (a.lyrics ? 0 : 1) - (b.lyrics ? 0 : 1))
    .slice(0, 5);
  const popularIds = popular.map((t) => t.id);
  const context = `${artist.name} · Popular`;

  const { state, current, playList, toggle } = usePlayer();
  const nav = useNav();
  const [following, setFollowing] = useState(FOLLOWED_ARTIST_IDS.includes(id));
  const isThis = state.context === context;

  const scroller = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scroller });
  const heroY = useTransform(scrollY, [0, 300], [0, 90]);
  const barOpacity = useTransform(scrollY, [200, 260], [0, 1]);

  return (
    <div className="relative h-full">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[calc(var(--safe-top)+52px)]"
        style={{ opacity: barOpacity, background: pal.deep }}
      />
      <div className="absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <BackButton />
        <motion.span className="truncate text-[15px] font-semibold" style={{ opacity: barOpacity, color: C.text }}>
          {artist.name}
        </motion.span>
      </div>

      <div ref={scroller} className="wv-noscroll h-full overflow-y-auto overscroll-contain">
        <div className="relative h-[340px] overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <AlbumCover albumId={latest.id} className="h-full w-full scale-[1.35]" />
          </motion.div>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 35%, ${C.bg} 100%)` }} />
          <div className="absolute inset-x-5 bottom-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80">{artist.origin}</p>
            <h1 className="wv-display mt-1 text-[44px] font-extrabold leading-[0.92] tracking-[-0.05em] text-white">{artist.name}</h1>
          </div>
        </div>

        <div className="pb-[calc(var(--safe-bottom)+150px)]">
          <div className="flex items-center justify-between px-5 pt-3">
            <div>
              <p className="text-[13px] tabular-nums" style={{ color: C.muted }}>
                {formatListeners(artist.listeners + (following ? 1 : 0))} monthly listeners
              </p>
              <button
                type="button"
                onClick={() => setFollowing((f) => !f)}
                aria-pressed={following}
                className="mt-2.5 h-8 rounded-full border px-4 text-[13px] font-semibold transition active:scale-95"
                style={{
                  borderColor: following ? "transparent" : "rgba(255,255,255,0.28)",
                  background: following ? "rgba(255,255,255,0.1)" : "transparent",
                  color: C.text,
                }}
              >
                {following ? "Following" : "Follow"}
              </button>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => (isThis ? toggle() : playList(popularIds, 0, context))}
              aria-label={isThis && state.playing ? "Pause" : "Play"}
              className="grid h-14 w-14 place-items-center rounded-full"
              style={{ background: pal.accent, color: pal.ink }}
            >
              {isThis && state.playing ? (
                <Pause className="h-6 w-6" fill="currentColor" strokeWidth={STROKE} />
              ) : (
                <Play className="ml-0.5 h-6 w-6" fill="currentColor" strokeWidth={STROKE} />
              )}
            </motion.button>
          </div>

          <section className="mt-7">
            <SectionTitle>Popular</SectionTitle>
            {popular.map((tr, i) => (
              <TrackRow
                key={tr.id}
                track={tr}
                lead="cover"
                active={current.id === tr.id}
                playing={state.playing}
                liked={state.liked.includes(tr.id)}
                accent={pal.accent}
                onPlay={() => (current.id === tr.id ? nav.openPlayer() : playList(popularIds, i, context))}
              />
            ))}
          </section>

          <section className="mt-8">
            <SectionTitle>Discography</SectionTitle>
            <Shelf>
              {albums.map((a) => (
                <Pressable key={a.id} onClick={() => nav.push({ kind: "album", id: a.id })} className="w-[136px] shrink-0 snap-start">
                  <AlbumCover albumId={a.id} className="h-[136px] w-[136px] rounded-lg" />
                  <span className="mt-2 block truncate text-[13.5px] font-semibold" style={{ color: C.text }}>
                    {a.title}
                  </span>
                  <span className="mt-0.5 block text-[12.5px]" style={{ color: C.muted }}>
                    {a.year} · {a.kind}
                  </span>
                </Pressable>
              ))}
            </Shelf>
          </section>

          <section className="mt-8 px-5">
            <div className="rounded-2xl p-5" style={{ background: `linear-gradient(150deg, ${pal.deep}, ${C.surface})` }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: pal.accent }}>
                About
              </p>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.text }}>
                {artist.bio}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
