"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING } from "./ui";

export function TypingIndicator({ label, className }: { label: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={SPRING}
      className={cn("flex origin-bottom-left justify-start", className)}
      role="status"
      aria-label={label}
    >
      <div className="flex h-[38px] items-center gap-[5px] rounded-[20px] rounded-bl-[6px] bg-(--surface) px-4 shadow-[0_1px_1.5px_rgba(28,44,82,0.06),0_6px_16px_-10px_rgba(28,44,82,0.22)]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-[7px] rounded-full bg-[#9AA3B2]"
            animate={reduce ? { opacity: 0.8 } : { y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
            transition={reduce ? undefined : { duration: 1, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}
