import type { Metadata } from "next";
import { display, grotesk, mono } from "@/components/demos/drops/fonts";
import { CadenceStore } from "@/components/demos/drops/CadenceStore";

export const metadata: Metadata = {
  title: "CADENCE — SS26 Voltage Drop",
  description:
    "CADENCE — Berlin streetwear label. SS26 Voltage drop, Friday 18:00 CET. 400 numbered pairs, one per customer, no restock. Cop it before the timer hits zero.",
};

export default function DropsDemoPage() {
  return (
    <div
      className={`${display.variable} ${grotesk.variable} ${mono.variable} font-[family-name:var(--font-cad-grotesk)]`}
    >
      <CadenceStore />
    </div>
  );
}
