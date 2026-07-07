"use client";

import { useEffect, useState } from "react";
import { MAGENTA } from "./ui";

// Deterministic starting offset so SSR and first client render match,
// then it ticks down live on the client.
const START_SECONDS = 2 * 86400 + 14 * 3600 + 22 * 60 + 8;

function split(total: number) {
  const t = Math.max(0, total);
  return {
    d: Math.floor(t / 86400),
    h: Math.floor((t % 86400) / 3600),
    m: Math.floor((t % 3600) / 60),
    s: Math.floor(t % 60),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({ compact = false }: { compact?: boolean }) {
  const [seconds, setSeconds] = useState(START_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 0 ? START_SECONDS : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const { d, h, m, s } = split(seconds);
  const cells: [string, string][] = [
    [pad(d), "DAYS"],
    [pad(h), "HRS"],
    [pad(m), "MIN"],
    [pad(s), "SEC"],
  ];

  return (
    <div className="flex items-stretch">
      {cells.map(([val, unit], i) => (
        <div key={unit} className="flex items-stretch">
          <div
            className={
              compact
                ? "flex min-w-[3.1rem] flex-col items-center"
                : "flex min-w-[4.6rem] flex-col items-center"
            }
          >
            <span
              className={
                compact
                  ? "font-[family-name:var(--font-cad-display)] text-[2rem] leading-none tabular-nums text-paper"
                  : "font-[family-name:var(--font-cad-display)] text-[clamp(2.75rem,4.4vw,4rem)] leading-[0.82] tabular-nums text-paper"
              }
            >
              {val}
            </span>
            <span className="mt-1.5 font-[family-name:var(--font-cad-mono)] text-[9px] uppercase tracking-[0.28em] text-ash">
              {unit}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span
              aria-hidden
              className={
                compact
                  ? "self-start pt-0.5 font-[family-name:var(--font-cad-display)] text-[2rem] leading-none"
                  : "self-start font-[family-name:var(--font-cad-display)] text-[clamp(2.75rem,4.4vw,4rem)] leading-[0.82]"
              }
              style={{ color: MAGENTA }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
