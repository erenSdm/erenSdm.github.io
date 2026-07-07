"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  /** solid acid or outlined */
  variant?: "solid" | "outline";
  className?: string;
  icon?: boolean;
  external?: boolean;
}

/**
 * Magnetic CTA with a nested "button-in-button" trailing arrow.
 * Pointer pull uses motion values (never React state) to stay off the render path.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  icon = true,
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });
  const iconX = useTransform(x, (v) => v * 0.4);
  const iconY = useTransform(y, (v) => v * 0.4);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.5);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  const isSolid = variant === "solid";
  const inner = (
    <motion.span
      style={{ x, y }}
      className={cn(
        "group relative inline-flex items-center gap-3 border-2 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 active:scale-[0.98]",
        isSolid
          ? "border-acid bg-acid text-ink hover:bg-acid-deep"
          : "border-paper/25 bg-transparent text-paper hover:border-acid hover:text-acid",
        className
      )}
    >
      <span>{children}</span>
      {icon && (
        <motion.span
          style={{ x: iconX, y: iconY }}
          className={cn(
            "flex h-6 w-6 items-center justify-center border transition-transform duration-300 group-hover:rotate-45",
            isSolid ? "border-ink/30" : "border-current"
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </motion.span>
      )}
    </motion.span>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-block"
    >
      {href ? (
        external ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ) : (
          <Link href={href}>{inner}</Link>
        )
      ) : (
        <button type="button" onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
