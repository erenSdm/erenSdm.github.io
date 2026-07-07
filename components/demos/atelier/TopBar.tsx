"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import clsx from "clsx";
import { EASE } from "./ui";

const NAV = [
  { label: "Collection", href: "#collection" },
  { label: "The Cape", href: "#featured" },
  { label: "Lookbook", href: "#lookbook" },
  { label: "Maison", href: "#maison" },
];

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-[#1A1512]/10 bg-[#F4F1EA]/85 py-3 backdrop-blur-md"
            : "border-b border-transparent py-6",
        )}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 md:px-12 lg:px-16">
          {/* Wordmark */}
          <a
            href="#top"
            className="font-[family-name:var(--font-sev-serif)] text-[22px] font-medium tracking-[0.32em] text-[#1A1512] md:text-[24px]"
          >
            SÉVIGNÉ
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative font-[family-name:var(--font-sev-grotesk)] text-[12px] uppercase tracking-[0.22em] text-[#4A413A] transition-colors duration-300 hover:text-[#1A1512]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#9A7B44] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-5">
            <a
              href="#featured"
              aria-label="Shopping bag, 1 item"
              className="group relative flex items-center gap-2 text-[#1A1512] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B44] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1EA]"
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.4} />
              <span className="font-[family-name:var(--font-sev-mono)] text-[11px] tracking-[0.1em]">
                (1)
              </span>
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="text-[#1A1512] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B44]"
            >
              <Menu className="h-6 w-6" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-[#F4F1EA] lg:hidden"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-[family-name:var(--font-sev-serif)] text-[22px] tracking-[0.32em]">
                SÉVIGNÉ
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-[#1A1512] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B44]"
              >
                <X className="h-6 w-6" strokeWidth={1.4} />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2 px-6">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.07 }}
                  className="border-b border-[#1A1512]/10 py-5 font-[family-name:var(--font-sev-serif)] text-[2rem] leading-none text-[#1A1512]"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-10 px-6 font-[family-name:var(--font-sev-mono)] text-[11px] uppercase tracking-[0.22em] text-[#8A7E6E]">
              18 Rue Saint-Honoré · Paris 1<sup>er</sup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
