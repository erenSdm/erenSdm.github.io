"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { CONTACT } from "./data";
import { EASE } from "./ui";

const LINKS = [
  { href: "#kategoriler", label: "Radyatörler" },
  { href: "#kategoriler", label: "Havlupanlar" },
  { href: "#koleksiyon", label: "Koleksiyon" },
  { href: "#teknoloji", label: "Teknoloji" },
  { href: "#satis", label: "Satış Noktaları" },
];

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      lang="en"
      className={clsx(
        "font-[family-name:var(--font-nx-display)] font-semibold uppercase tracking-[0.18em] [font-stretch:125%]",
        className,
      )}
    >
      Nixrad
    </span>
  );
}

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById("nx-hero-sentinel");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:pt-5">
        <nav
          className={clsx(
            "pointer-events-auto flex w-full max-w-[1180px] items-center justify-between rounded-full py-2 pl-5 pr-2 transition-[background-color,box-shadow,color] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            scrolled || open
              ? "bg-[#E9E6E0]/80 text-[#151514] shadow-[0_10px_40px_-18px_rgba(21,21,20,0.35)] ring-1 ring-[#151514]/10 backdrop-blur-xl"
              : "bg-transparent text-[#E9E6E0]",
          )}
        >
          <a href="#top" className="text-[15px]" onClick={() => setOpen(false)}>
            <Wordmark />
          </a>
          <ul className="hidden items-center gap-7 text-[13px] lg:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="opacity-75 transition-opacity duration-300 hover:opacity-100">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="#satis"
              className={clsx(
                "hidden rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors duration-500 sm:inline-flex",
                scrolled || open ? "bg-[#151514] text-[#E9E6E0]" : "bg-[#E9E6E0] text-[#151514]",
              )}
            >
              Teklif Al
            </a>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            >
              <span
                className={clsx(
                  "absolute h-px w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={clsx(
                  "absolute h-px w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-[#E9E6E0]/95 px-6 pb-10 pt-28 text-[#151514] backdrop-blur-2xl lg:hidden"
          >
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <li key={l.label} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: 48, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.06 + i * 0.05 }}
                    className="flex items-baseline justify-between border-b border-[#151514]/10 py-4 font-[family-name:var(--font-nx-display)] text-[30px] font-medium uppercase leading-none tracking-[-0.01em] [font-stretch:115%]"
                  >
                    {l.label}
                    <span className="font-[family-name:var(--font-nx-mono)] text-[11px] tracking-[0.2em] text-[#151514]/40">
                      0{i + 1}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
              className="space-y-1 font-[family-name:var(--font-nx-mono)] text-[12px] text-[#151514]/60"
            >
              <a href={CONTACT.phoneHref} className="block">{CONTACT.phone}</a>
              <a href={`mailto:${CONTACT.email}`} className="block">{CONTACT.email}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
