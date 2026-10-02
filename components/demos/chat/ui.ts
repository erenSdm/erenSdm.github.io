import type { CSSProperties } from "react";
import type { Transition } from "framer-motion";
import type { DeliveryStatus } from "./data";

/**
 * RELAY design tokens. Cool paper neutrals, ink text, one cobalt accent.
 * Exposed as CSS custom properties on the app root and consumed with the
 * Tailwind v4 `bg-(--token)` shorthand.
 */
export const TOKENS = {
  "--paper": "#F3F5F8",
  "--surface": "#FFFFFF",
  "--sunk": "#EAEEF3",
  "--ink": "#10141F",
  "--ink-2": "#5B6474",
  "--line": "#E2E6EC",
  "--accent": "#2F62E6",
  "--accent-press": "#2553CC",
  "--accent-soft": "#E7EEFD",
  "--online": "#16A06F",
  "--danger": "#D63B32",
} as const;

export const TOKEN_STYLE = TOKENS as unknown as CSSProperties;

export const SPRING: Transition = { type: "spring", stiffness: 420, damping: 34 };
export const PUSH: Transition = { type: "spring", stiffness: 330, damping: 36, mass: 0.9 };
export const SOFT: Transition = { type: "spring", stiffness: 140, damping: 22 };
export const FADE: Transition = { duration: 0.18 };

/** tactile press used on every tappable control */
export const PRESS =
  "transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.96]";

export const ICON = { strokeWidth: 1.75 } as const;

export type TextSize = "Small" | "Default" | "Large";

export interface Prefs {
  readReceipts: boolean;
  quickReplies: boolean;
  enterToSend: boolean;
  previews: boolean;
  textSize: TextSize;
}

export const DEFAULT_PREFS: Prefs = {
  readReceipts: true,
  quickReplies: true,
  enterToSend: true,
  previews: true,
  textSize: "Default",
};

export const TEXT_SIZE_CLASS: Record<TextSize, string> = {
  Small: "text-[14px]",
  Default: "text-[15.5px]",
  Large: "text-[17px]",
};

const RANK: Record<DeliveryStatus, number> = { sending: 0, sent: 1, delivered: 2, read: 3 };

/** with read receipts off, you neither send nor see them */
export function visibleStatus(status: DeliveryStatus, receipts: boolean): DeliveryStatus {
  if (!receipts && RANK[status] > RANK.delivered) return "delivered";
  return status;
}

export function advance(current: DeliveryStatus | undefined, next: DeliveryStatus): DeliveryStatus {
  if (!current) return next;
  return RANK[next] > RANK[current] ? next : current;
}
