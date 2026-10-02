import type { CSSProperties } from "react";
import { Hero } from "./Hero";
import { MoodPlanner } from "./Mood";
import { Business, Categories, Community, EarlyAccess, Faq, FinalCta, Footer, Manifesto, Showcase, Trust } from "./Sections";
import { FS } from "./primitives";

/* Venn brand tokens — dark "mürekkep" theme (lavender A, pine-teal B, marker yellow). */
const tokens = {
  "--vn-bg": "#110F18",
  "--vn-surface": "#18151F",
  "--vn-ink": "#170F26",
  "--vn-cream": "#F4EFE6",
  "--vn-muted": "rgba(244,239,230,0.62)",
  "--vn-faint": "rgba(244,239,230,0.38)",
  "--vn-line": "rgba(244,239,230,0.1)",
  "--vn-violet": "#A78BFA",
  "--vn-teal": "#45C1A2",
  "--vn-yellow": "#F2D15C",
} as CSSProperties;

export function VennLanding() {
  return (
    <div
      style={tokens}
      className={`${FS} relative min-h-[100svh] overflow-x-clip bg-[var(--vn-bg)] text-[var(--vn-cream)] antialiased selection:bg-[var(--vn-violet)] selection:text-[var(--vn-ink)] [scroll-behavior:smooth]`}
    >
      <a
        href="#main"
        className="sr-only z-40 rounded-full bg-[var(--vn-cream)] px-4 py-2 text-[var(--vn-ink)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        İçeriğe geç
      </a>
      <Hero />
      <main id="main">
        <EarlyAccess />
        <MoodPlanner />
        <Showcase />
        <Manifesto />
        <Categories />
        <Trust />
        <Community />
        <Business />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
