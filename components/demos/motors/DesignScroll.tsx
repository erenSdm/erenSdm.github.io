"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FEATURES, heroImage } from "./data";
import { DISPLAY, MONO, Label } from "./ui";

function Band({
  feature,
  flip,
}: {
  feature: (typeof FEATURES)[number];
  flip: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div
      ref={ref}
      className="relative grid min-h-[62vh] grid-cols-1 items-stretch lg:grid-cols-2"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${flip ? "lg:order-2" : "lg:order-1"}`}
      >
        <motion.img
          // eslint-disable-next-line @next/next/no-img-element
          src={heroImage(feature.seed)}
          alt={feature.title}
          className="h-full min-h-[42vh] w-full object-cover"
          style={reduce ? undefined : { y, scale: 1.12 }}
        />
        <div className="absolute inset-0 bg-void/25" />
      </div>

      {/* Copy */}
      <div
        className={`flex flex-col justify-center bg-ink px-6 py-14 md:px-14 ${
          flip ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className={`${MONO} text-[11px] tracking-[0.2em] text-[#ffb800]`}>
            {feature.index}
          </span>
          <span className="h-px w-8 bg-line" />
          <Label>{feature.kicker}</Label>
        </div>
        <h3
          className={`${DISPLAY} mt-6 max-w-md font-medium uppercase leading-[0.92] tracking-[-0.01em] text-paper`}
          style={{ fontSize: "clamp(1.9rem, 3.4vw, 3rem)" }}
        >
          {feature.title}
        </h3>
        <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-ash">
          {feature.body}
        </p>
      </div>
    </div>
  );
}

export function DesignScroll() {
  return (
    <section className="relative border-t border-line bg-void">
      <div className="mx-auto max-w-[1500px] px-6 pt-24 md:px-10 md:pt-32">
        <Label accent>Design &amp; Feature</Label>
        <h2
          className={`${DISPLAY} mt-4 max-w-2xl font-medium uppercase leading-[0.9] tracking-[-0.01em] text-paper`}
          style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
        >
          Considered to the last seam
        </h2>
      </div>
      <div className="mt-16 flex flex-col gap-px border-y border-line bg-line">
        {FEATURES.map((f, i) => (
          <Band key={f.index} feature={f} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
