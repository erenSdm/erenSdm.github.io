"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, GOLD, fBody, fDisplay, Wordmark } from "./ui";

const LINKS = [
  { label: "Nasıl çalışır", href: "#nasil-calisir" },
  { label: "Paketler", href: "#paketler" },
  { label: "Topluluk", href: "#topluluk" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-40 flex justify-center px-4 md:top-5">
        <nav
          aria-label="Ana menü"
          className={`${fBody} flex w-full max-w-[1100px] items-center justify-between gap-6 rounded-full border border-white/[0.08] bg-[#0b0b0c]/70 py-2 pl-4 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl md:pl-5`}
        >
          <a href="#top" className="flex items-center gap-2.5" aria-label="RichCase ana sayfa">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demos/richcase/rc-32x32.png"
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] rounded-[6px]"
            />
            <Wordmark className="text-[17px]" />
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[13.5px] text-[#a3a3a3] transition-colors duration-300 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#paketler"
              className="hidden rounded-full px-4 py-2 text-[13.5px] font-semibold text-[#0a0a0a] transition-transform duration-300 active:scale-[0.97] sm:inline-flex"
              style={{ background: GOLD }}
            >
              Hemen başla
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "rotate-45" : "-translate-y-[4px]"}`}
              />
              <span
                className={`absolute h-px w-4 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "-rotate-45" : "translate-y-[4px]"}`}
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
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-30 flex flex-col justify-end bg-[#0a0a0a]/90 px-6 pb-14 pt-28 backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col gap-3">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: 48, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.06 }}
                    className={`${fDisplay} block text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-white`}
                    style={{ fontStretch: "110%" }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.a
              href="#paketler"
              onClick={() => setOpen(false)}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
              className={`${fBody} mt-10 inline-flex w-full items-center justify-center rounded-full py-4 text-[15px] font-semibold text-[#0a0a0a]`}
              style={{ background: GOLD }}
            >
              Hemen başla
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
