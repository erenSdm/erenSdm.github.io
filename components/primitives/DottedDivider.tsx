import { cn } from "@/lib/utils";

interface DottedDividerProps {
  /** optional mono captions pinned to the ends */
  left?: string;
  right?: string;
  className?: string;
}

/** Full-width dotted rule with optional end captions. */
export function DottedDivider({ left, right, className }: DottedDividerProps) {
  return (
    <div className={cn("flex items-center gap-4 py-6", className)}>
      {left && <span className="label shrink-0">{left}</span>}
      <span aria-hidden className="dotted h-[2px] flex-1" />
      {right && <span className="label shrink-0">{right}</span>}
    </div>
  );
}
