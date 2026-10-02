"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { Kicker } from "@/components/primitives/SplitButton";
import { scrollToId, cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Renders "plain |term| plain" with the gertix-style piped highlights. */
export function Piped({ text }: { text: string }) {
  const parts = text.split("|");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="term font-medium text-current">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export function Intro() {
  const t = useT();
  const reduce = useReducedMotion();

  return (
    <section
      id="studio"
      data-prism="manifesto"
      className="relative bg-mist/[0.93] text-carbon"
    >
      <div className="mx-auto max-w-[1680px] px-4 py-24 md:px-10 md:py-36 lg:px-[8.5vw]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Kicker className="mb-8">{t.intro.kicker}</Kicker>
            <h2 className="font-wide text-display-lg">
              {t.intro.title.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease }}
            className="font-plex max-w-[52ch] self-end text-[15px] leading-[1.7] text-carbon/80 lg:col-span-5"
          >
            <p className="mb-5 text-carbon">{t.intro.lead}</p>
            <p className="text-pretty">
              <Piped text={t.intro.body} />
            </p>
          </motion.div>
        </div>

        {/* the three layers — each one jumps to its section further down */}
        <ol className="mt-20 grid border-t border-dashed border-carbon/30 md:mt-28 lg:grid-cols-3">
          {t.intro.parts.map((p, i) => (
            <motion.li
              key={p.target}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              className={cn(
                "border-b border-dashed border-carbon/30 lg:border-b-0",
                i > 0 ? "lg:border-l" : "lg:[&>button]:pl-0"
              )}
            >
              <button
                type="button"
                onClick={() => scrollToId(p.target, -56)}
                className="group flex h-full w-full flex-col py-10 text-left outline-none focus-visible:ring-2 focus-visible:ring-carbon lg:px-8 lg:py-12"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-plex tabular text-xl md:text-2xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ui text-carbon/55">{p.sub}</span>
                </div>
                <h3 className="font-wide text-display-md mt-8 text-balance">{p.title}</h3>
                <p className="font-plex mt-6 max-w-[46ch] text-[15px] leading-[1.7] text-carbon/75 text-pretty">
                  {p.body}
                </p>
                <ul className="mt-8 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <li key={tag} lang="en" className="ui rounded-full border border-carbon/55 px-3 py-1.5 text-[11px]">
                      {tag}
                    </li>
                  ))}
                </ul>
                <span className="ui mt-auto flex items-center gap-2 pt-10">
                  <span className="flex h-9 w-9 items-center justify-center bg-carbon text-paper transition-transform duration-300 group-hover:translate-y-0.5">
                    <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="border-b border-transparent transition-colors group-hover:border-carbon">{p.cta}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
