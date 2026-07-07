"use client";

import { Eyebrow, ParallaxImage, Reveal } from "./ui";

export function Lookbook() {
  return (
    <section
      id="lookbook"
      className="relative isolate overflow-hidden bg-[#1A1512] py-32 md:py-48"
    >
      {/* full-bleed background image */}
      <ParallaxImage
        src="https://picsum.photos/seed/sevigne-lookbook-atelier/1900/1200"
        alt="Wide editorial lookbook photograph of the Sévigné Automne-Hiver 2026 silhouette"
        width={1900}
        height={1200}
        amount={70}
        className="absolute inset-0 -z-10 h-full w-full"
        imgClassName="opacity-45"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1A1512]/70 via-[#1A1512]/40 to-[#1A1512]/85"
      />

      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <Reveal>
          <Eyebrow tone="gold">Lookbook — A/H 2026</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote className="mt-10 max-w-[18ch] font-[family-name:var(--font-sev-serif)] text-[clamp(2.4rem,7vw,6rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[#F4F1EA]">
            We do not chase the season. We let it{" "}
            <span className="italic text-[#E7C98A]">settle</span>, thread by
            thread, until the cloth remembers the body.
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-14 flex items-center gap-4">
            <span className="h-px w-14 bg-[#E7C98A]/60" />
            <p className="font-[family-name:var(--font-sev-mono)] text-[11px] uppercase tracking-[0.26em] text-[#C9BFA9]">
              Hélène Sévigné · Directrice de la Création
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
