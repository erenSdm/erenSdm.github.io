import { memo, useId } from "react";
import { Heart } from "lucide-react";
import { getAlbum, getArtist, getMix, getTrack, peaks, type Album, type Mix } from "./data";

/**
 * Generative album covers. Drawn from the album's own palette so the player
 * tint always matches the artwork exactly.
 */

function hash(seed: string) {
  return peaks(seed, 36);
}

function Motif({ album, uid }: { album: Album; uid: string }) {
  const { deep, mid, accent, ink } = album.palette;
  const r = hash(album.id);

  switch (album.motif) {
    case "horizon":
      return (
        <>
          <defs>
            <linearGradient id={`${uid}s`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={deep} />
              <stop offset="1" stopColor={mid} />
            </linearGradient>
          </defs>
          <rect width="100" height="62" fill={`url(#${uid}s)`} />
          <circle cx="50" cy="62" r="19" fill={accent} />
          <rect y="62" width="100" height="38" fill={deep} />
          {Array.from({ length: 9 }, (_, i) => {
            const w = 38 - i * 3.6;
            return (
              <rect key={i} x={50 - w / 2 + (r[i] - 0.5) * 6} y={65 + i * 3.8} width={w} height="1.3" rx="0.65" fill={accent} opacity={0.75 - i * 0.07} />
            );
          })}
        </>
      );
    case "sun":
      return (
        <>
          <rect width="100" height="100" fill={mid} />
          <circle cx="50" cy="70" r="36" fill={accent} />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} y={58 + i * 7} width="100" height={1.2 + i * 0.9} fill={mid} />
          ))}
          <rect y="88" width="100" height="12" fill={deep} />
          <circle cx="82" cy="18" r="3" fill={accent} opacity="0.8" />
        </>
      );
    case "grid":
      return (
        <>
          <rect width="100" height="100" fill={deep} />
          {Array.from({ length: 25 }, (_, i) => {
            const x = 7 + (i % 5) * 18;
            const y = 7 + Math.floor(i / 5) * 18;
            const v = r[i];
            if (v > 0.72) return <rect key={i} x={x} y={y} width="14" height="14" rx="3.5" fill={accent} />;
            if (v > 0.48) return <rect key={i} x={x} y={y} width="14" height="14" rx="3.5" fill={mid} />;
            return <rect key={i} x={x + 0.5} y={y + 0.5} width="13" height="13" rx="3" fill="none" stroke={mid} strokeWidth="1" />;
          })}
        </>
      );
    case "stripes":
      return (
        <>
          <defs>
            <pattern id={`${uid}p`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
              <rect width="4.2" height="9" fill={mid} />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={deep} />
          <rect width="100" height="100" fill={`url(#${uid}p)`} opacity="0.55" />
          <rect y="57" width="100" height="13" fill={accent} />
          <rect y="70" width="100" height="30" fill={deep} />
          <circle cx="80" cy="63.5" r="3.4" fill={ink} />
          <circle cx="16" cy="20" r="5" fill={accent} />
        </>
      );
    case "rings":
      return (
        <>
          <rect width="100" height="100" fill={deep} />
          {Array.from({ length: 11 }, (_, i) => (
            <circle key={i} cx="68" cy="70" r={10 + i * 8.5} fill="none" stroke={i % 3 === 0 ? accent : mid} strokeWidth={i % 3 === 0 ? 1.6 : 3.2} opacity={1 - i * 0.06} />
          ))}
          <circle cx="68" cy="70" r="7" fill={accent} />
        </>
      );
    case "rain":
      return (
        <>
          <defs>
            <linearGradient id={`${uid}r`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={deep} />
              <stop offset="1" stopColor={mid} />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill={`url(#${uid}r)`} />
          {Array.from({ length: 19 }, (_, i) => {
            const y = 4 + r[i] * 40;
            const len = 14 + r[i + 12] * 34;
            return <line key={i} x1={5 + i * 5} x2={5 + i * 5} y1={y} y2={y + len} stroke={accent} strokeWidth="1" strokeLinecap="round" opacity={0.35 + r[i + 5] * 0.6} />;
          })}
          <ellipse cx="50" cy="88" rx="30" ry="3.5" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.7" />
          <ellipse cx="50" cy="88" rx="16" ry="1.8" fill="none" stroke={accent} strokeWidth="0.8" />
        </>
      );
    case "blocks":
      return (
        <>
          <rect width="100" height="100" fill={mid} />
          <rect width="46" height="100" fill={deep} />
          <path d="M46 8 A46 46 0 0 1 92 54 L46 54 Z" fill={accent} />
          <rect x="46" y="54" width="30" height="30" fill={deep} opacity="0.55" />
          <circle cx="23" cy="74" r="12" fill={mid} />
          <rect x="12" y="16" width="22" height="3" fill={accent} />
        </>
      );
    case "type": {
      const word = album.title.split(/\s+/).pop() ?? album.title;
      return (
        <>
          <rect width="100" height="100" fill={deep} />
          <rect x="0" y="0" width="100" height="44" fill={mid} />
          <text x="-3" y="88" fontSize="54" fontWeight="800" fill={accent} style={{ fontFamily: "var(--wv-display)", letterSpacing: "-0.06em" }}>
            {word.slice(0, 4).toLocaleLowerCase("tr")}
          </text>
          <text x="7" y="15" fontSize="5.4" fontWeight="600" fill={accent} style={{ fontFamily: "var(--wv-body)", letterSpacing: "0.12em" }}>
            {getArtist(album.artistId).name.toLocaleUpperCase("tr")}
          </text>
        </>
      );
    }
    case "arcs":
      return (
        <>
          <rect width="100" height="100" fill={deep} />
          {[46, 37, 28, 19, 10].map((rad, i) => (
            <path key={rad} d={`M${50 - rad} 92 A${rad} ${rad} 0 0 1 ${50 + rad} 92 Z`} fill={i % 2 === 0 ? mid : i === 1 ? accent : deep} />
          ))}
          <rect y="92" width="100" height="8" fill={accent} />
        </>
      );
    case "dots":
      return (
        <>
          <rect width="100" height="100" fill={deep} />
          {Array.from({ length: 100 }, (_, i) => {
            const cx = 5 + (i % 10) * 10;
            const cy = 5 + Math.floor(i / 10) * 10;
            const d = Math.hypot(cx - 22, cy - 78) / 100;
            const rad = Math.max(0.4, 4.3 - d * 5.2);
            return <circle key={i} cx={cx} cy={cy} r={rad} fill={d < 0.42 ? accent : mid} />;
          })}
        </>
      );
  }
}

export const AlbumCover = memo(function AlbumCover({
  albumId,
  className,
}: {
  albumId: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const album = getAlbum(albumId);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={`${album.title} cover`}>
      <Motif album={album} uid={uid} />
    </svg>
  );
});

/** Editorial WAVES mixes blend two palettes; your own playlists tile four covers. */
export const MixCover = memo(function MixCover({ mixId, className }: { mixId: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const mix: Mix = getMix(mixId);

  if (mix.owner === "you") {
    const covers = mix.trackIds.slice(0, 4).map((id) => getTrack(id).albumId);
    return (
      <div className={`grid grid-cols-2 grid-rows-2 overflow-hidden ${className ?? ""}`} role="img" aria-label={`${mix.title} cover`}>
        {covers.map((albumId, i) => (
          <AlbumCover key={i} albumId={albumId} className="h-full w-full" />
        ))}
      </div>
    );
  }

  const a = getAlbum(mix.paletteFrom[0]).palette;
  const b = getAlbum(mix.paletteFrom[1]).palette;
  const words = mix.title.split(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`${mix.title} cover`}>
      <defs>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a.mid} />
          <stop offset="1" stopColor={b.deep} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${uid}g)`} />
      <circle cx="74" cy="28" r="22" fill={a.accent} />
      <circle cx="88" cy="44" r="16" fill={b.accent} opacity="0.9" />
      <text x="8" y="12" fontSize="5" fontWeight="700" fill="#fff" opacity="0.85" style={{ fontFamily: "var(--wv-body)", letterSpacing: "0.16em" }}>
        WAVES MIX
      </text>
      {words.map((w, i) => (
        <text key={i} x="7" y={92 - (words.length - 1 - i) * 15} fontSize="16" fontWeight="800" fill="#fff" style={{ fontFamily: "var(--wv-display)", letterSpacing: "-0.04em" }}>
          {w}
        </text>
      ))}
    </svg>
  );
});

export function LikedCover({ className }: { className?: string }) {
  return (
    <div
      className={`grid place-items-center ${className ?? ""}`}
      style={{ background: "linear-gradient(140deg,#F4D3B0 0%,#E07A5F 55%,#7A2E22 100%)" }}
      role="img"
      aria-label="Liked songs cover"
    >
      <Heart className="h-[38%] w-[38%]" fill="#2B100A" stroke="#2B100A" strokeWidth={1.75} />
    </div>
  );
}

export function CollectionCover({ kind, id, className }: { kind: "album" | "mix" | "liked"; id: string; className?: string }) {
  if (kind === "album") return <AlbumCover albumId={id} className={className} />;
  if (kind === "mix") return <MixCover mixId={id} className={className} />;
  return <LikedCover className={className} />;
}

/** Artist portrait stand-in: their latest cover cropped into a circle with initials. */
export function ArtistAvatar({ artistId, albumId, className }: { artistId: string; albumId: string; className?: string }) {
  const artist = getArtist(artistId);
  const pal = getAlbum(albumId).palette;
  const initials = artist.name
    .replace(/^The /, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÇĞİÖŞÜçğıöşü]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className={`relative overflow-hidden rounded-full ${className ?? ""}`}>
      <AlbumCover albumId={albumId} className="absolute inset-0 h-full w-full scale-150" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 40%, transparent 30%, ${pal.deep}cc 100%)` }} />
      <span
        className="absolute inset-0 grid place-items-center text-[1.35em] font-extrabold tracking-[-0.04em]"
        style={{ color: "#fff", fontFamily: "var(--wv-display)", textShadow: `0 1px 12px ${pal.deep}` }}
      >
        {initials}
      </span>
    </div>
  );
}
