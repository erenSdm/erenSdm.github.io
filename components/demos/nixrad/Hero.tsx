"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE, Eyebrow, PillButton } from "./ui";

const FACTS: [string, string][] = [
  ["10 yıl", "Garanti"],
  ["50 bar", "Basınç testi"],
  ["TSE · CE", "Belgeli üretim"],
  ["Özel", "Ölçü ve renk"],
];

const line = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.1, ease: EASE, delay: 0.15 + i * 0.09 } }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden bg-[#151514] text-[#E9E6E0]"
    >
      {/* subtle wall light */}
      <div className="pointer-events-none absolute -left-1/4 top-0 h-[70%] w-[90%] rotate-[-12deg] bg-[radial-gradient(closest-side,rgba(233,230,224,0.08),transparent)]" />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 pb-10 pt-28 md:px-10 md:pt-36 lg:min-h-[100dvh] lg:grid-cols-12 lg:gap-8 lg:px-14 lg:pb-14">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <Eyebrow tone="light">Dekoratif radyatör &amp; havlupan</Eyebrow>
            </motion.div>

            <h1 className="mt-7 font-[family-name:var(--font-nx-display)] text-[clamp(3.1rem,14.5vw,10.5rem)] font-semibold uppercase leading-[0.8] lg:text-[min(8.2vw,9.5rem)] tracking-[-0.035em] [font-stretch:112%]">
              {["Isının", "mimarisi."].map((w, i) => (
                <span key={w} className="block overflow-hidden pb-[0.04em] pt-[0.1em]">
                  <motion.span
                    className={i === 1 ? "block text-[#E9E6E0]/40" : "block"}
                    variants={line}
                    initial={reduce ? false : "hidden"}
                    animate="show"
                    custom={i}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
              className="mt-8 max-w-[34rem] text-[16px] leading-[1.6] text-[#E9E6E0]/65 md:text-[18px]"
            >
              Çelik ve hibrit gövdeler, duvara asılan bir heykel gibi tasarlanır.
              Nixrad; dekoratif radyatörleri ve havlupanları istediğiniz ölçü ve
              renkte, Kocaeli&apos;de üretir.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <PillButton href="#koleksiyon" tone="light">
                Koleksiyonu keşfet
              </PillButton>
              <a
                href="#satis"
                className="rounded-full px-5 py-3 text-[14px] text-[#E9E6E0]/75 ring-1 ring-[#E9E6E0]/15 transition-colors duration-500 hover:bg-white/[0.06] hover:text-[#E9E6E0]"
              >
                Satış noktası bul
              </a>
            </motion.div>
          </div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.75 }}
            className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 md:grid-cols-4 lg:mt-0"
          >
            {FACTS.map(([v, l]) => (
              <div key={l} className="bg-[#151514] px-4 py-4">
                <dt className="font-[family-name:var(--font-nx-display)] text-[19px] font-medium tracking-[-0.01em] [font-stretch:110%]">
                  {v}
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.18em] text-[#E9E6E0]/45">
                  {l}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          className="relative lg:col-span-5"
        >
          <div className="rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-0.375rem)] lg:aspect-auto lg:h-[calc(100dvh-13rem)] lg:min-h-[560px]">
              <motion.div style={{ y: imgY }} className="absolute inset-[-6%_0_-6%_0]">
                <Image
                  src="/demos/nixrad/monolith-3.webp"
                  alt="Monolith çelik dekoratif radyatör, gri duvarda"
                  fill
                  priority
                  sizes="(min-width:1024px) 40vw, 100vw"
                  className="object-cover object-[50%_45%]"
                />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
              <figcaption className="absolute inset-x-4 bottom-4 flex items-end justify-between font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.2em] text-white/80">
                <span>
                  Monolith 1200
                  <br />
                  <span className="text-white/50">Tamamen çelik</span>
                </span>
                <span className="rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-md">Platin Krom · Siyah · Antrasit</span>
              </figcaption>
            </div>
          </div>
        </motion.figure>
      </div>
      <div id="nx-hero-sentinel" className="absolute left-0 top-[85vh] h-px w-px" />
    </section>
  );
}
