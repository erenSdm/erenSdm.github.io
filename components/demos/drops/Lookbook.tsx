"use client";

import { Marquee, MAGENTA, Label } from "./ui";
import { imgUrl } from "./data";

export function Lookbook() {
  return (
    <section id="lookbook" className="relative border-b border-line">
      {/* kinetic banner */}
      <div
        className="border-b border-black/30 py-2.5 font-[family-name:var(--font-cad-display)] text-[clamp(1.6rem,3vw,2.4rem)] tracking-[0.03em] text-ink"
        style={{ background: MAGENTA }}
      >
        <Marquee
          items={["VOLTAGE LOOKBOOK", "SS26", "SHOT IN BERLIN", "MADE TO MOVE"]}
          sep="✦"
          duration="30s"
        />
      </div>

      {/* full-bleed editorial */}
      <div className="relative min-h-[440px] overflow-hidden lg:min-h-[560px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl("cad-lookbook-band", 2000, 1100)}
          alt="Voltage SS26 lookbook editorial"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />

        <div className="relative flex h-full min-h-[440px] flex-col justify-between p-5 md:p-10 lg:min-h-[560px]">
          <div className="flex items-start justify-between">
            <Label accent>Editorial 026</Label>
            <Label className="hidden sm:block">Berlin · 05:41</Label>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-cad-display)] leading-[0.8] tracking-[0.01em] text-paper">
              <span className="block text-[clamp(3rem,11vw,9rem)]">Run the</span>
              <span
                className="block text-[clamp(3rem,11vw,9rem)]"
                style={{ color: MAGENTA }}
              >
                whole city
              </span>
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="max-w-md font-[family-name:var(--font-cad-grotesk)] text-[13px] leading-relaxed text-bone">
                The Voltage capsule, worn hard across three districts before
                sunrise. Reflective hits, ripstop shells, magenta static
                throughout.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-paper/40 px-5 py-3 font-[family-name:var(--font-cad-mono)] text-[11px] uppercase tracking-[0.16em] text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                View lookbook →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
