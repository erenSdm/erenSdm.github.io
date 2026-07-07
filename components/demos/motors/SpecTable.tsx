"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { SPEC_TABLE } from "./data";
import { DISPLAY, EASE, MONO, Label, Reveal } from "./ui";

export function SpecTable() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(SPEC_TABLE[0].group);

  return (
    <section className="relative border-t border-line bg-void">
      <div className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-14">
          <Label accent>Full specification</Label>
          <h2
            className={`${DISPLAY} mt-4 font-medium uppercase leading-[0.9] tracking-[-0.01em] text-paper`}
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
          >
            Every number
          </h2>
        </Reveal>

        <div className="border-t border-line">
          {SPEC_TABLE.map((section) => {
            const isOpen = open === section.group;
            return (
              <div key={section.group} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : section.group)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300 hover:bg-ink/40"
                >
                  <span
                    className={`${DISPLAY} font-medium uppercase tracking-[0.01em] text-paper`}
                    style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)" }}
                  >
                    {section.group}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mr-1 text-[#ffb800]"
                  >
                    <Plus className="h-6 w-6" strokeWidth={1.5} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <dl className="grid grid-cols-1 gap-x-12 pb-8 md:grid-cols-2">
                        {section.rows.map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-center justify-between border-t border-line-soft py-3.5"
                          >
                            <dt className={`${MONO} text-[11px] uppercase tracking-[0.16em] text-ash`}>
                              {k}
                            </dt>
                            <dd className="text-right text-[14px] tracking-[0.01em] text-paper">
                              {v}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
