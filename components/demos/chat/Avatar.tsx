import { cn } from "@/lib/utils";
import { AVATAR_TINTS, initials, type Person } from "./data";

/**
 * Monogram avatar on a tinted disc. Groups render the first two members as an
 * overlapping pair. A presence dot sits on the lower-right edge.
 */
export function Avatar({
  name,
  tint,
  size = 52,
  online = false,
  members,
  className,
}: {
  name: string;
  tint: number;
  size?: number;
  online?: boolean;
  members?: Person[];
  className?: string;
}) {
  if (members && members.length >= 2) {
    const small = Math.round(size * 0.68);
    return (
      <span
        className={cn("relative inline-block shrink-0", className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <Disc name={members[0].name} tint={members[0].tint} size={small} className="absolute left-0 top-0" />
        <Disc
          name={members[1].name}
          tint={members[1].tint}
          size={small}
          className="absolute bottom-0 right-0 ring-[2.5px] ring-(--surface)"
        />
      </span>
    );
  }

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Disc name={name} tint={tint} size={size} />
      {online && (
        <span
          className="absolute rounded-full bg-(--online) ring-[2.5px] ring-(--surface)"
          style={{
            width: Math.max(9, size * 0.24),
            height: Math.max(9, size * 0.24),
            right: size * 0.02,
            bottom: size * 0.02,
          }}
        />
      )}
    </span>
  );
}

function Disc({
  name,
  tint,
  size,
  className,
}: {
  name: string;
  tint: number;
  size: number;
  className?: string;
}) {
  const t = AVATAR_TINTS[tint % AVATAR_TINTS.length];
  return (
    <span
      className={cn("grid place-items-center rounded-full font-semibold tracking-[-0.02em]", className)}
      style={{ width: size, height: size, background: t.bg, color: t.fg, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}
