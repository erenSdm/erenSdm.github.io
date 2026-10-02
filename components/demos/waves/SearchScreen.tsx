"use client";

import { useDeferredValue, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { AlbumCover, ArtistAvatar } from "./Cover";
import { ALBUMS, ARTISTS, GENRES, TRACKS, artistAlbums, getAlbum, getArtist, normalize } from "./data";
import { usePlayer } from "./player";
import { C, Pressable, STROKE, TrackRow, useNav } from "./ui";

const index = {
  tracks: TRACKS.map((t) => ({
    item: t,
    hay: normalize(`${t.title} ${getArtist(t.artistId).name} ${getAlbum(t.albumId).title} ${getAlbum(t.albumId).genre}`),
  })),
  artists: ARTISTS.map((a) => ({ item: a, hay: normalize(`${a.name} ${a.origin}`) })),
  albums: ALBUMS.map((a) => ({ item: a, hay: normalize(`${a.title} ${getArtist(a.artistId).name} ${a.genre}`) })),
};

function matches<T>(list: { item: T; hay: string }[], tokens: string[]) {
  return list.filter((e) => tokens.every((tok) => e.hay.includes(tok))).map((e) => e.item);
}

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, current, playList } = usePlayer();
  const nav = useNav();

  const results = useMemo(() => {
    const tokens = normalize(deferred).split(" ").filter(Boolean);
    if (!tokens.length) return null;
    return {
      tracks: matches(index.tracks, tokens).slice(0, 8),
      artists: matches(index.artists, tokens),
      albums: matches(index.albums, tokens),
    };
  }, [deferred]);

  const total = results ? results.tracks.length + results.artists.length + results.albums.length : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5 pb-3" style={{ paddingTop: "calc(var(--safe-top) + 14px)" }}>
        <h1 className="wv-display text-[30px] font-bold tracking-[-0.035em]" style={{ color: C.text }}>
          Search
        </h1>
        <label className="mt-3 flex h-11 items-center gap-2.5 rounded-xl px-3.5" style={{ background: C.raised }}>
          <Search className="h-[18px] w-[18px] shrink-0" strokeWidth={STROKE} style={{ color: C.muted }} />
          <span className="sr-only">Search songs, artists and albums</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Songs, artists, albums"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#7d7770]"
            style={{ color: C.text }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="grid h-6 w-6 place-items-center rounded-full"
              style={{ background: C.faint, color: C.bg }}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.25} />
            </button>
          )}
        </label>
      </div>

      <div className="wv-noscroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(var(--safe-bottom)+150px)]">
        <AnimatePresence mode="wait" initial={false}>
          {!results ? (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <p className="px-5 pb-3 pt-2 text-[15px] font-semibold" style={{ color: C.text }}>
                Browse genres
              </p>
              <div className="grid grid-cols-2 gap-2.5 px-5">
                {GENRES.map((g) => {
                  const pal = getAlbum(g.albumId).palette;
                  return (
                    <Pressable
                      key={g.name}
                      onClick={() => setQuery(g.name)}
                      className="relative h-[92px] overflow-hidden rounded-xl p-3"
                      style={{ background: pal.mid }}
                    >
                      <span className="wv-display relative z-10 block max-w-[70%] text-[17px] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                        {g.name}
                      </span>
                      <AlbumCover
                        albumId={g.albumId}
                        className="absolute -bottom-2 -right-3 h-[66px] w-[66px] rotate-[22deg] rounded-md shadow-[0_8px_18px_-6px_rgba(0,0,0,0.55)]"
                      />
                    </Pressable>
                  );
                })}
              </div>
            </motion.div>
          ) : total === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-8 pt-16 text-center"
            >
              <SearchX className="mx-auto h-9 w-9" strokeWidth={STROKE} style={{ color: C.faint }} />
              <p className="mt-4 text-[17px] font-semibold" style={{ color: C.text }}>
                No results for &ldquo;{deferred.trim()}&rdquo;
              </p>
              <p className="mt-1.5 text-[14px] leading-snug" style={{ color: C.muted }}>
                Check the spelling, or search for an artist, album or song title instead.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-5 h-9 rounded-full px-4 text-[13.5px] font-semibold transition active:scale-95"
                style={{ background: C.raised, color: C.text }}
              >
                Browse genres
              </button>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {results.artists.length > 0 && (
                <section className="pt-2">
                  <GroupLabel>Artists</GroupLabel>
                  <div className="wv-noscroll flex gap-4 overflow-x-auto px-5 pb-2">
                    {results.artists.map((a) => (
                      <Pressable key={a.id} onClick={() => nav.push({ kind: "artist", id: a.id })} className="w-[84px] shrink-0 text-center">
                        <ArtistAvatar artistId={a.id} albumId={artistAlbums(a.id)[0].id} className="h-[84px] w-[84px] text-[20px]" />
                        <span className="mt-2 block truncate text-[13px] font-semibold" style={{ color: C.text }}>
                          {a.name}
                        </span>
                      </Pressable>
                    ))}
                  </div>
                </section>
              )}

              {results.tracks.length > 0 && (
                <section className="pt-4">
                  <GroupLabel>Songs</GroupLabel>
                  {results.tracks.map((tr) => {
                    const album = getAlbum(tr.albumId);
                    const albumIds = TRACKS.filter((x) => x.albumId === tr.albumId).map((x) => x.id);
                    return (
                      <TrackRow
                        key={tr.id}
                        track={tr}
                        lead="cover"
                        active={current.id === tr.id}
                        playing={state.playing}
                        liked={state.liked.includes(tr.id)}
                        accent={album.palette.accent}
                        onPlay={() =>
                          current.id === tr.id ? nav.openPlayer() : playList(albumIds, albumIds.indexOf(tr.id), album.title)
                        }
                      />
                    );
                  })}
                </section>
              )}

              {results.albums.length > 0 && (
                <section className="pt-4">
                  <GroupLabel>Albums</GroupLabel>
                  {results.albums.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => nav.push({ kind: "album", id: a.id })}
                      className="flex w-full items-center gap-3 px-5 py-2 text-left active:bg-white/[0.04]"
                    >
                      <AlbumCover albumId={a.id} className="h-14 w-14 shrink-0 rounded-md" />
                      <span className="min-w-0">
                        <span className="block truncate text-[15.5px] font-medium" style={{ color: C.text }}>
                          {a.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px]" style={{ color: C.muted }}>
                          {a.kind} · {getArtist(a.artistId).name} · {a.year}
                        </span>
                      </span>
                    </button>
                  ))}
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-5 pb-2 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: C.muted }}>
      {children}
    </p>
  );
}
