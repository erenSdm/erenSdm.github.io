"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { mono } from "./primitives";

/* ------------------------------------------------------------------ *
 * Live "npx create-cobalt" terminal.
 * Types the command char-by-char, then reveals output lines.
 * Fully reduced-motion safe (renders final state instantly).
 * ------------------------------------------------------------------ */

const COMMAND = "npx create-cobalt@latest edge-api";

type OutLine = { text: string; tone?: "dim" | "cyan" | "green" | "paper" };

const OUTPUT: OutLine[] = [
  { text: "◇  Scaffolding project in ./edge-api", tone: "dim" },
  { text: "◇  Installing dependencies · cobalt@4.2.0", tone: "dim" },
  { text: "✔  Linked to project cbt_9f3a2 (iad1)", tone: "green" },
  { text: "✔  Edge runtime provisioned in 3 regions", tone: "green" },
  { text: "→  Deploy live at https://edge-api.cobalt.sh", tone: "cyan" },
];

const toneClass: Record<NonNullable<OutLine["tone"]>, string> = {
  dim: "text-ash",
  cyan: "text-[#22d3ee]",
  green: "text-[#86efac]",
  paper: "text-paper",
};

export function Terminal({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState("");
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    if (reduced) {
      setTyped(COMMAND);
      setVisibleLines(OUTPUT.length);
      setDone(true);
      return;
    }

    const push = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    let t = 500;
    // type the command
    for (let i = 1; i <= COMMAND.length; i++) {
      push(() => setTyped(COMMAND.slice(0, i)), t);
      t += 45;
    }
    // reveal output lines
    t += 350;
    for (let i = 1; i <= OUTPUT.length; i++) {
      push(() => setVisibleLines(i), t);
      t += 480;
    }
    push(() => setDone(true), t);

    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
      timers.current = [];
    };
  }, [reduced]);

  const typingActive = typed.length < COMMAND.length;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-[#0a0a0b] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-line bg-[#0c0c0e] px-3.5 py-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2a]" />
          </span>
          <span className={`${mono} text-[11px] text-dim`}>zsh — cobalt</span>
        </div>
        <span className={`${mono} text-[10px] uppercase tracking-[0.18em] text-dim`}>
          bash
        </span>
      </div>

      <div className={`${mono} px-4 py-3.5 text-[12.5px] leading-[1.85]`}>
        <div className="flex items-start">
          <span className="mr-2 select-none text-[#22d3ee]">$</span>
          <span className="text-paper">
            {typed}
            {typingActive && (
              <span className="ml-0.5 inline-block h-[15px] w-[7px] translate-y-[2px] animate-blink bg-[#22d3ee]" />
            )}
          </span>
        </div>

        <div className="mt-1 space-y-0.5">
          {OUTPUT.slice(0, visibleLines).map((l, i) => (
            <div key={i} className={toneClass[l.tone ?? "paper"]}>
              {l.text}
            </div>
          ))}
        </div>

        {done && (
          <div className="mt-1 flex items-center">
            <span className="mr-2 select-none text-[#22d3ee]">$</span>
            <span className="inline-block h-[15px] w-[7px] translate-y-[2px] animate-blink bg-[#3a3a3a]" />
          </div>
        )}
      </div>
    </div>
  );
}
