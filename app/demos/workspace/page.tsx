import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { HorizonApp } from "@/components/demos/workspace/HorizonApp";

const inter = Inter({
  variable: "--font-hzn-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-hzn-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HORIZON — Product Workspace",
  description:
    "HORIZON is the calm, dense command surface a product team lives in — Kanban board, cycle burndown, presence, and activity for the Nebula team's Cycle 24.",
};

export default function WorkspaceDemoPage() {
  return (
    <div className={`${inter.variable} ${jetbrains.variable} min-h-[100dvh] w-full`}>
      <HorizonApp />
    </div>
  );
}
