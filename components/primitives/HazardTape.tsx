import { cn } from "@/lib/utils";
import { Marquee } from "./Marquee";

interface HazardTapeProps {
  items?: string[];
  className?: string;
  duration?: number;
  reverse?: boolean;
}

/**
 * A thin band of scrolling mono text framed like caution tape.
 * Uses the acid accent as a flat band (no glow).
 */
export function HazardTape({
  items = ["EREN AYDEMİR", "DESIGNER & DEVELOPER", "ISTANBUL", "AVAILABLE FOR WORK"],
  className,
  duration = 28,
  reverse = false,
}: HazardTapeProps) {
  return (
    <div
      className={cn(
        "border-y border-ink bg-acid py-2.5 text-ink",
        className
      )}
    >
      <Marquee
        items={items}
        duration={duration}
        reverse={reverse}
        separator="✳"
        itemClassName="font-mono text-xs font-semibold uppercase tracking-[0.2em]"
        separatorClassName="text-ink/70"
      />
    </div>
  );
}
