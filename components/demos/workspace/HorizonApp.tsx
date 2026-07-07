"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CycleStrip } from "./CycleStrip";
import { Board } from "./Board";
import { ActivityRail } from "./ActivityRail";

export function HorizonApp() {
  return (
    <div
      className="flex min-h-[100dvh] w-full bg-[#0a0a0b] text-[#f4f4ef] antialiased selection:bg-[#6366f1] selection:text-white"
      style={{ fontFamily: "var(--font-hzn-sans)" }}
    >
      {/* left sidebar */}
      <div className="hidden w-[240px] shrink-0 md:block">
        <Sidebar />
      </div>

      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <CycleStrip />
        <div className="flex min-h-0 flex-1">
          <main className="flex min-w-0 flex-1 flex-col bg-[#0a0a0b]">
            <Board focusId="HZN-214" />
          </main>
          {/* right activity rail */}
          <div className="hidden lg:block">
            <ActivityRail />
          </div>
        </div>
      </div>
    </div>
  );
}
