"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Wifi } from "lucide-react";
import { CARDS, money, type WalletCard } from "./data";

function NetworkMark({ network, ink }: { network: WalletCard["network"]; ink: string }) {
  if (network === "mastercard") {
    return (
      <div className="flex items-center" aria-label="Mastercard">
        <span
          className="h-6 w-6 rounded-full"
          style={{ backgroundColor: "#EB6C1E", opacity: 0.95 }}
        />
        <span
          className="-ml-2.5 h-6 w-6 rounded-full"
          style={{ backgroundColor: "#F5B14C", opacity: 0.9, mixBlendMode: "hard-light" }}
        />
      </div>
    );
  }
  return (
    <span
      className="font-mono text-[15px] font-bold italic tracking-tight"
      style={{ color: ink }}
      aria-label="Visa"
    >
      VISA
    </span>
  );
}

function Chip({ ink }: { ink: string }) {
  return (
    <div
      className="grid h-7 w-9 grid-cols-3 gap-[2px] overflow-hidden rounded-[5px] p-1"
      style={{ backgroundColor: ink, opacity: 0.85 }}
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="rounded-[1px]"
          style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
        />
      ))}
    </div>
  );
}

function Card({ card, index }: { card: WalletCard; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex aspect-[1.585/1] w-[264px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[22px] p-4 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.7)]"
      style={{ background: card.face, color: card.ink }}
    >
      {/* inner sheen */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.22)",
          background:
            "radial-gradient(120% 80% at 85% 0%, rgba(255,255,255,0.18), transparent 55%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
            MINT
          </p>
          <p className="mt-0.5 text-[13px] font-semibold tracking-tight">
            {card.label}
          </p>
        </div>
        <Wifi
          className="h-4 w-4 rotate-90 opacity-70"
          strokeWidth={2}
          aria-hidden
        />
      </div>

      <div className="relative flex items-end justify-between">
        <div>
          <Chip ink={card.ink} />
          <p className="mt-2 font-mono text-[13px] tracking-[0.18em] opacity-90">
            •••• {card.last4}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">
            Balance
          </p>
          <p className="font-mono text-[15px] font-semibold tabular-nums">
            ${money(card.balance)}
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] opacity-70">
          {card.holder}
        </span>
        <NetworkMark network={card.network} ink={card.ink} />
      </div>
    </motion.article>
  );
}

export function CardCarousel() {
  return (
    <section aria-label="Your cards" className="mt-6">
      <div className="mb-3 flex items-center justify-between px-5">
        <h2 className="text-[13px] font-semibold tracking-tight text-white">
          Your cards
        </h2>
        <span className="text-[11px] font-medium text-white/35">
          {CARDS.length} active
        </span>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CARDS.map((card, i) => (
          <Card key={card.id} card={card} index={i} />
        ))}
        <span className="w-2 shrink-0" aria-hidden />
      </div>
    </section>
  );
}
