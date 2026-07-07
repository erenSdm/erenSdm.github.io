"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { SectionLabel } from "@/components/primitives/SectionLabel";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Process() {
  const t = useT();
  return (
    <section id="process" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-6">{t.process.label}</SectionLabel>
            <h2 className="font-display text-huge text-paper">
              {t.process.title}
            </h2>
          </div>
        </div>

        <div className="grid gap-px border-y border-line bg-line md:grid-cols-4">
          {t.process.steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className="group relative flex flex-col gap-6 bg-ink p-8 md:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-6xl leading-none text-dim transition-colors duration-300 group-hover:text-acid">
                  {step.n}
                </span>
                <span className="crosshair text-lg" aria-hidden />
              </div>
              <span aria-hidden className="dotted h-[2px] w-full" />
              <div>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-paper">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
