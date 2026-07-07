"use client";

import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { collection, type Garment } from "./data";
import { Eyebrow, ParallaxImage, PlateTag, Reveal } from "./ui";

function ProductCard({
  item,
  aspect,
  className,
}: {
  item: Garment;
  aspect: string;
  className?: string;
}) {
  return (
    <Reveal className={clsx("group", className)}>
      <a
        href="#featured"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B44] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4F1EA]"
      >
        <div className="relative overflow-hidden">
          <ParallaxImage
            src={`https://picsum.photos/seed/${item.seed}/${item.w}/${item.h}`}
            alt={`${item.name} — ${item.category}, Sévigné Collection XII`}
            width={item.w}
            height={item.h}
            amount={34}
            className={clsx("w-full", aspect)}
          />
          {/* hover veil */}
          <div className="pointer-events-none absolute inset-0 bg-[#1A1512]/0 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[#1A1512]/10" />
          {/* reveal bar */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-[#F4F1EA] px-5 py-4 opacity-0 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase tracking-[0.24em] text-[#4A413A]">
              View piece
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#9A7B44]" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-sev-mono)] text-[10px] uppercase tracking-[0.24em] text-[#9A7B44]">
              {item.category}
            </p>
            <h3 className="mt-2 max-w-[15ch] font-[family-name:var(--font-sev-serif)] text-[20px] leading-[1.15] text-[#1A1512] md:text-[22px]">
              {item.name}
            </h3>
          </div>
          <span className="shrink-0 font-[family-name:var(--font-sev-grotesk)] text-[15px] tracking-[0.02em] text-[#1A1512]">
            {item.price}
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export function Collection() {
  const [a, b, c, d, e] = collection;

  return (
    <section id="collection" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12 lg:px-16">
        {/* section head */}
        <Reveal className="flex flex-col gap-6 border-t border-[#1A1512]/12 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <PlateTag index="01" label="La Collection" />
            <h2 className="mt-6 max-w-[16ch] font-[family-name:var(--font-sev-serif)] text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[0.98] tracking-[-0.02em] text-[#1A1512]">
              Five pieces for the <span className="italic">long dusk</span> of the year.
            </h2>
          </div>
          <p className="max-w-xs font-[family-name:var(--font-sev-grotesk)] text-[14px] leading-relaxed text-[#4A413A]">
            A tightly edited wardrobe — no more than a house can finish by hand
            in a season. Each piece is numbered and cut to order.
          </p>
        </Reveal>

        {/* asymmetric zig-zag grid */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-12 md:gap-y-24">
          <ProductCard
            item={a}
            aspect="aspect-[4/5]"
            className="md:col-span-7"
          />
          <ProductCard
            item={b}
            aspect="aspect-[5/6]"
            className="md:col-span-5 md:mt-36"
          />

          {/* editorial interstitial */}
          <Reveal className="flex flex-col justify-center md:col-span-4 md:mt-6">
            <Eyebrow tone="taupe">Notes de l&apos;atelier</Eyebrow>
            <p className="mt-6 font-[family-name:var(--font-sev-serif)] text-[22px] italic leading-snug text-[#1A1512]">
              &ldquo;We cut for the way a body moves through cold air — never for
              the hanger.&rdquo;
            </p>
            <p className="mt-6 font-[family-name:var(--font-sev-mono)] text-[10.5px] uppercase tracking-[0.24em] text-[#8A7E6E]">
              — Hélène Sévigné, Directrice
            </p>
          </Reveal>

          <ProductCard
            item={c}
            aspect="aspect-[3/4]"
            className="md:col-span-4"
          />
          <ProductCard
            item={d}
            aspect="aspect-[4/5]"
            className="md:col-span-4 md:mt-28"
          />

          {/* full width feature-ish last item, offset */}
          <ProductCard
            item={e}
            aspect="aspect-[3/4]"
            className="md:col-span-6 md:col-start-4 md:mt-6"
          />
        </div>
      </div>
    </section>
  );
}
