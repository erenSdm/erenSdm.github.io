import type { Metadata } from "next";
import { fraunces, grotesk, mono } from "@/components/demos/atelier/fonts";
import { FilmGrain } from "@/components/demos/atelier/ui";
import { TopBar } from "@/components/demos/atelier/TopBar";
import { Hero } from "@/components/demos/atelier/Hero";
import { Collection } from "@/components/demos/atelier/Collection";
import { Lookbook } from "@/components/demos/atelier/Lookbook";
import { Featured } from "@/components/demos/atelier/Featured";
import { Atelier } from "@/components/demos/atelier/Atelier";
import { FooterNewsletter } from "@/components/demos/atelier/FooterNewsletter";

export const metadata: Metadata = {
  title: "Sévigné — Maison de Couture, Paris",
  description:
    "Sévigné, Paris couture house since 1978. Automne-Hiver 2026, Collection XII — double-faced cashmere, hand-pleated silk, made to order.",
};

export default function AtelierDemoPage() {
  return (
    <div
      className={`${fraunces.variable} ${grotesk.variable} ${mono.variable} relative min-h-[100dvh] bg-[#F4F1EA] font-[family-name:var(--font-sev-grotesk)] text-[#1A1512] antialiased selection:bg-[#E7C98A] selection:text-[#1A1512]`}
    >
      <FilmGrain />
      <TopBar />
      <main>
        <Hero />
        <Collection />
        <Lookbook />
        <Featured />
        <Atelier />
      </main>
      <FooterNewsletter />
    </div>
  );
}
