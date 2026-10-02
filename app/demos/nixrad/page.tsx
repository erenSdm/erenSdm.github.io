import type { Metadata } from "next";
import { archivo, instrument, plexMono } from "@/components/demos/nixrad/fonts";
import { TopBar } from "@/components/demos/nixrad/TopBar";
import { Hero } from "@/components/demos/nixrad/Hero";
import { Categories } from "@/components/demos/nixrad/Categories";
import { Collection } from "@/components/demos/nixrad/Collection";
import { Spotlight, Technology, Contact, Footer } from "@/components/demos/nixrad/Sections";

export const metadata: Metadata = {
  title: "Nixrad — Dekoratif Radyatör & Havlupan",
  description:
    "Nixrad dekoratif çelik ve hibrit radyatörler, havlupanlar. İstenen ölçü ve renkte üretim, 10 yıl garanti, 50 bar test.",
};

export default function NixradDemoPage() {
  return (
    <div
      lang="tr"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} relative min-h-[100dvh] overflow-x-clip bg-[#E9E6E0] font-[family-name:var(--font-nx-sans)] text-[#151514] antialiased selection:bg-[#C4622D] selection:text-[#151514]`}
    >
      <TopBar />
      <main>
        <Hero />
        <Categories />
        <Collection />
        <Spotlight />
        <Technology />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
