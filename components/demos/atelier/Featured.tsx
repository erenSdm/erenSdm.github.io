"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Plus } from "lucide-react";
import { featuredNotes, featuredSizes } from "./data";
import { EASE, Eyebrow, ParallaxImage, PlateTag, Reveal } from "./ui";
import { AnimatePresence, motion } from "framer-motion";

export function Featured() {
  const [size, setSize] = useState<string | null>("38");
  const [added, setAdded] = useState(false);

  function addToBag() {
    if (!size) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <section id="featured" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12 lg:px-16">
        <Reveal className="border-t border-[#1A1512]/12 pt-8">
          <PlateTag index="02" label="La Pièce Signature" />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
          {/* Image */}
          <Reveal>
            <div className="relative">
              <ParallaxImage
                src="/demos/atelier/cape.webp"
                alt="Sévigné Ottoman-Wool Cape photographed on a plain studio ground"
                width={1100}
                height={1400}
                amount={48}
                className="aspect-[4/5] w-full"
              />
              <div className="absolute right-5 top-5 bg-[#F4F1EA] px-3 py-2 font-[family-name:var(--font-sev-mono)] text-[10px] uppercase tracking-[0.24em] text-[#9A7B44]">
                Édition limitée
              </div>
            </div>
          </Reveal>

          {/* Detail */}
          <div className="lg:pt-6">
            <Reveal>
              <Eyebrow tone="gold">Signature Outerwear</Eyebrow>
              <h2 className="mt-6 font-[family-name:var(--font-sev-serif)] text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1] tracking-[-0.02em] text-[#1A1512]">
                Sévigné Ottoman-Wool Cape
              </h2>
              <p className="mt-6 max-w-md font-[family-name:var(--font-sev-grotesk)] text-[15px] leading-relaxed text-[#4A413A]">
                A single, sweeping gesture of cloth. Cut on the round so it falls
                without a shoulder seam, the cape holds its architecture through
                the weight of the wool alone — warm, weightless, and quietly
                grand across the shoulders.
              </p>
            </Reveal>

            {/* material notes */}
            <Reveal delay={0.08}>
              <ul className="mt-10 divide-y divide-[#1A1512]/10 border-y border-[#1A1512]/10">
                {featuredNotes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-4 py-4 font-[family-name:var(--font-sev-grotesk)] text-[13.5px] text-[#4A413A]"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#E7C98A]"
                    />
                    {note}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* price + size */}
            <Reveal delay={0.14}>
              <div className="mt-10 flex items-end justify-between">
                <span className="font-[family-name:var(--font-sev-serif)] text-[2rem] leading-none text-[#1A1512]">
                  €1,340
                </span>
                <span className="font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[#8A7E6E]">
                  Taille française
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {featuredSizes.map((s) => {
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      aria-pressed={active}
                      className={clsx(
                        "h-11 w-11 rounded-full font-[family-name:var(--font-sev-mono)] text-[12px] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B44] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1EA]",
                        active
                          ? "bg-[#1A1512] text-[#F4F1EA]"
                          : "border border-[#1A1512]/20 text-[#4A413A] hover:border-[#1A1512]",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* add to bag */}
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={addToBag}
                  className="group inline-flex items-center gap-4 rounded-full bg-[#1A1512] py-3.5 pl-8 pr-3 text-[12px] uppercase tracking-[0.2em] text-[#F4F1EA] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B44] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1EA]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        Added to bag
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        Add to bag
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7C98A] text-[#1A1512] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90">
                    {added ? (
                      <Check className="h-4 w-4" strokeWidth={1.6} />
                    ) : (
                      <Plus className="h-4 w-4" strokeWidth={1.6} />
                    )}
                  </span>
                </button>
                <span className="font-[family-name:var(--font-sev-grotesk)] text-[12px] text-[#8A7E6E]">
                  Complimentary shipping &amp; atelier alterations
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
