import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CobaltLanding } from "@/components/demos/platform/CobaltLanding";

const sans = Inter({
  variable: "--font-cbt-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-cbt-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "COBALT — The edge platform engineers deploy to",
  description:
    "COBALT runs your code across a global edge network with a type-safe SDK, instant rollbacks, autoscaling to zero, and observability wired in. Ship to production in milliseconds.",
};

export default function PlatformDemoPage() {
  return (
    <div className={`${sans.variable} ${mono.variable}`}>
      <CobaltLanding />
    </div>
  );
}
