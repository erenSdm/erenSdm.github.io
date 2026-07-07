import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  /** show the acid marker block before the text */
  marker?: boolean;
}

/** Mono telemetry label, e.g. "02 — CAPABILITIES", with an acid marker. */
export function SectionLabel({
  children,
  className,
  marker = true,
}: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {marker && (
        <span aria-hidden className="h-2.5 w-2.5 bg-acid" />
      )}
      <span className="label text-bone">{children}</span>
    </div>
  );
}
