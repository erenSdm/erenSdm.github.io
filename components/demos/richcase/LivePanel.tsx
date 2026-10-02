"use client";

import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Bezel, EASE, GOLD, GOLD_HI, UP, fBody, fDisplay, fMono, usd } from "./ui";

/* Sample flow — same illustrative trades the original landing animates. */
export const TRADES = [
  { pair: "BTC/USDT", side: "LONG", entry: "64,210", exit: "65,180", pnl: 124.5 },
  { pair: "ETH/USDT", side: "SHORT", entry: "3,240", exit: "3,198", pnl: 87.2 },
  { pair: "SOL/USDT", side: "LONG", entry: "148.20", exit: "152.40", pnl: 52.1 },
  { pair: "BNB/USDT", side: "LONG", entry: "612.40", exit: "619.00", pnl: 38.8 },
] as const;

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = usd(v);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);
  return <span ref={ref}>{usd(0)}</span>;
}

export const LivePanel = memo(function LivePanel() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "0px 0px -10% 0px" });
  const [step, setStep] = useState(reduce ? TRADES.length : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => {
      setStep((s) => (s >= TRADES.length + 2 ? 0 : s + 1));
    }, 1400);
    return () => window.clearInterval(id);
  }, [reduce, inView]);

  const shown = Math.min(step, TRADES.length);
  const total = TRADES.slice(0, shown).reduce((a, t) => a + t.pnl, 0);

  return (
    <div ref={root} className="relative">
      <Bezel inner="p-5 sm:p-6">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/richcase/rc-32x32.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-[10px] ring-1 ring-white/10"
            />
            <div>
              <div className={`${fBody} text-[14px] font-semibold text-white`}>
                Trading Bot · Binance
              </div>
              <div className={`${fMono} text-[11px] text-[#8a8a8a]`}>Futures · USDT-M</div>
            </div>
          </div>
          <span
            className={`${fMono} inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] px-2.5 py-1 text-[10.5px] uppercase tracking-[0.14em]`}
            style={{ color: UP }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
            </span>
            Çalışıyor
          </span>
        </div>

        {/* total */}
        <div className="mt-7 border-t border-white/[0.06] pt-6">
          <div className={`${fMono} text-[10.5px] uppercase tracking-[0.18em] text-[#8a8a8a]`}>
            Toplam kazanç
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`${fDisplay} text-[2.6rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums sm:text-[3.1rem]`}
              style={{ color: GOLD_HI, fontStretch: "105%" }}
            >
              +<Counter value={total} />
            </span>
            <span className={`${fMono} text-[12px] text-[#8a8a8a]`}>USDT</span>
          </div>
        </div>

        {/* trades */}
        <ul className="mt-6 flex min-h-[244px] flex-col gap-2" aria-label="Kapanan işlemler">
          <AnimatePresence initial={false}>
            {TRADES.slice(0, shown).map((t) => (
              <motion.li
                key={t.pair}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
                className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${fMono} rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-[0.08em]`}
                    style={{
                      color: t.side === "LONG" ? UP : "#f87171",
                      background: t.side === "LONG" ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                    }}
                  >
                    {t.side}
                  </span>
                  <div>
                    <div className={`${fBody} text-[13.5px] font-medium text-white`}>{t.pair}</div>
                    <div className={`${fMono} text-[11px] text-[#7a7a7a] tabular-nums`}>
                      {t.entry} → {t.exit}
                    </div>
                  </div>
                </div>
                <span className={`${fMono} text-[13.5px] font-medium tabular-nums`} style={{ color: UP }}>
                  +{usd(t.pnl)}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
          {shown === 0 && (
            <li className={`${fMono} flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/[0.07] text-[12px] text-[#6b6b6b]`}>
              Piyasa taranıyor…
            </li>
          )}
        </ul>

        <div className={`${fMono} mt-5 flex items-center justify-between text-[10.5px] uppercase tracking-[0.16em] text-[#5f5f5f]`}>
          <span>Örnek akış</span>
          <span style={{ color: GOLD }}>Kâr → kasa</span>
        </div>
      </Bezel>
    </div>
  );
});
