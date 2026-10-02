import {
  albumTracks,
  formatTotal,
  getAlbum,
  getArtist,
  getMix,
  getTrack,
  mixArtists,
  type Palette,
} from "./data";

export const LIKED_PALETTE: Palette = { deep: "#3A1810", mid: "#A0452F", accent: "#F4C7A1", ink: "#2B100A" };

export interface Collection {
  kind: "album" | "mix" | "liked";
  id: string;
  eyebrow: string;
  title: string;
  /** artist id for albums (tappable byline) */
  artistId?: string;
  byline: string;
  meta: string;
  description?: string;
  trackIds: string[];
  palette: Palette;
}

export function getCollection(kind: Collection["kind"], id: string, liked: string[]): Collection {
  if (kind === "album") {
    const album = getAlbum(id);
    const ids = albumTracks(id).map((t) => t.id);
    const total = ids.reduce((s, t) => s + getTrack(t).duration, 0);
    return {
      kind,
      id,
      eyebrow: `${album.kind} · ${album.genre}`,
      title: album.title,
      artistId: album.artistId,
      byline: getArtist(album.artistId).name,
      meta: `${album.year} · ${ids.length} songs, ${formatTotal(total)}`,
      trackIds: ids,
      palette: album.palette,
    };
  }
  if (kind === "mix") {
    const mix = getMix(id);
    const total = mix.trackIds.reduce((s, t) => s + getTrack(t).duration, 0);
    const names = mixArtists(mix);
    return {
      kind,
      id,
      eyebrow: mix.owner === "you" ? "Playlist" : "Made for you",
      title: mix.title,
      byline: mix.owner === "you" ? "By you" : `${names.slice(0, 2).join(", ")} and more`,
      meta: `${mix.trackIds.length} songs, ${formatTotal(total)}`,
      description: mix.description,
      trackIds: mix.trackIds,
      palette: getAlbum(mix.paletteFrom[0]).palette,
    };
  }
  const total = liked.reduce((s, t) => s + getTrack(t).duration, 0);
  return {
    kind,
    id: "liked",
    eyebrow: "Playlist",
    title: "Liked Songs",
    byline: "Saved from the player",
    meta: liked.length ? `${liked.length} songs, ${formatTotal(total)}` : "No songs yet",
    trackIds: liked,
    palette: LIKED_PALETTE,
  };
}
