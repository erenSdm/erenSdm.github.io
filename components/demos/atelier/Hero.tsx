"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowButton, EASE, Eyebrow, ParallaxImage } from "./ui";

export function Hero() {
  const reduce = useReducedMotion();

  const line = {
    hidden: reduce ? {} : { opacity: 0, y: "0.4em" },
    show: (i: number) => ({
      opacity: 1,
      y: "0em",
      transition: { duration: 1.1, ease: EASE, delay: 0.15 + i * 0.12 },
    }),
  };

  return (
    <section id="top" className="relative pt-32 md:pt-40">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-y-14 px-6 md:px-12 lg:grid-cols-12 lg:gap-x-12 lg:px-16">
        {/* Left — editorial type */}
        <div className="lg:col-span-6 lg:pt-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Eyebrow tone="gold">Automne · Hiver 2026 — Collection XII</Eyebrow>
          </motion.div>

          <h1 className="mt-8 font-[family-name:var(--font-sev-serif)] text-[clamp(3rem,8.5vw,7rem)] font-normal leading-[0.94] tracking-[-0.02em] text-[#1A1512]">
            {["The unhurried", "elegance of a"].map((t, i) => (
              <motion.span
                key={t}
                custom={i}
                variants={line}
                initial="hidden"
                animate="show"
                className="block overflow-hidden"
              >
                {t}
              </motion.span>
            ))}
            <motion.span
              custom={2}
              variants={line}
              initial="hidden"
              animate="show"
              className="block overflow-hidden italic text-[#9A7B44]"
            >
              Paris winter.
            </motion.span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
            className="mt-9 max-w-md font-[family-name:var(--font-sev-grotesk)] text-[15px] leading-relaxed text-[#4A413A]"
          >
            Sévigné dresses the season in double-faced cashmere, hand-pleated
            silk, and tailoring measured to the millimetre — cut and finished in
            our Rue Saint-Honoré atelier.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.72 }}
            className="mt-11 flex flex-wrap items-center gap-6"
          >
            <ArrowButton href="#collection">Discover Collection XII</ArrowButton>
            <a
              href="#maison"
              className="group inline-flex items-center gap-2 font-[family-name:var(--font-sev-grotesk)] text-[12px] uppercase tracking-[0.2em] text-[#1A1512]"
            >
              Book an atelier fitting
              <span className="block h-px w-8 bg-[#9A7B44] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-12" />
            </a>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
            className="mt-16 flex flex-wrap gap-x-12 gap-y-4 border-t border-[#1A1512]/10 pt-7 font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase tracking-[0.24em] text-[#6F6456]"
          >
            {[
              ["Maison", "since 1978"],
              ["Atelier", "Paris 1ᵉʳ"],
              ["Pieces", "made to order"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[#B4A98F]">{k}</dt>
                <dd className="mt-1 text-[#1A1512]">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right — primary editorial image */}
        <div className="relative lg:col-span-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
            className="relative"
          >
            <ParallaxImage
              src="https://picsum.photos/seed/sevigne-hero-portrait/1100/1500"
              alt="Model in a tailored Sévigné winter coat, photographed for the Automne-Hiver 2026 campaign"
              width={1100}
              height={1500}
              amount={54}
              className="aspect-[4/5] w-full md:aspect-[5/6]"
            />
            {/* Caption plate */}
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 bg-[#F4F1EA] px-4 py-3 md:-left-6">
              <span className="font-[family-name:var(--font-sev-mono)] text-[10px] uppercase tracking-[0.28em] text-[#9A7B44]">
                Fig. 01
              </span>
              <span className="font-[family-name:var(--font-sev-grotesk)] text-[11px] tracking-[0.06em] text-[#4A413A]">
                Vendôme coat, worn open
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
