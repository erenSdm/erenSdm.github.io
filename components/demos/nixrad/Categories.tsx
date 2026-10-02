"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionIndex } from "./ui";

const CATS = [
  {
    no: "A",
    title: "Radyatörler",
    lede: "Dekoratif çelik, hibrit ve aynalı seriler. Salonda bir obje, koridorda bir çizgi.",
    groups: ["Dekoratif Çelik", "Dekoratif Hibrit", "Aynalı", "Özel Tasarım", "Elektrikli Hibrit"],
    series: "Akasya · Nirvana · Prag · Zeus · Floransa · Monolith",
    img: "/demos/nixrad/akasya-2.webp",
    alt: "Akasya çelik dekoratif radyatör",
  },
  {
    no: "B",
    title: "Havlupanlar",
    lede: "Banyoyu gerçekten ısıtan, havluyu kurutan, duvarda sanat gibi duran havlupanlar.",
    groups: ["Hibrit Dekoratif", "Paslanmaz Çelik", "Elektrikli"],
    series: "Kumbaros · Saros · Falez · Lia",
    img: "/demos/nixrad/kumbaros-2.webp",
    alt: "Kumbaros hibrit dekoratif havlupan",
  },
];

export function Categories() {
  return (
    <section id="kategoriler" className="bg-[#E9E6E0] py-24 text-[#151514] md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <Reveal>
          <SectionIndex n="01" label="Kategoriler" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-10 max-w-[16ch] font-[family-name:var(--font-nx-display)] text-[clamp(2.2rem,6vw,5.2rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em] [font-stretch:110%]">
            İki aile, tek bir disiplin.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          {CATS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <a
                href="#koleksiyon"
                className="group block rounded-[2rem] bg-[#151514]/[0.04] p-1.5 ring-1 ring-[#151514]/[0.07]"
              >
                <div className="overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[#F4F2EE] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <div className="relative aspect-[5/4] overflow-hidden md:aspect-[4/3]">
                    <Image
                      src={c.img}
                      alt={c.alt}
                      fill
                      sizes="(min-width:768px) 50vw, 100vw"
                      className="object-cover object-[50%_40%] transition-transform duration-[1400ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#E9E6E0]/85 font-[family-name:var(--font-nx-mono)] text-[12px] backdrop-blur">
                      {c.no}
                    </span>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="min-w-0 font-[family-name:var(--font-nx-display)] text-[clamp(1.6rem,7.4vw,2.75rem)] font-semibold uppercase leading-none tracking-[-0.02em] [font-stretch:112%]">
                        {c.title}
                      </h3>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#151514] text-[#E9E6E0] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
                      </span>
                    </div>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#151514]/65">{c.lede}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {c.groups.map((g) => (
                        <li
                          key={g}
                          className="rounded-full px-3 py-1.5 text-[12px] text-[#151514]/70 ring-1 ring-[#151514]/12"
                        >
                          {g}
                        </li>
                      ))}
                    </ul>
                    <p lang="en" className="mt-6 border-t border-[#151514]/10 pt-4 font-[family-name:var(--font-nx-mono)] text-[11px] uppercase tracking-[0.16em] text-[#151514]/45">
                      {c.series}
                    </p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
