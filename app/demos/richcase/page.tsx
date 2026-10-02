import type { Metadata } from "next";
import { RichcaseLanding } from "@/components/demos/richcase/RichcaseLanding";
import { body, display, mono, serif } from "@/components/demos/richcase/fonts";

export const metadata: Metadata = {
  title: "RichCase — Leave it to me!",
  description:
    "Binance hesabına bağla, kaldıraçlı kripto ticaret botunu aktifleştir ve kazanmaya başla. Binance Futures için otomatik kripto ticaret botu.",
};

export default function RichcaseDemoPage() {
  return (
    <div className={`${display.variable} ${serif.variable} ${body.variable} ${mono.variable}`}>
      <RichcaseLanding />
    </div>
  );
}
