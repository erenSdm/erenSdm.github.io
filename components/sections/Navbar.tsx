"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { scrollToId, cn } from "@/lib/utils";

export function Navbar() {
  const { t, locale, toggle } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "work", label: t.nav.work },
    { id: "capabilities", label: t.nav.capabilities },
    { id: "process", label: t.nav.process },
    { id: "contact", label: t.nav.contact },
  ];

  function go(id: string) {
    setOpen(false);
    scrollToId(id);
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? "border-b border-line bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
          {/* wordmark */}
          <button
            onClick={() => go("top")}
            className="group flex items-baseline gap-2"
            aria-label="MONOLITH — home"
          >
            <span className="font-display text-xl leading-none tracking-tight text-paper md:text-2xl">
              MONOLITH
            </span>
            <span className="hidden h-1.5 w-1.5 bg-acid transition-transform group-hover:scale-150 sm:block" />
          </button>

          {/* desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="label transition-colors hover:text-acid"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* lang toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1 border border-line px-2 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors hover:border-acid"
              aria-label="Toggle language"
            >
              <span className={cn(locale === "en" ? "text-acid" : "text-ash")}>
                EN
              </span>
              <span className="text-dim">/</span>
              <span className={cn(locale === "tr" ? "text-acid" : "text-ash")}>
                TR
              </span>
            </button>

            {/* desktop CTA */}
            <button
              onClick={() => go("contact")}
              className="hidden border-2 border-acid bg-acid px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-acid-deep md:block"
            >
              {t.nav.cta}
            </button>

            {/* mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 border border-line md:hidden"
              aria-label={open ? t.common.close : t.common.menu}
              aria-expanded={open}
            >
              <span
                className={cn(
                  "h-0.5 w-4 bg-paper transition-transform duration-300",
                  open && "translate-y-[4px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-4 bg-paper transition-transform duration-300",
                  open && "-translate-y-[4px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-5 pb-10 pt-24 backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col">
              {links.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => go(l.id)}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i + 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line py-5 text-left font-display text-5xl uppercase text-paper"
                >
                  {l.label}
                </motion.button>
              ))}
            </nav>
            <button
              onClick={() => go("contact")}
              className="w-full border-2 border-acid bg-acid py-4 font-mono text-sm font-semibold uppercase tracking-widest text-ink"
            >
              {t.nav.cta}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
