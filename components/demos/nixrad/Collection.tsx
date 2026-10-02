"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import clsx from "clsx";
import { FILTERS, PRODUCTS, type Family, type Product } from "./data";
import { EASE, Reveal, SectionIndex } from "./ui";

function ProductCard({ p, i }: { p: Product; i: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.05 }}
      className="group"
    >
      <div className="rounded-[1.5rem] bg-[#151514]/[0.04] p-1 ring-1 ring-[#151514]/[0.07] md:p-1.5">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[calc(1.5rem-0.25rem)] bg-[#D9D5CD] md:rounded-[calc(1.5rem-0.375rem)]">
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-0"
          />
          <Image
            src={p.images[1]}
            alt=""
            aria-hidden
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="scale-[1.04] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-100 group-hover:opacity-100"
          />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#E9E6E0]/85 px-2.5 py-1 font-[family-name:var(--font-nx-mono)] text-[9px] uppercase tracking-[0.16em] text-[#151514] backdrop-blur md:left-3 md:top-3 md:text-[10px]">
            {String(i + 1).padStart(2, "0")}
          </span>
          {p.note && (
            <span className="absolute bottom-2.5 left-2.5 right-2.5 hidden rounded-full bg-[#151514]/70 px-3 py-1.5 text-center font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.14em] text-[#E9E6E0] backdrop-blur md:block">
              {p.note}
            </span>
          )}
        </div>
      </div>
      <div className="px-1 pt-3.5 md:px-1.5 md:pt-4">
        <p className="font-[family-name:var(--font-nx-mono)] text-[9.5px] uppercase leading-snug tracking-[0.14em] text-[#151514]/45 md:text-[10.5px]">
          {p.group}
        </p>
        <div className="mt-1.5 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-3">
          <h3 lang="en" className="font-[family-name:var(--font-nx-display)] text-[17px] font-semibold uppercase leading-[1.05] tracking-[-0.01em] [font-stretch:108%] md:text-[20px]">
            {p.name}
          </h3>
          <span className="shrink-0 text-[13px] tabular-nums text-[#151514]/80 md:text-[14px]">
            {p.price ?? <span className="text-[#151514]/50">Fiyat sorunuz</span>}
          </span>
        </div>
        <dl className="mt-3 hidden space-y-1 border-t border-[#151514]/10 pt-3 sm:block">
          {p.specs.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 text-[12px]">
              <dt className="text-[#151514]/45">{k}</dt>
              <dd className="text-right text-[#151514]/75">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[11.5px] leading-snug text-[#151514]/55 sm:hidden">{p.specs[0][1]}</p>
      </div>
    </motion.article>
  );
}

export function Collection() {
  const [filter, setFilter] = useState<"all" | Family>("all");
  const list = useMemo(
    () => (filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.family === filter)),
    [filter],
  );

  return (
    <section id="koleksiyon" className="bg-[#E9E6E0] pb-24 text-[#151514] md:pb-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <Reveal>
          <SectionIndex n="02" label="Koleksiyon" />
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.05}>
            <h2 className="max-w-[14ch] font-[family-name:var(--font-nx-display)] text-[clamp(2.2rem,6vw,5.2rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em] [font-stretch:110%]">
              Seçili modeller.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#151514]/60">
              Fiyatlar KDV dahil liste fiyatıdır; ölçü ve renge göre değişir. Tüm
              modeller istenen ölçüde özel üretilebilir.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <LayoutGroup>
              <div
                role="tablist"
                aria-label="Ürün filtresi"
                className="inline-flex rounded-full bg-[#151514]/[0.05] p-1 ring-1 ring-[#151514]/[0.08]"
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    role="tab"
                    aria-selected={filter === f.key}
                    onClick={() => setFilter(f.key)}
                    className={clsx(
                      "relative rounded-full px-3.5 py-2 text-[13px] transition-colors duration-500 md:px-5",
                      filter === f.key ? "text-[#E9E6E0]" : "text-[#151514]/60 hover:text-[#151514]",
                    )}
                  >
                    {filter === f.key && (
                      <motion.span
                        layoutId="nx-filter"
                        className="absolute inset-0 rounded-full bg-[#151514]"
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </Reveal>
        </div>

        <motion.div
          layout
          className="mt-12 grid grid-cols-2 gap-x-3 gap-y-9 md:mt-16 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
