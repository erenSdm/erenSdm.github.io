"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { SectionLabel } from "@/components/primitives/SectionLabel";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Capabilities() {
  const t = useT();
  return (
    <section
      id="capabilities"
      className="relative border-t border-line py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-6">{t.capabilities.label}</SectionLabel>
            <h2 className="font-display text-huge text-paper">
              {t.capabilities.title}
            </h2>
          </div>
          <p className="max-w-xs font-mono text-xs leading-relaxed text-ash">
            [ FULL-STACK PRODUCT ] — DESIGN, ENGINEERING, MOTION AND BRAND UNDER
            ONE ROOF.
          </p>
        </div>

        {/* hairline matrix */}
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
          {t.capabilities.items.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease, delay: (i % 2) * 0.08 }}
              className="group relative flex flex-col gap-6 bg-ink p-8 transition-colors duration-300 hover:bg-coal md:p-12"
            >
              <span className="pointer-events-none absolute left-0 top-0 h-full w-0 bg-acid/[0.04] transition-all duration-500 group-hover:w-full" />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-sm text-acid">{item.id}</span>
                <span className="h-2 w-2 bg-dim transition-colors group-hover:bg-acid" />
              </div>
              <div className="relative">
                <h3 className="font-display text-3xl uppercase text-paper md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-bone">
                  {item.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
