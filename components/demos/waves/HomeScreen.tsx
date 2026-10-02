"use client";

import { useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { AlbumCover, MixCover } from "./Cover";
import {
  FEATURED_RELEASE,
  JUMP_BACK_IN,
  MIXES,
  NEW_RELEASES,
  RECENTLY_PLAYED,
  albumTracks,
  getAlbum,
  getArtist,
  getMix,
  mixArtists,
} from "./data";
import { usePlayer } from "./player";
import { C, Equalizer, Pressable, SectionTitle, Shelf, STROKE, useNav } from "./ui";

const noop = () => () => {};
function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeScreen() {
  const hello = useSyncExternalStore(noop, greeting, () => "Listen now");
  const { state, current, playList, toggle } = usePlayer();
  const nav = useNav();
  const currentAlbum = current.albumId;
  const currentMixPlaying = (mixId: string) => state.context === getMix(mixId).title;

  const featured = getAlbum(FEATURED_RELEASE);
  const featuredTracks = albumTracks(featured.id).map((t) => t.id);
  const featuredActive = currentAlbum === featured.id && state.context === featured.title;

  return (
    <div className="pb-[calc(var(--safe-bottom)+150px)]" style={{ paddingTop: "calc(var(--safe-top) + 14px)" }}>
      <header className="px-5 pb-5">
        <p className="text-[13px] font-medium" style={{ color: C.muted }}>
          Home
        </p>
        <h1 className="wv-display mt-0.5 text-[30px] font-bold leading-[1.05] tracking-[-0.035em]" style={{ color: C.text }}>
          {hello}
        </h1>
      </header>

      {/* Jump back in: dense 2-col tiles */}
      <div className="grid grid-cols-2 gap-2 px-5">
        {JUMP_BACK_IN.map((item) => {
          const isMix = item.type === "mix";
          const title = isMix ? getMix(item.id).title : getAlbum(item.id).title;
          const active = isMix ? currentMixPlaying(item.id) : currentAlbum === item.id;
          return (
            <Pressable
              key={item.id}
              onClick={() => nav.push(isMix ? { kind: "mix", id: item.id } : { kind: "album", id: item.id })}
              className="flex h-[52px] items-center gap-2.5 overflow-hidden rounded-lg pr-2.5"
              style={{ background: C.surface }}
            >
              {isMix ? <MixCover mixId={item.id} className="h-[52px] w-[52px] shrink-0" /> : <AlbumCover albumId={item.id} className="h-[52px] w-[52px] shrink-0" />}
              <span className="line-clamp-2 flex-1 text-[13px] font-semibold leading-tight" style={{ color: C.text }}>
                {title}
              </span>
              {active && <Equalizer playing={state.playing} color="var(--pal-accent)" />}
            </Pressable>
          );
        })}
      </div>

      {/* Featured release: tinted by its own artwork */}
      <section className="mt-8 px-5">
        <div
          className="relative overflow-hidden rounded-[22px] p-4"
          style={{ background: `linear-gradient(135deg, ${featured.palette.mid} 0%, ${featured.palette.deep} 70%)` }}
        >
          <div className="flex gap-4">
            <button type="button" onClick={() => nav.push({ kind: "album", id: featured.id })} className="shrink-0" aria-label={`Open ${featured.title}`}>
              <AlbumCover albumId={featured.id} className="h-[118px] w-[118px] rounded-xl shadow-[0_18px_30px_-14px_rgba(0,0,0,0.6)]" />
            </button>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: featured.palette.accent }}>
                New album
              </span>
              <button type="button" onClick={() => nav.push({ kind: "album", id: featured.id })} className="text-left">
                <span className="wv-display mt-1 block text-[24px] font-bold leading-[1.02] tracking-[-0.035em] text-white">{featured.title}</span>
                <span className="mt-1 block text-[13.5px] text-white/75">{getArtist(featured.artistId).name}</span>
              </button>
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="text-[12px] text-white/60">{featuredTracks.length} songs · Out now</span>
                <button
                  type="button"
                  aria-label={featuredActive && state.playing ? "Pause" : "Play"}
                  onClick={() => (featuredActive ? toggle() : playList(featuredTracks, 0, featured.title))}
                  className="grid h-11 w-11 place-items-center rounded-full transition active:scale-95"
                  style={{ background: featured.palette.accent, color: featured.palette.ink }}
                >
                  {featuredActive && state.playing ? (
                    <Pause className="h-5 w-5" fill="currentColor" strokeWidth={STROKE} />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={STROKE} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-9">
        <SectionTitle>Made for you</SectionTitle>
        <Shelf>
          {MIXES.filter((m) => m.owner === "waves").map((mix) => (
            <Pressable key={mix.id} onClick={() => nav.push({ kind: "mix", id: mix.id })} className="w-[156px] shrink-0 snap-start">
              <MixCover mixId={mix.id} className="h-[156px] w-[156px] rounded-xl" />
              <span className="mt-2 line-clamp-2 block text-[12.5px] leading-snug" style={{ color: C.muted }}>
                {mixArtists(mix).slice(0, 3).join(", ")}
              </span>
            </Pressable>
          ))}
        </Shelf>
      </section>

      <AlbumShelf title="Recently played" ids={RECENTLY_PLAYED} currentAlbum={currentAlbum} playing={state.playing} sub="artist" />
      <AlbumShelf title="New releases" ids={NEW_RELEASES} currentAlbum={currentAlbum} playing={state.playing} sub="kind" />

    </div>
  );
}

function AlbumShelf({
  title,
  ids,
  currentAlbum,
  playing,
  sub,
}: {
  title: string;
  ids: string[];
  currentAlbum: string;
  playing: boolean;
  sub: "artist" | "kind";
}) {
  const nav = useNav();
  return (
    <section className="mt-9">
      <SectionTitle>{title}</SectionTitle>
      <Shelf>
        {ids.map((id) => {
          const album = getAlbum(id);
          const active = currentAlbum === id;
          return (
            <Pressable key={id} onClick={() => nav.push({ kind: "album", id })} className="w-[136px] shrink-0 snap-start">
              <AlbumCover albumId={id} className="h-[136px] w-[136px] rounded-lg" />
              <span className="mt-2 flex items-center gap-1.5">
                {active && <Equalizer playing={playing} color="var(--pal-accent)" />}
                <span className="truncate text-[13.5px] font-semibold" style={{ color: active ? "var(--pal-accent)" : C.text }}>
                  {album.title}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-[12.5px]" style={{ color: C.muted }}>
                {sub === "artist" ? getArtist(album.artistId).name : `${album.kind} · ${getArtist(album.artistId).name}`}
              </span>
            </Pressable>
          );
        })}
      </Shelf>
    </section>
  );
}
