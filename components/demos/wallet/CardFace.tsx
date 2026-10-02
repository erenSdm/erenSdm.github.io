"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Snowflake } from "lucide-react";
import type { CardFace as Face, WalletCard } from "./data";
import { ICON } from "./ui";

const FACES: Record<Face, { bg: string; ink: string; sub: string; line: string }> = {
  evergreen: { bg: "#0E3B31", ink: "#F4FAF7", sub: "rgba(244,250,247,0.72)", line: "rgba(255,255,255,0.09)" },
  paper: { bg: "#E6E9ED", ink: "#12161C", sub: "rgba(18,22,28,0.62)", line: "rgba(18,22,28,0.07)" },
  graphite: { bg: "#1D2127", ink: "#F3F4F6", sub: "rgba(243,244,246,0.66)", line: "rgba(255,255,255,0.07)" },
};

function Pattern({ face, line }: { face: Face; line: string }) {
  if (face === "graphite") {
    return (
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="mint-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill={line} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mint-dots)" />
      </svg>
    );
  }
  // concentric contour rings anchored off the bottom-right corner
  const rings = Array.from({ length: 14 }, (_, i) => 26 + i * 17);
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 189" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {rings.map((r) => (
        <circle key={r} cx={face === "paper" ? 40 : 268} cy={face === "paper" ? -10 : 200} r={r} fill="none" stroke={line} strokeWidth="1" />
      ))}
    </svg>
  );
}

function Network({ network, ink }: { network: WalletCard["network"]; ink: string }) {
  if (network === "mastercard") {
    return (
      <svg width="40" height="25" viewBox="0 0 40 25" aria-label="Mastercard">
        <circle cx="14" cy="12.5" r="11" fill="#D9534A" />
        <circle cx="26" cy="12.5" r="11" fill="#E9A23B" fillOpacity="0.9" />
      </svg>
    );
  }
  return (
    <span className="text-[19px] font-extrabold italic tracking-[-0.02em]" style={{ color: ink }} aria-label="Visa">
      VISA
    </span>
  );
}

export function CardFace({ card, revealed }: { card: WalletCard; revealed: boolean }) {
  const f = FACES[card.face];
  const last4 = card.number.slice(-4);
  return (
    <div
      className="relative aspect-[1.586] w-full select-none overflow-hidden rounded-[20px] shadow-[0_18px_36px_-18px_rgba(18,22,28,0.45)] transition-[filter] duration-500"
      style={{ background: f.bg, color: f.ink, filter: card.frozen ? "grayscale(0.85) brightness(1.04)" : "none" }}
    >
      <Pattern face={card.face} line={f.line} />
      {card.face === "paper" && <div className="absolute inset-y-0 right-[22%] w-[3px] bg-[#0A7A5E]/70" aria-hidden />}

      <div className="relative flex h-full flex-col justify-between p-[18px]">
        <div className="flex items-start justify-between">
          <span className="text-[17px] font-extrabold tracking-[-0.03em]">mint</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: f.sub }}>
            {card.kind} · {card.currency}
          </span>
        </div>

        {card.kind === "Physical" ? (
          <div
            aria-hidden
            className="h-[26px] w-[34px] rounded-[6px]"
            style={{
              background:
                card.face === "paper"
                  ? "linear-gradient(135deg,#C9CED6,#AEB4BE)"
                  : "linear-gradient(135deg,#D8CFB2,#B5A97F)",
            }}
          />
        ) : (
          <div className="h-[26px]" />
        )}

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[16px] font-semibold tabular-nums tracking-[0.06em]">
              {revealed ? card.number : `•••• ${last4}`}
            </p>
            <p className="mt-1 text-[11px] font-medium tabular-nums tracking-[0.04em]" style={{ color: f.sub }}>
              {revealed ? `EXP ${card.expiry}   CVV ${card.cvv}` : card.holder}
            </p>
          </div>
          <Network network={card.network} ink={f.ink} />
        </div>
      </div>

      <AnimatePresence>
        {card.frozen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 grid place-items-center bg-[#DCE6EE]/55 backdrop-blur-[3px]"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-semibold text-[#24507F]">
              <Snowflake size={15} strokeWidth={ICON} /> Frozen
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
