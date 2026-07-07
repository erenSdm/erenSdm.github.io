"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { scrollToId } from "@/lib/utils";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { HazardTape } from "@/components/primitives/HazardTape";

const EMAIL = "errenaydemir@gmail.com";
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Contact() {
  const { t, locale, toggle } = useLanguage();
  const year = 2026;

  return (
    <footer id="contact" className="relative border-t border-line">
      <HazardTape />

      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="label mb-10 block text-acid">[ {t.contact.label} ]</span>

        <div className="grid gap-12 md:grid-cols-12">
          {/* giant headline */}
          <div className="md:col-span-8">
            <h2 className="font-display text-mega leading-[0.82] text-paper">
              {t.contact.lead}
              <br />
              <span className="text-acid">{t.contact.line2}</span>
              <br />
              {t.contact.line3}
            </h2>
          </div>

          {/* right rail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col justify-end gap-8 md:col-span-4"
          >
            <p className="max-w-sm text-base leading-relaxed text-bone">
              {t.contact.body}
            </p>

            <div className="space-y-4">
              <div>
                <span className="label block">{t.contact.emailLabel}</span>
                <a
                  href={`mailto:${EMAIL}`}
                  className="mt-1 block break-all font-mono text-lg text-paper underline decoration-acid decoration-2 underline-offset-4 transition-colors hover:text-acid"
                >
                  {EMAIL}
                </a>
              </div>
              <div>
                <span className="label block">{t.contact.availabilityLabel}</span>
                <p className="mt-1 flex items-center gap-2 font-mono text-sm text-paper">
                  <span className="h-2 w-2 animate-blink bg-acid" />
                  {t.contact.availability}
                </p>
              </div>
            </div>

            <MagneticButton href={`mailto:${EMAIL}`} external>
              {t.contact.cta}
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* footer meta bar */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg text-paper">MONOLITH</span>
            <span className="label">© {year} — {t.footer.tag}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex gap-4">
              {["Instagram", "X", "Dribbble", "GitHub"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-mono text-xs uppercase tracking-widest text-ash transition-colors hover:text-acid"
                >
                  {s}
                </a>
              ))}
            </div>
            <button
              onClick={toggle}
              className="border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-ash transition-colors hover:border-acid hover:text-acid"
            >
              {locale === "en" ? "TÜRKÇE" : "ENGLISH"}
            </button>
            <button
              onClick={() => scrollToId("top")}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ash transition-colors hover:text-acid"
            >
              {t.footer.backToTop}
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-5 pb-8 md:px-10">
          <p className="font-mono text-[11px] text-dim">{t.footer.colophon}</p>
        </div>
      </div>
    </footer>
  );
}
