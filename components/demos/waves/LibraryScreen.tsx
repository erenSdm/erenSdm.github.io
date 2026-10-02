"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pin, X } from "lucide-react";
import { AlbumCover, ArtistAvatar, LikedCover, MixCover } from "./Cover";
import { LIKED_PALETTE } from "./collections";
import { FOLLOWED_ARTIST_IDS, MIXES, SAVED_ALBUM_IDS, artistAlbums, getAlbum, getArtist, getTrack } from "./data";
import { usePlayer } from "./player";
import { C, SPRING, STROKE, TrackRow, useNav, type Route } from "./ui";

type Filter = "playlists" | "albums" | "artists";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "playlists", label: "Playlists" },
  { id: "albums", label: "Albums" },
  { id: "artists", label: "Artists" },
];

interface Item {
  key: string;
  type: Filter;
  route: Route;
  title: string;
  sub: string;
  art: React.ReactNode;
  round?: boolean;
}

export function LibraryScreen() {
  const [filter, setFilter] = useState<Filter | null>(null);
  const { state, current, playList } = usePlayer();
  const nav = useNav();

  const items: Item[] = [
    ...MIXES.map<Item>((m) => ({
      key: `mix-${m.id}`,
      type: "playlists",
      route: { kind: "mix", id: m.id },
      title: m.title,
      sub: `Playlist · ${m.owner === "you" ? "By you" : "WAVES"} · ${m.trackIds.length} songs`,
      art: <MixCover mixId={m.id} className="h-full w-full" />,
    })),
    ...SAVED_ALBUM_IDS.map<Item>((id) => {
      const a = getAlbum(id);
      return {
        key: `album-${id}`,
        type: "albums",
        route: { kind: "album", id },
        title: a.title,
        sub: `${a.kind} · ${getArtist(a.artistId).name}`,
        art: <AlbumCover albumId={id} className="h-full w-full" />,
      };
    }),
    ...FOLLOWED_ARTIST_IDS.map<Item>((id) => ({
      key: `artist-${id}`,
      type: "artists",
      route: { kind: "artist", id },
      title: getArtist(id).name,
      sub: "Artist",
      art: <ArtistAvatar artistId={id} albumId={artistAlbums(id)[0].id} className="h-full w-full text-[16px]" />,
      round: true,
    })),
  ];
  // interleave types for the "all" view so it reads like recents
  const all = filter ? items.filter((i) => i.type === filter) : interleave(items);
  const showLiked = filter === null || filter === "playlists";

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5" style={{ paddingTop: "calc(var(--safe-top) + 14px)" }}>
        <h1 className="wv-display text-[30px] font-bold tracking-[-0.035em]" style={{ color: C.text }}>
          Your Library
        </h1>
        <div className="mt-3 flex items-center gap-2 pb-3" role="tablist" aria-label="Filter library">
          <AnimatePresence initial={false}>
            {filter && (
              <motion.button
                key="clear"
                type="button"
                initial={{ opacity: 0, scale: 0.6, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 32 }}
                exit={{ opacity: 0, scale: 0.6, width: 0 }}
                transition={SPRING}
                onClick={() => setFilter(null)}
                aria-label="Clear filter"
                className="grid h-8 shrink-0 place-items-center rounded-full"
                style={{ background: C.raised, color: C.text }}
              >
                <X className="h-4 w-4" strokeWidth={STROKE} />
              </motion.button>
            )}
          </AnimatePresence>
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <motion.button
                layout
                transition={SPRING}
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(on ? null : f.id)}
                className="relative h-8 rounded-full px-3.5 text-[13.5px] font-semibold"
                style={{ color: on ? "var(--pal-ink)" : C.text, background: on ? "transparent" : C.raised }}
              >
                {on && <motion.span layoutId="wv-chip" transition={SPRING} className="absolute inset-0 rounded-full" style={{ background: "var(--pal-accent)" }} />}
                <span className="relative">{f.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="wv-noscroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(var(--safe-bottom)+150px)]">
        {showLiked && (
          <button
            type="button"
            onClick={() => nav.push({ kind: "liked", id: "liked" })}
            className="flex w-full items-center gap-3 px-5 py-2 text-left active:bg-white/[0.04]"
          >
            <LikedCover className="h-14 w-14 shrink-0 rounded-md" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-medium" style={{ color: C.text }}>
                Liked Songs
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[13px]" style={{ color: C.muted }}>
                <Pin className="h-3 w-3 rotate-45" strokeWidth={STROKE} style={{ color: LIKED_PALETTE.accent }} />
                Playlist ·{" "}
                <motion.span key={state.liked.length} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="tabular-nums">
                  {state.liked.length}
                </motion.span>{" "}
                songs
              </span>
            </span>
          </button>
        )}

        <AnimatePresence initial={false} mode="popLayout">
          {all.map((it) => (
            <motion.button
              layout
              key={it.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              type="button"
              onClick={() => nav.push(it.route)}
              className="flex w-full items-center gap-3 px-5 py-2 text-left active:bg-white/[0.04]"
            >
              <span className={`block h-14 w-14 shrink-0 overflow-hidden ${it.round ? "rounded-full" : "rounded-md"}`}>{it.art}</span>
              <span className="min-w-0">
                <span className="block truncate text-[15.5px] font-medium" style={{ color: C.text }}>
                  {it.title}
                </span>
                <span className="mt-0.5 block truncate text-[13px]" style={{ color: C.muted }}>
                  {it.sub}
                </span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {showLiked && (
          <section className="mt-7">
            <div className="mb-1 flex items-baseline justify-between px-5">
              <h2 className="wv-display text-[19px] font-bold tracking-[-0.03em]" style={{ color: C.text }}>
                Recently liked
              </h2>
              {state.liked.length > 0 && (
                <button type="button" onClick={() => nav.push({ kind: "liked", id: "liked" })} className="text-[13px] font-semibold" style={{ color: C.muted }}>
                  See all
                </button>
              )}
            </div>
            {state.liked.length === 0 ? (
              <p className="px-5 py-3 text-[13.5px]" style={{ color: C.muted }}>
                Tap the heart in the player and the song lands here.
              </p>
            ) : (
              <AnimatePresence initial={false}>
                {state.liked.slice(0, 4).map((id) => (
                  <motion.div key={id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={SPRING}>
                    <TrackRow
                      track={getTrack(id)}
                      lead="cover"
                      active={current.id === id}
                      playing={state.playing}
                      liked={false}
                      accent={LIKED_PALETTE.accent}
                      onPlay={() => (current.id === id ? nav.openPlayer() : playList(state.liked, state.liked.indexOf(id), "Liked Songs"))}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function interleave(items: Item[]) {
  const groups: Record<Filter, Item[]> = { playlists: [], albums: [], artists: [] };
  for (const i of items) groups[i.type].push(i);
  const out: Item[] = [];
  const max = Math.max(groups.playlists.length, groups.albums.length, groups.artists.length);
  for (let n = 0; n < max; n++) {
    for (const g of [groups.albums, groups.playlists, groups.artists]) if (g[n]) out.push(g[n]);
  }
  return out;
}
