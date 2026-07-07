"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { EASE, Eyebrow, Reveal } from "./ui";
import { AnimatePresence, motion } from "framer-motion";

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Maison",
    links: ["Collection XII", "The Signature Cape", "Lookbook", "Our ateliers"],
  },
  {
    title: "Client care",
    links: ["Book a fitting", "Alterations", "Shipping", "Contact"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "Cookies", "Accessibility"],
  },
];

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
    window.setTimeout(() => setDone(false), 3200);
  }

  return (
    <footer className="relative bg-[#1A1512] text-[#F4F1EA]">
      {/* Newsletter */}
      <div className="mx-auto max-w-[1500px] px-6 py-28 md:px-12 md:py-36 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow tone="gold">La Correspondance</Eyebrow>
            <h2 className="mt-7 max-w-[14ch] font-[family-name:var(--font-sev-serif)] text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[0.98] tracking-[-0.02em]">
              Join the <span className="italic text-[#E7C98A]">maison.</span>
            </h2>
            <p className="mt-6 max-w-sm font-[family-name:var(--font-sev-grotesk)] text-[14px] leading-relaxed text-[#C9BFA9]">
              Private previews of each collection, atelier notes, and fitting
              invitations — four letters a year, never more.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:pt-6" delay={0.1}>
            <form onSubmit={onSubmit} className="max-w-md">
              <label
                htmlFor="sev-email"
                className="font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase tracking-[0.24em] text-[#8A7E6E]"
              >
                Email address
              </label>
              <div className="mt-4 flex items-center gap-4 border-b border-[#F4F1EA]/25 pb-3 transition-colors duration-500 focus-within:border-[#E7C98A]">
                <input
                  id="sev-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full bg-transparent font-[family-name:var(--font-sev-serif)] text-[22px] text-[#F4F1EA] placeholder:text-[#6F6456] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E7C98A] text-[#1A1512] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7C98A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1512]"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
              <div className="mt-4 h-4">
                <AnimatePresence>
                  {done && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[#E7C98A]"
                    >
                      Merci — your first letter is on its way.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>

      {/* Footer meta */}
      <div className="border-t border-[#F4F1EA]/12">
        <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-12 lg:px-16">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <span className="font-[family-name:var(--font-sev-serif)] text-[24px] tracking-[0.3em]">
                SÉVIGNÉ
              </span>
              <p className="mt-5 max-w-[24ch] font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase leading-[1.9] tracking-[0.18em] text-[#8A7E6E]">
                18 Rue Saint-Honoré
                <br />
                75001 Paris, France
              </p>
            </div>
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-[family-name:var(--font-sev-mono)] text-[10px] uppercase tracking-[0.24em] text-[#8A7E6E]">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#top"
                        className="font-[family-name:var(--font-sev-grotesk)] text-[13px] text-[#C9BFA9] transition-colors duration-300 hover:text-[#F4F1EA]"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-3 border-t border-[#F4F1EA]/12 pt-8 font-[family-name:var(--font-sev-mono)] text-[10px] uppercase tracking-[0.2em] text-[#6F6456] md:flex-row md:items-center md:justify-between">
            <span>© 2026 Maison Sévigné — Tous droits réservés</span>
            <span className="flex flex-wrap gap-6">
              <span>Made to order in France</span>
              <span aria-hidden className="hidden md:inline text-[#4A413A]">
                ·
              </span>
              <span>EUR / FR</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
