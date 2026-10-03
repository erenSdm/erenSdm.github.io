"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MODEL, TRIAD, heroImage } from "./data";
import { DISPLAY, EASE, MONO, Label } from "./ui";

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: EASE, delay },
  });

  return (
    <section
      id="model"
      className="relative flex min-h-[100dvh] w-full flex-col justify-end overflow-hidden"
    >
      {/* Cinematic full-bleed shot */}
      <div className="absolute inset-0 z-0">
        <motion.img
          // eslint-disable-next-line @next/next/no-img-element
          src={heroImage("hero")}
          alt="APEX Solstice electric hypersedan, front three-quarter, low cinematic light"
          className="h-full w-full object-cover"
          initial={reduce ? false : { scale: 1.12, opacity: 0 }}
          animate={{ scale: 1.04, opacity: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
        />
        {/* grading + floor gradient to seat the type */}
        <div className="absolute inset-0 bg-void/30" />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-void via-void/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-void/70 to-transparent" />
      </div>

      {/* Top eyebrow row */}
      <motion.div
        {...rise(0.3)}
        className="absolute left-6 top-24 z-10 flex items-center gap-4 md:left-10"
      >
        <Label accent>New — 2026</Label>
        <span className="h-px w-8 bg-line" />
        <Label>{MODEL.designation}</Label>
      </motion.div>

      {/* Bottom content block */}
      <div className="relative z-10 px-6 pb-16 md:px-10 md:pb-20">
        <motion.div {...rise(0.4)} className="flex items-center gap-3">
          <span className={`${MONO} text-[12px] uppercase tracking-[0.4em] text-bone`}>
            {MODEL.marque}
          </span>
        </motion.div>

        {/* Giant model name */}
        <motion.h1
          {...rise(0.5)}
          className={`${DISPLAY} mt-1 font-medium uppercase leading-[0.82] tracking-[-0.01em] text-paper`}
          style={{ fontSize: "clamp(4rem, 15vw, 15rem)" }}
        >
          {MODEL.name}
        </motion.h1>

        {/* Poetic tagline */}
        <motion.p
          {...rise(0.68)}
          className="mt-5 max-w-md text-[15px] leading-relaxed tracking-[0.01em] text-bone md:text-[16px]"
        >
          {MODEL.tagline} A dual-motor electric flagship that turns a full charge
          into an unbroken horizon.
        </motion.p>

        {/* Spec triad */}
        <motion.dl
          {...rise(0.85)}
          className="mt-10 grid max-w-3xl grid-cols-3 gap-px overflow-hidden border-y border-line"
        >
          {TRIAD.map(({ k, v, unit }) => (
            <div key={k} className="bg-void/30 py-6 pr-6 first:pl-0">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`${DISPLAY} font-medium leading-none text-paper`}
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                >
                  {v}
                </span>
                <span className={`${MONO} text-[13px] lowercase tracking-[0.1em] text-[#ffb800]`}>
                  {unit}
                </span>
              </div>
              <dt className={`${MONO} mt-3 text-[10.5px] uppercase tracking-[0.24em] text-ash`}>
                {k}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll cue */}
      <motion.div
        {...rise(1.1)}
        className="absolute bottom-6 right-6 z-10 hidden items-center gap-3 md:right-10 md:flex"
      >
        <span className={`${MONO} text-[10px] uppercase tracking-[0.3em] text-ash`}>
          Scroll
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          className="text-ash"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  );
}
