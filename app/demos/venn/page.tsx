import type { Metadata } from "next";
import { display, sans, mono } from "@/components/demos/venn/fonts";
import { VennLanding } from "@/components/demos/venn/VennLanding";

export const metadata: Metadata = {
  title: "Venn — Canın ne isterse, birlikte yapacak birileri var",
  description:
    "Venn, grup ve etkinlik odaklı sakin bir sosyal bağlantı uygulaması. Moduna göre seç, yakınındaki gruba katıl, gerçek hayatta buluş. Reklamsız, takipsiz; algoritma önerir, karar senden.",
  openGraph: {
    title: "Venn — Grup ve etkinlik odaklı sosyal bağlantı",
    description:
      "Kahveden gece yürüyüşüne, workshoptan maça: moduna göre seç, yakınındaki gruba katıl.",
    locale: "tr_TR",
    images: ["/demos/venn/venn-logo.png"],
  },
};

export default function VennDemoPage() {
  return (
    <div
      lang="tr"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <VennLanding />
    </div>
  );
}
