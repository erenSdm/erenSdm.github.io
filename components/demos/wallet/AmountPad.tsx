"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Delete } from "lucide-react";
import { useEffect } from "react";
import { CURRENCY_META, type Currency } from "./data";
import { formatInput } from "./format";
import { ICON } from "./ui";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] as const;
type Key = (typeof KEYS)[number];

/** Apply one keypad press to the raw amount string ("1250.5"). */
export function pressKey(raw: string, key: Key): string {
  if (key === "back") return raw.slice(0, -1);
  if (key === ".") {
    if (raw.includes(".")) return raw;
    return raw === "" ? "0." : `${raw}.`;
  }
  const [int, dec] = raw.split(".");
  if (dec !== undefined && dec.length >= 2) return raw;
  if (dec === undefined && int.replace(/^0+/, "").length >= 7) return raw;
  if (raw === "0") return key;
  return raw + key;
}

/** Big amount readout. Shakes when `error` becomes truthy. */
export function AmountDisplay({
  raw,
  currency,
  error,
}: {
  raw: string;
  currency: Currency;
  error?: string | null;
}) {
  const controls = useAnimationControls();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (error && !reduce) {
      void controls.start({ x: [0, -9, 8, -5, 3, 0], transition: { duration: 0.38 } });
    }
  }, [error, controls, reduce]);

  const text = formatInput(raw);
  const size = text.length > 9 ? 40 : text.length > 6 ? 48 : 56;
  return (
    <motion.div
      animate={controls}
      aria-live="polite"
      className={`flex items-baseline justify-center font-bold tabular-nums tracking-[-0.04em] ${
        error ? "text-[#BE3A2C]" : raw ? "text-[#12161C]" : "text-[#9AA0AA]"
      }`}
      style={{ fontSize: size, lineHeight: 1.05 }}
    >
      <span className="mr-0.5 opacity-80" style={{ fontSize: size * 0.62 }}>
        {CURRENCY_META[currency].symbol}
      </span>
      {text}
    </motion.div>
  );
}

export function AmountPad({ onKey }: { onKey: (key: Key) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1 px-3" role="group" aria-label="Amount keypad">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onKey(k)}
          aria-label={k === "back" ? "Delete" : k === "." ? "Decimal comma" : k}
          className="grid h-[52px] place-items-center rounded-2xl text-[24px] font-semibold text-[#12161C] transition-colors active:bg-[#EEF0F3]"
        >
          {k === "back" ? <Delete size={24} strokeWidth={ICON} /> : k === "." ? "," : k}
        </button>
      ))}
    </div>
  );
}
