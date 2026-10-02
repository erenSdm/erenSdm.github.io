"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { Kicker } from "@/components/primitives/SplitButton";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Process() {
  const t = useT();
  return (
    <section id="process" data-prism="process" className="relative bg-mist/[0.93] text-carbon">
      <div className="mx-auto max-w-[1680px] px-4 py-24 md:px-10 md:py-36 lg:px-[8.5vw]">
        <Kicker className="mb-8">{t.process.kicker}</Kicker>
        <h2 className="font-wide text-display-lg max-w-[16ch]">{t.process.title}</h2>

        <ol className="mt-16 border-t border-dashed border-carbon/35 md:mt-24">
          {t.process.steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.06 }}
              className="grid grid-cols-[3.25rem_1fr] gap-x-3 gap-y-3 border-b border-dashed border-carbon/35 py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10"
            >
              <span className="font-plex tabular text-xl md:col-span-1 md:text-2xl">{s.n}</span>
              <h3 className="font-wide text-[clamp(1.4rem,2.6vw,2.4rem)] leading-none md:col-span-5">
                {s.title}
              </h3>
              <p className="font-plex col-start-2 max-w-[52ch] text-[15px] leading-[1.7] text-carbon/75 md:col-span-6 md:col-start-auto">
                {s.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
