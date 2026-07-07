import type { Metadata } from "next";
import { PulseScreen } from "@/components/demos/pulse/PulseScreen";

export const metadata: Metadata = {
  title: "PULSE — Activity",
  description:
    "PULSE — a mobile fitness today screen with animated activity rings, heart-rate telemetry, and streaks.",
};

export default function PulseDemoPage() {
  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-void px-4 py-6">
      {/* ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(255,107,61,0.10), transparent 60%), radial-gradient(50% 40% at 80% 100%, rgba(51,225,237,0.06), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-[0.35]"
      />

      {/* app column — sized like a device screen */}
      <div className="relative flex h-[min(880px,calc(100dvh-3rem))] w-full max-w-[430px] flex-col overflow-hidden rounded-[2.4rem] border border-white/10 bg-ink shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
        <PulseScreen />
      </div>
    </main>
  );
}
