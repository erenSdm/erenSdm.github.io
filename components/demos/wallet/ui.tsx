"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import { CATEGORY_META, contactById, type Contact, type Currency, type Txn } from "./data";
import { formatMoney, splitMoney } from "./format";
import { CURRENCY_META } from "./data";

/* ---------------- tokens ---------------- */

export const C = {
  canvas: "#F3F4F6",
  surface: "#FFFFFF",
  ink: "#12161C",
  ink2: "#555D6B",
  ink3: "#727986",
  line: "#E5E7EB",
  accent: "#0A7A5E",
  accentSoft: "#E3F1EC",
  danger: "#BE3A2C",
  warn: "#9A5B06",
} as const;

export const ICON = 1.75;

export const spring = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 } as const;
export const softSpring = { type: "spring", stiffness: 140, damping: 22 } as const;

/* ---------------- animated money ---------------- */

export function useAnimatedNumber(target: number, from = target, duration = 0.9) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(from);
  const [value, setValue] = useState(from);
  useMotionValueEvent(mv, "change", (v) => setValue(v));
  useEffect(() => {
    if (reduce) {
      mv.jump(target);
      return;
    }
    const controls = animate(mv, target, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [mv, target, duration, reduce]);
  return reduce ? target : value;
}

/** Large money figure with smaller, muted decimals. */
export function MoneyFigure({
  value,
  currency,
  className = "",
  decClassName = "",
}: {
  value: number;
  currency: Currency;
  className?: string;
  decClassName?: string;
}) {
  const { int, dec } = splitMoney(value);
  return (
    <span className={`tabular-nums ${className}`}>
      {value < 0 ? "−" : ""}
      {CURRENCY_META[currency].symbol}
      {int}
      <span className={decClassName}>,{dec}</span>
    </span>
  );
}

/* ---------------- avatars + tiles ---------------- */

export function ContactAvatar({ contact, size = 44 }: { contact: Contact; size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: contact.tint,
        color: contact.ink,
        fontSize: size * 0.34,
        letterSpacing: "0.01em",
      }}
    >
      {contact.initials}
    </span>
  );
}

export function TxnTile({ txn, size = 42 }: { txn: Txn; size?: number }) {
  const contact = txn.contactId ? contactById(txn.contactId) : undefined;
  if (contact) return <ContactAvatar contact={contact} size={size} />;
  const meta = CATEGORY_META[txn.category];
  const Icon = meta.icon;
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-[14px]"
      style={{ width: size, height: size, background: meta.bg, color: meta.fg }}
    >
      <Icon size={size * 0.44} strokeWidth={ICON} />
    </span>
  );
}

export function TxnRow({ txn, onClick, hidden }: { txn: Txn; onClick: () => void; hidden?: boolean }) {
  const incoming = txn.amount > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors active:bg-[#F0F1F4]"
    >
      <TxnTile txn={txn} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-[#12161C]">{txn.merchant}</span>
        <span className="block truncate text-[13px] text-[#555D6B]">
          {CATEGORY_META[txn.category].label} · {txn.time}
          {txn.status === "Pending" ? " · Pending" : ""}
        </span>
      </span>
      <span
        className={`shrink-0 text-[15px] font-semibold tabular-nums ${
          incoming ? "text-[#0A7A5E]" : "text-[#12161C]"
        }`}
      >
        {hidden ? "••••" : formatMoney(txn.amount, txn.currency, { sign: incoming })}
      </span>
    </button>
  );
}

/* ---------------- controls ---------------- */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A7A5E] ${
        checked ? "bg-[#0A7A5E]" : "bg-[#D6D9DF]"
      }`}
    >
      <motion.span
        layout
        transition={spring}
        className="absolute top-[3px] h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(18,22,28,0.25)]"
        style={{ left: checked ? 23 : 3 }}
      />
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "accent" | "ink" | "quiet";
  className?: string;
}) {
  const tones = {
    accent: "bg-[#0A7A5E] text-white disabled:bg-[#C9CDD3] disabled:text-[#555D6B]",
    ink: "bg-[#12161C] text-white disabled:bg-[#C9CDD3] disabled:text-[#555D6B]",
    quiet: "bg-[#EEF0F3] text-[#12161C]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] text-[16px] font-semibold transition-[transform,background-color] duration-150 active:scale-[0.98] disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A7A5E] ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------- bottom sheet ---------------- */

export function Sheet({
  label,
  onClose,
  children,
  tall = false,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  /** fixed 92% height for multi-step flows with a keypad */
  tall?: boolean;
}) {
  const controls = useDragControls();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div className="absolute inset-0 z-40" role="dialog" aria-modal="true" aria-label={label}>
      <motion.div
        className="absolute inset-0 bg-[#12161C]/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />
      <motion.div
        className={`absolute inset-x-0 bottom-0 flex ${tall ? "h-[92%]" : "max-h-[90%]"} flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-12px_40px_-12px_rgba(18,22,28,0.25)]`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.9 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 650) onClose();
        }}
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          className="shrink-0 cursor-grab touch-none pb-1 pt-2.5 active:cursor-grabbing"
        >
          <div className="mx-auto h-[5px] w-10 rounded-full bg-[#D3D6DC]" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col pb-[var(--safe-bottom)]">{children}</div>
      </motion.div>
    </motion.div>
  );
}

export function SheetHeader({
  title,
  onBack,
  onClose,
}: {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 px-4">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full bg-[#F1F2F5] text-[#12161C] active:scale-95"
        >
          <ChevronLeft size={20} strokeWidth={ICON} />
        </button>
      ) : (
        <span className="w-9" />
      )}
      <h2 className="flex-1 text-center text-[16px] font-semibold text-[#12161C]">{title}</h2>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-9 w-9 place-items-center rounded-full bg-[#F1F2F5] text-[#12161C] active:scale-95"
        >
          <X size={18} strokeWidth={ICON} />
        </button>
      ) : (
        <span className="w-9" />
      )}
    </div>
  );
}

/** Animated check mark for success states. */
export function SuccessMark() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#0A7A5E]"
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="white"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </motion.div>
  );
}
