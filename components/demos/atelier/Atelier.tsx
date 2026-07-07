"use client";

import { Eyebrow, ParallaxImage, PlateTag, Reveal } from "./ui";

const STATS: [string, string][] = [
  ["1978", "Founded, Paris"],
  ["3", "Ateliers, France"],
  ["40h", "Per signature piece"],
];

export function Atelier() {
  return (
    <section id="maison" className="relative bg-[#ECE6D9] py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12 lg:px-16">
        <Reveal className="border-t border-[#1A1512]/12 pt-8">
          <PlateTag index="03" label="La Maison" />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-12">
          {/* narrative */}
          <div className="lg:col-span-6 lg:pt-4">
            <Reveal>
              <Eyebrow tone="gold">Since 1978</Eyebrow>
              <h2 className="mt-6 font-[family-name:var(--font-sev-serif)] text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[0.98] tracking-[-0.02em] text-[#1A1512]">
                A house built on <span className="italic">patience.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 max-w-lg space-y-5 font-[family-name:var(--font-sev-grotesk)] text-[15px] leading-relaxed text-[#4A413A]">
                <p>
                  Hélène Sévigné opened a single room above the Rue Saint-Honoré
                  with two seamstresses and a rule she has never broken: nothing
                  leaves the atelier that could not be worn for twenty years.
                </p>
                <p>
                  Nearly five decades on, the house still cuts to order. Cloth is
                  chosen from mills we have worked with since the beginning —
                  Biella for wool, Lyon for silk — and every piece is finished by
                  the same hands that shaped it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-[#1A1512]/12 pt-8">
                {STATS.map(([n, l]) => (
                  <div key={l}>
                    <dt className="font-[family-name:var(--font-sev-serif)] text-[clamp(1.8rem,4vw,2.75rem)] leading-none text-[#1A1512]">
                      {n}
                    </dt>
                    <dd className="mt-3 font-[family-name:var(--font-sev-mono)] text-[10px] uppercase tracking-[0.2em] text-[#6F6456]">
                      {l}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.22}>
              <p className="mt-12 font-[family-name:var(--font-sev-serif)] text-[26px] italic leading-none text-[#9A7B44]">
                Hélène Sévigné
              </p>
            </Reveal>
          </div>

          {/* image, offset lower for zig-zag */}
          <Reveal className="lg:col-span-6 lg:mt-16" delay={0.1}>
            <div className="relative">
              <ParallaxImage
                src="https://picsum.photos/seed/sevigne-atelier-hands/1100/1360"
                alt="Hands finishing a garment seam inside the Sévigné atelier"
                width={1100}
                height={1360}
                amount={50}
                className="aspect-[4/5] w-full"
              />
              <div className="absolute -bottom-5 right-5 bg-[#ECE6D9] px-4 py-3 font-[family-name:var(--font-sev-mono)] text-[10px] uppercase tracking-[0.24em] text-[#9A7B44]">
                Atelier · Paris 1ᵉʳ
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
