"use client";

import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Steps } from "./Steps";
import { Pricing } from "./Pricing";
import { Community, Footer } from "./Closing";
import { fBody } from "./ui";

/* ================================================================== *
 * RICHCASE — automated Binance Futures trading bot (TR landing).
 * Ink + gold (R) + silver (C). Copy ported from rc-platform/frontend-landing.
 * ================================================================== */
export function RichcaseLanding() {
  return (
    <div
      lang="tr"
      className={`${fBody} relative min-h-[100dvh] w-full overflow-x-clip bg-[#0a0a0a] text-white antialiased selection:bg-[#D4AF37] selection:text-[#0a0a0a]`}
    >
      <style>{`
        @keyframes rc-marquee { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        .rc-marquee { animation: rc-marquee 38s linear infinite; }
        html { scroll-behavior: smooth; }
      `}</style>
      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <Nav />
      <main>
        <Hero />
        <Steps />
        <Pricing />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
