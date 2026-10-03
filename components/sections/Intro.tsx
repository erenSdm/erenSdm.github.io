"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { scrollToId, cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Portrait({ className }: { className?: string }) {
  const t = useT();
  const reduce = useReducedMotion();
  const f = t.intro.figure;

  /*
   * No frame: the cut-out stands on the dashed rule of the list below (negative
   * bottom margin = the list's top margin) and bleeds off the right gutter.
   * The left edge of the shirt fades out so the crop doesn't read as a box.
   */
  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease }}
      className={cn(
        "relative -mb-20 -mr-4 ml-[12%] self-end md:-mb-28 md:-mr-10 md:ml-[28%] lg:mr-0 lg:-ml-[calc(12%+8.5vw)]",
        className
      )}
    >
      <div
        className="relative aspect-[1792/2400]"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, #000 16%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 16%)",
        }}
      >
        <Image
          src="/about/me2.webp"
          alt={f.alt}
          fill
          sizes="(min-width: 1024px) 46vw, 90vw"
          className="object-contain object-bottom"
        />
      </div>
    </motion.figure>
  );
}

export function Intro() {
  const t = useT();
  const reduce = useReducedMotion();

  return (
    <section
      id="about"
      data-prism="manifesto"
      className="relative bg-mist/[0.93] text-carbon"
    >
      <div className="mx-auto max-w-[1680px] px-4 pb-12 pt-24 md:px-10 md:pb-14 md:pt-36 lg:px-[8.5vw] lg:pt-16">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col lg:col-span-7">
            {/* the portrait sets the row height; auto margins share the slack above and below the title */}
            <h2 className="font-wide text-display-lg lg:mt-auto">
              {t.intro.title.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease }}
              className="font-plex mt-12 max-w-[60ch] lg:mt-auto lg:pt-16"
            >
              <p className="text-pretty text-[17px] leading-[1.6] text-carbon md:text-lg">{t.intro.lead}</p>
              <dl className="mt-10 grid gap-x-10 border-t border-dashed border-carbon/30 sm:grid-cols-2">
                {t.intro.points.map((pt, i) => (
                  <div
                    key={pt.title}
                    className={cn(
                      "border-b border-dashed border-carbon/30 py-6",
                      // first point spans the row; the other two sit side by side from sm up
                      i === 0 && "sm:col-span-2"
                    )}
                  >
                    <dt className="font-wide text-[15px] uppercase tracking-[0.02em]">{pt.title}</dt>
                    <dd className="mt-3 text-pretty text-[14px] leading-[1.7] text-carbon/75">{pt.body}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
          <Portrait className="lg:col-span-5" />
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
                <h3 className="font-wide text-display-md text-balance">{p.title}</h3>
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
