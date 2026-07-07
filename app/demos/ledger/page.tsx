import type { Metadata } from "next";
import { Archivo_Black } from "next/font/google";
import { LedgerLanding } from "@/components/demos/ledger/LedgerLanding";

// Heavy grotesk display face, scoped to this demo only.
const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEDGER — Move money like it's just data",
  description:
    "LEDGER is the multi-currency treasury account for cross-border businesses. Hold 190 currencies, convert at the mid-market rate, and settle in milliseconds.",
};

export default function LedgerDemoPage() {
  return (
    <div className={archivoBlack.variable}>
      <LedgerLanding />
    </div>
  );
}
