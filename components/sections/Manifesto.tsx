"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { SectionLabel } from "@/components/primitives/SectionLabel";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Words({ text, className, accent }: { text: string; className?: string; accent?: boolean }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={accent ? "inline-block text-acid" : "inline-block"}
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease, delay: i * 0.03 }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Manifesto() {
  const t = useT();
  return (
    <section className="relative border-t border-line py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel className="mb-12">{t.manifesto.label}</SectionLabel>

        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-2">
            <p className="font-display text-giant leading-[0.95] text-paper">
              <Words text={t.manifesto.lead} />
              <br className="hidden md:block" />
              <Words text={t.manifesto.body} accent />
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 border-l-2 border-acid pl-4 font-mono text-sm leading-relaxed text-ash"
            >
              {t.manifesto.note}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
