import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
}

/**
 * Seamless horizontal marquee. Renders the sequence twice and translates by
 * -50% so the loop is gapless. GPU-only (transform).
 */
export function Marquee({
  items,
  duration = 32,
  reverse = false,
  separator = "///",
  className,
  itemClassName,
  separatorClassName,
}: MarqueeProps) {
  const sequence = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item, i) => (
        <span key={i} className={cn("flex items-center", itemClassName)}>
          <span className="whitespace-nowrap">{item}</span>
          <span
            className={cn(
              "mx-6 select-none md:mx-10",
              separatorClassName ?? "text-acid"
            )}
          >
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("flex w-full overflow-hidden", className)}
      role="marquee"
    >
      <div
        className="flex min-w-full shrink-0 animate-marquee"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          ["--marquee-duration" as string]: `${duration}s`,
        }}
      >
        {sequence}
        {sequence}
      </div>
    </div>
  );
}
