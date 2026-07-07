"use client";

import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { MetricsStrip } from "./MetricsStrip";
import { BentoGrid } from "./BentoGrid";
import { HowItWorks } from "./HowItWorks";
import { CodeShowcase } from "./CodeShowcase";
import { Pricing } from "./Pricing";
import { Footer } from "./Footer";

/* ================================================================== *
 * COBALT — developer-infrastructure landing.
 * Technical, dark, cyan (#22d3ee) used surgically. The code block is
 * the hero; every claim is backed by a benchmark.
 * ================================================================== */
export function CobaltLanding() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#050505] font-[family-name:var(--font-cbt-sans)] text-paper antialiased selection:bg-[#22d3ee] selection:text-[#04141a]">
      <Nav />
      <main>
        <Hero />
        <MetricsStrip />
        <BentoGrid />
        <HowItWorks />
        <CodeShowcase />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
