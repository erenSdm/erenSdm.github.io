import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import { ApexModel } from "@/components/demos/motors/ApexModel";

const display = Oswald({
  variable: "--font-apx-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-apx-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "APEX Solstice — Electric Hypersedan",
  description:
    "The APEX Solstice. 1,020 hp, 0–100 km/h in 2.1 seconds, 724 km of WLTP range. A cinematic electric flagship — reserve now for $1,000.",
};

export default function Page() {
  return (
    <div
      className={`${display.variable} ${mono.variable} min-h-[100dvh] w-full bg-void text-paper antialiased`}
    >
      <ApexModel />
    </div>
  );
}
