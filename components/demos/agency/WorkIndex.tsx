"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type Project = {
  client: string;
  title: string;
  year: string;
  disciplines: string;
  seed: string;
};

const THUMB_W = 300;
const THUMB_H = 380;

export function WorkIndex({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - THUMB_W / 2);
    y.set(e.clientY - rect.top - THUMB_H / 2);
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={reduce ? undefined : handleMove}
      onMouseLeave={() => setActive(null)}
    >
      {/* Cursor-following thumbnail (pointer devices only) */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.div
                key={active}
                style={{ x: sx, y: sy, width: THUMB_W, height: THUMB_H }}
                className="absolute left-0 top-0 overflow-hidden"
                initial={{ opacity: 0, scale: 0.86, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={`https://picsum.photos/seed/${projects[active].seed}/${THUMB_W}/${THUMB_H}`}
                  width={THUMB_W}
                  height={THUMB_H}
                  alt={`${projects[active].client} — ${projects[active].title}`}
                  className="h-full w-full object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 ring-1 ring-inset ring-[#FF4D2E]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <ul className="relative z-10">
        {projects.map((p, i) => {
          const isActive = active === i;
          return (
            <li
              key={p.seed}
              className="border-t border-[#26261f] last:border-b"
            >
              <a
                href="#work"
                aria-label={`${p.client} — ${p.title}, ${p.disciplines}, ${p.year}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group relative flex flex-col gap-3 py-6 outline-none transition-colors focus-visible:bg-[#121212] md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-7"
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#7f7f78] transition-colors group-hover:text-[#FF4D2E] group-focus-visible:text-[#FF4D2E]">
                    {p.disciplines}
                  </span>
                </div>

                <span
                  style={{ fontFamily: "var(--font-archivo)" }}
                  className="order-first flex items-center gap-4 text-[clamp(2.25rem,7vw,5.5rem)] uppercase leading-[0.9] tracking-[-0.02em] text-[#F4F4EF] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 md:order-none"
                >
                  <span
                    className="transition-colors duration-300"
                    style={isActive ? { color: "#FF4D2E" } : undefined}
                  >
                    {p.client}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    strokeWidth={1.25}
                    className="hidden h-[0.55em] w-[0.55em] shrink-0 -translate-x-3 text-[#FF4D2E] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:inline-block"
                  />
                </span>

                <div className="flex items-center justify-between gap-6 md:justify-end">
                  <span className="max-w-[22ch] font-grotesk text-sm text-[#7f7f78] md:text-right">
                    {p.title}
                  </span>
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#4a4a45]">
                    {p.year}
                  </span>
                </div>

                {/* Inline thumbnail for touch / small screens */}
                <div className="overflow-hidden lg:hidden">
                  <img
                    src={`https://picsum.photos/seed/${p.seed}/640/280`}
                    width={640}
                    height={280}
                    alt={`${p.client} — ${p.title}`}
                    loading="lazy"
                    className="mt-2 h-40 w-full object-cover opacity-80"
                  />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
