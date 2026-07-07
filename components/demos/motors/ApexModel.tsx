"use client";

import { ConfigProvider } from "./config";
import { GrainVignette } from "./ui";
import { TopBar } from "./TopBar";
import { Hero } from "./Hero";
import { SpecBand } from "./SpecBand";
import { Configurator } from "./Configurator";
import { DesignScroll } from "./DesignScroll";
import { ChargeCurve } from "./ChargeCurve";
import { SpecTable } from "./SpecTable";
import { ReserveFooter } from "./ReserveFooter";

export function ApexModel() {
  return (
    <ConfigProvider>
      <div className="relative min-h-[100dvh] w-full overflow-x-clip bg-void font-sans text-paper selection:bg-[#ffb800] selection:text-black">
        <GrainVignette />
        <TopBar />
        <main>
          <Hero />
          <SpecBand />
          <Configurator />
          <DesignScroll />
          <ChargeCurve />
          <SpecTable />
        </main>
        <ReserveFooter />
      </div>
    </ConfigProvider>
  );
}
