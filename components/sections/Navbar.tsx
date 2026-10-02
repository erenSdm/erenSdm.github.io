"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { scrollToId, cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Navbar() {
  const { t, locale, toggle } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const items = t.nav.items;

  /* homepage only: keep <html lang> in sync so CSS uppercase follows Turkish
     casing (i -> İ). Restored on unmount so English demo routes are unaffected. */
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    return () => {
      html.lang = "en";
    };
  }, [locale]);

  /* highlight the pill for whichever section owns the middle of the screen */
  useEffect(() => {
    const ids = items.map((i) => i.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  /* lock page scroll while the overlay is open; Esc closes */
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function go(id: string) {
    setOpen(false);
    // let the overlay release the scroll lock before Lenis moves
    requestAnimationFrame(() => scrollToId(id, id === "top" ? 0 : -56));
  }

  const langToggle = (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.lang}
      className="ui flex h-9 items-center gap-1.5 rounded-full px-3 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
    >
      <span className={cn(locale === "en" && "text-paper")}>EN</span>
      <span aria-hidden className="opacity-40">/</span>
      <span className={cn(locale === "tr" && "text-paper")}>TR</span>
    </button>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-carbon/72 text-paper backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1680px] items-center justify-between gap-4 px-4 md:px-6">
          <button
            type="button"
            onClick={() => go("top")}
            className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-volt"
            aria-label="MONOLITH"
          >
            <span className="font-wide text-[15px] tracking-[-0.02em]">MONOLITH</span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-volt" />
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "ui flex h-9 items-center gap-2 rounded-full px-3.5 transition-colors duration-200",
                  active === item.id
                    ? "bg-paper text-carbon"
                    : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                )}
              >
                <span className="tabular opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </button>
            ))}
            <span aria-hidden className="mx-2 h-4 w-px bg-paper/20" />
            {langToggle}
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            {langToggle}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="ui flex h-9 items-center gap-2 rounded-full bg-paper px-4 text-carbon"
            >
              <span className="tabular opacity-60">
                {open ? "×" : String(items.length).padStart(2, "0")}
              </span>
              {open ? t.nav.close : t.nav.menu}
            </button>
          </div>
        </div>
        <div aria-hidden className="rule-dashed text-paper" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-carbon/96 px-4 pb-8 pt-20 text-paper backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col">
              {items.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.6, ease }}
                  className="flex items-baseline gap-4 border-b border-dashed border-paper/25 py-5 text-left"
                >
                  <span className="ui tabular w-6 text-paper/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-wide text-[clamp(1.6rem,8vw,2.6rem)]",
                      active === item.id && "text-volt"
                    )}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6, ease }}
              className="flex gap-1"
            >
              <button
                type="button"
                onClick={() => go("contact")}
                className="ui flex h-14 flex-1 items-center bg-paper px-5 text-carbon"
              >
                {t.nav.cta}
              </button>
              <button
                type="button"
                onClick={() => go("contact")}
                aria-hidden
                tabIndex={-1}
                className="ui flex h-14 w-14 items-center justify-center bg-paper text-carbon"
              >
                →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
