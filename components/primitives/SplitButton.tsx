import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplitButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** "light" = paper block for dark sections, "dark" = ink block for light ones */
  tone?: "light" | "dark" | "volt";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

const TONES = {
  light: "bg-paper text-carbon hover:bg-white",
  dark: "bg-carbon text-paper hover:bg-graphite",
  volt: "bg-volt text-carbon hover:bg-[#d8ff3d]",
} as const;

/**
 * Two-block CTA: a mono label block plus a separate square arrow block, with
 * a small gap between them. The arrow nudges right on hover.
 */
export function SplitButton({
  children,
  href,
  onClick,
  tone = "light",
  external,
  className,
  ariaLabel,
}: SplitButtonProps) {
  const block = cn(
    "flex h-14 items-center transition-[background-color,transform] duration-200 ease-out group-active:scale-[0.98]",
    TONES[tone]
  );
  const inner = (
    <>
      <span className={cn(block, "ui px-6 md:px-7")}>{children}</span>
      <span className={cn(block, "w-14 justify-center")} aria-hidden>
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </span>
    </>
  );
  const cls = cn(
    "group inline-flex items-stretch gap-1 outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-carbon",
    className
  );

  if (href) {
    if (external || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className={cls}
          aria-label={ariaLabel}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

/** Small mono kicker with the volt signal dot. */
export function Kicker({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <div className={cn("ui flex items-center gap-3 opacity-80", className)}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-volt" />
      {index && <span className="tabular opacity-60">{index}</span>}
      <span>{children}</span>
    </div>
  );
}
