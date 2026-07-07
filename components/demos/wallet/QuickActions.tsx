"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Plus, Split, type LucideIcon } from "lucide-react";

const ACTIONS: { label: string; icon: LucideIcon }[] = [
  { label: "Send", icon: ArrowUpRight },
  { label: "Request", icon: ArrowDownLeft },
  { label: "Top up", icon: Plus },
  { label: "Split", icon: Split },
];

export function QuickActions() {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Quick actions"
      className="mt-6 grid grid-cols-4 gap-2 px-5"
    >
      {ACTIONS.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-3 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2FBF8C]/12 text-[#2FBF8C] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[1px] group-hover:scale-105">
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <span className="text-[11px] font-medium tracking-tight text-white/75">
            {label}
          </span>
        </button>
      ))}
    </motion.section>
  );
}
