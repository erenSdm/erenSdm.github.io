"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Copy, Eye, EyeOff, Snowflake } from "lucide-react";
import { useState } from "react";
import { CardFace } from "./CardFace";
import type { CardSettings, WalletCard } from "./data";
import { formatMoney } from "./format";
import { useWallet } from "./store";
import { ICON, Toggle, spring } from "./ui";

const CARD_W = 300;
const GAP = 14;
const STEP = CARD_W + GAP;

function LimitSlider({ card, onChange }: { card: WalletCard; onChange: (v: number) => void }) {
  const step = card.currency === "TRY" ? 500 : 50;
  const pct = (card.limit / card.limitMax) * 100;
  const spentPct = Math.min(100, (card.spent / card.limitMax) * 100);
  return (
    <div className="relative h-11">
      <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-[#E9EBEF]">
        <div className="absolute inset-y-0 left-0 bg-[#0A7A5E]/25" style={{ width: `${pct}%` }} />
        <div className="absolute inset-y-0 left-0 bg-[#0A7A5E]" style={{ width: `${Math.min(spentPct, pct)}%` }} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E5E7EB] bg-white shadow-[0_2px_6px_rgba(18,22,28,0.18)]"
        style={{ left: `clamp(14px, ${pct}%, calc(100% - 14px))` }}
      />
      <input
        type="range"
        min={step}
        max={card.limitMax}
        step={step}
        value={card.limit}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Monthly spending limit"
        aria-valuetext={formatMoney(card.limit, card.currency, { decimals: false })}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

const SETTINGS: { key: keyof CardSettings; label: string; hint: string }[] = [
  { key: "online", label: "Online payments", hint: "Shops, apps and subscriptions" },
  { key: "contactless", label: "Contactless", hint: "Tap to pay at card terminals" },
  { key: "atm", label: "ATM withdrawals", hint: "Free up to 4 per month" },
];

export function CardsScreen() {
  const { state, dispatch, toast } = useWallet();
  const cards = state.cards;
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<string | null>(null);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  const card = cards[index];

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, i));
    setIndex(next);
    setRevealed(null);
    if (reduce) x.set(-next * STEP);
    else animate(x, -next * STEP, spring);
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard?.writeText(card.number.replace(/\s/g, ""));
    } catch {
      /* blocked in some iframes; number is still revealable */
    }
    toast("Card number copied");
  };

  const left = card.limit - card.spent;
  const isRevealed = revealed === card.id;

  return (
    <div className="h-full overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <header className="flex items-end justify-between px-5 pb-1 pt-[calc(var(--safe-top)+10px)]">
        <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#12161C]">Cards</h1>
        <p className="pb-1 text-[13px] font-medium text-[#555D6B]">
          {index + 1} of {cards.length}
        </p>
      </header>

      {/* carousel */}
      <section aria-roledescription="carousel" aria-label="Your cards" className="mt-4 overflow-hidden">
        <motion.div
          className="flex cursor-grab touch-pan-y gap-[14px] pl-5 active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -(cards.length - 1) * STEP, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            const swipe = info.offset.x + info.velocity.x * 0.18;
            if (swipe < -60) goTo(index + 1);
            else if (swipe > 60) goTo(index - 1);
            else goTo(index);
          }}
        >
          {cards.map((c, i) => (
            <motion.div
              key={c.id}
              className="shrink-0"
              style={{ width: CARD_W }}
              animate={{ scale: i === index ? 1 : 0.94, opacity: i === index ? 1 : 0.6 }}
              transition={spring}
              onClick={() => i !== index && goTo(i)}
              aria-hidden={i !== index}
            >
              <CardFace card={c} revealed={revealed === c.id} />
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-4 flex justify-center gap-1.5">
          {cards.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${c.name} card`}
              aria-current={i === index}
              className="grid h-6 place-items-center px-0.5"
            >
              <motion.span
                className="block h-1.5 rounded-full"
                animate={{ width: i === index ? 20 : 6, backgroundColor: i === index ? "#12161C" : "#C9CDD3" }}
                transition={spring}
              />
            </button>
          ))}
        </div>
      </section>

      <div className="px-5">
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h2 className="text-[19px] font-bold tracking-[-0.025em] text-[#12161C]">{card.name}</h2>
            <p className="text-[13px] text-[#555D6B]">
              {card.kind} {card.network === "visa" ? "Visa" : "Mastercard"} · {card.currency}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${
              card.frozen ? "bg-[#E2EBF4] text-[#24507F]" : "bg-[#E3F1EC] text-[#0A6B53]"
            }`}
          >
            {card.frozen ? "Frozen" : "Active"}
          </span>
        </div>

        {/* actions */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <button
            type="button"
            aria-pressed={card.frozen}
            onClick={() => {
              dispatch({ type: "toggleFreeze", cardId: card.id });
              toast(card.frozen ? `${card.name} card unfrozen` : `${card.name} card frozen`);
            }}
            className={`flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-[20px] text-[13px] font-semibold transition-colors active:scale-[0.97] ${
              card.frozen ? "bg-[#24507F] text-white" : "bg-white text-[#12161C] shadow-[0_1px_2px_rgba(18,22,28,0.05)]"
            }`}
          >
            <Snowflake size={20} strokeWidth={ICON} />
            {card.frozen ? "Unfreeze" : "Freeze"}
          </button>
          <button
            type="button"
            aria-pressed={isRevealed}
            onClick={() => setRevealed(isRevealed ? null : card.id)}
            className="flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white text-[13px] font-semibold text-[#12161C] shadow-[0_1px_2px_rgba(18,22,28,0.05)] active:scale-[0.97]"
          >
            {isRevealed ? <EyeOff size={20} strokeWidth={ICON} /> : <Eye size={20} strokeWidth={ICON} />}
            {isRevealed ? "Hide details" : "Show details"}
          </button>
          <button
            type="button"
            onClick={copyNumber}
            className="flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white text-[13px] font-semibold text-[#12161C] shadow-[0_1px_2px_rgba(18,22,28,0.05)] active:scale-[0.97]"
          >
            <Copy size={20} strokeWidth={ICON} />
            Copy number
          </button>
        </div>

        {/* limit */}
        <section className="mt-5 rounded-[24px] bg-white p-4 shadow-[0_1px_2px_rgba(18,22,28,0.05)]" aria-label="Spending limit">
          <div className="flex items-baseline justify-between">
            <p className="text-[14px] font-semibold text-[#12161C]">Monthly limit</p>
            <p className="text-[20px] font-bold tabular-nums tracking-[-0.03em] text-[#12161C]">
              {formatMoney(card.limit, card.currency, { decimals: false })}
            </p>
          </div>
          <div className="mt-2">
            <LimitSlider card={card} onChange={(v) => dispatch({ type: "setLimit", cardId: card.id, limit: v })} />
          </div>
          <div className="flex justify-between text-[12px] tabular-nums text-[#555D6B]">
            <span>{formatMoney(card.spent, card.currency)} spent</span>
            <span className={left < 0 ? "font-semibold text-[#9A5B06]" : ""}>
              {left < 0
                ? `${formatMoney(-left, card.currency)} over`
                : `${formatMoney(left, card.currency)} left`}
            </span>
          </div>
          {left < 0 && (
            <p className="mt-2 rounded-xl bg-[#FBF2E2] px-3 py-2 text-[12px] font-medium text-[#7A4705]" role="status">
              The limit is below this month&rsquo;s spend, so new payments on this card will be declined.
            </p>
          )}
        </section>

        {/* settings */}
        <section className="mt-4 rounded-[24px] bg-white px-4 shadow-[0_1px_2px_rgba(18,22,28,0.05)]" aria-label="Card settings">
          <div className="divide-y divide-[#EEF0F3]">
            {SETTINGS.map((s) => (
              <div key={s.key} className="flex items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[#12161C]">{s.label}</p>
                  <p className="text-[12px] text-[#555D6B]">{card.frozen ? "Paused while the card is frozen" : s.hint}</p>
                </div>
                <Toggle
                  label={s.label}
                  checked={card.settings[s.key] && !card.frozen}
                  onChange={() => {
                    if (card.frozen) {
                      toast("Unfreeze the card to change this");
                      return;
                    }
                    dispatch({ type: "toggleSetting", cardId: card.id, key: s.key });
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
