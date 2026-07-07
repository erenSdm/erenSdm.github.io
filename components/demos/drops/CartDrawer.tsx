"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./cart";
import { MAGENTA, EASE } from "./ui";
import { imgUrl } from "./data";

const FREE_SHIP = 250;

export function CartDrawer() {
  const { open, setOpen, lines, count, subtotal, setQty, remove } = useCart();
  const reduce = useReducedMotion();
  const toFree = Math.max(0, FREE_SHIP - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          {/* scrim */}
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-void/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* panel */}
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-line bg-ink"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-paper" strokeWidth={1.75} />
                <span className="font-[family-name:var(--font-cad-display)] text-[1.5rem] leading-none text-paper">
                  Your bag
                </span>
                <span
                  className="flex h-5 min-w-5 items-center justify-center px-1 font-[family-name:var(--font-cad-mono)] text-[11px] font-bold text-ink tabular-nums"
                  style={{ background: MAGENTA }}
                >
                  {count}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center border border-line text-bone transition-colors hover:border-paper hover:text-paper"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* free-ship meter */}
            <div className="border-b border-line px-5 py-3">
              <p className="font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.14em] text-bone">
                {toFree > 0 ? (
                  <>
                    €{toFree} away from{" "}
                    <span style={{ color: MAGENTA }}>free express</span>
                  </>
                ) : (
                  <span style={{ color: MAGENTA }}>Free express unlocked ✦</span>
                )}
              </p>
              <div className="mt-2 h-1.5 w-full bg-coal">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: MAGENTA }}
                />
              </div>
            </div>

            {/* lines */}
            <div className="flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="font-[family-name:var(--font-cad-display)] text-[2rem] leading-none text-paper">
                    Bag&apos;s empty
                  </p>
                  <p className="font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.14em] text-ash">
                    The drop won&apos;t wait.
                  </p>
                </div>
              ) : (
                <ul>
                  {lines.map((l) => (
                    <li
                      key={l.key}
                      className="flex gap-3 border-b border-line px-5 py-4"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl(l.seed, 200, 240)}
                        alt={l.name}
                        className="h-24 w-20 shrink-0 object-cover"
                        loading="lazy"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-[family-name:var(--font-cad-display)] text-[1.2rem] leading-none text-paper">
                            {l.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => remove(l.key)}
                            aria-label={`Remove ${l.name}`}
                            className="text-ash transition-colors hover:text-paper"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </div>
                        <p className="mt-1 font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.12em] text-ash">
                          {l.colorway} · EU {l.size}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() => setQty(l.key, l.qty - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center text-bone transition-colors hover:text-paper"
                            >
                              <Minus className="h-3 w-3" strokeWidth={2.5} />
                            </button>
                            <span className="w-7 text-center font-[family-name:var(--font-cad-mono)] text-[12px] text-paper tabular-nums">
                              {l.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(l.key, l.qty + 1)}
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center text-bone transition-colors hover:text-paper"
                            >
                              <Plus className="h-3 w-3" strokeWidth={2.5} />
                            </button>
                          </div>
                          <span className="font-[family-name:var(--font-cad-mono)] text-[13px] font-bold text-paper tabular-nums">
                            €{l.price * l.qty}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* footer / checkout */}
            <div className="border-t border-line px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.16em] text-ash">
                  Subtotal
                </span>
                <span className="font-[family-name:var(--font-cad-display)] text-[2rem] leading-none text-paper tabular-nums">
                  €{subtotal}
                </span>
              </div>
              <button
                type="button"
                disabled={lines.length === 0}
                className="group mt-4 flex w-full items-center justify-between gap-3 px-5 py-4 font-[family-name:var(--font-cad-display)] text-[1.5rem] leading-none tracking-[0.02em] text-ink transition-transform active:scale-[0.99] disabled:opacity-40"
                style={{ background: MAGENTA }}
              >
                Cop it now
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </button>
              <p className="mt-3 text-center font-[family-name:var(--font-cad-mono)] text-[10px] uppercase tracking-[0.14em] text-ash">
                Taxes & shipping at checkout · Bag held 10:00
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
