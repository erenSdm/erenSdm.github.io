"use client";

import { motion, useReducedMotion } from "framer-motion";

export function TypingIndicator({ name }: { name: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="flex items-start"
      role="status"
      aria-label={`${name} is typing`}
    >
      <div className="flex items-center gap-1.5 rounded-[1.25rem] rounded-bl-md bg-[#16161A] px-4 py-3.5 ring-1 ring-white/[0.04]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-ash"
            animate={reduce ? undefined : { y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.16,
            }}
          />
        ))}
      </div>
    </div>
  );
}
