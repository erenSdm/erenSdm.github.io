import type { Metadata } from "next";
import { Archivo_Black } from "next/font/google";
import { Vanta } from "@/components/demos/agency/Vanta";

const archivo = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VANTA — Independent Brand Studio",
  description:
    "VANTA is an independent brand studio. We build identities loud enough to be remembered and sharp enough to be trusted.",
};

export default function AgencyDemoPage() {
  return (
    <div className={archivo.variable}>
      <Vanta />
    </div>
  );
}
