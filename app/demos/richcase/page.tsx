import type { Metadata } from "next";
import HeroScene from "@/components/demos/richcase/columnScene/HeroScene";
import Header from "@/components/demos/richcase/Header";
import WorkAndFeatures from "@/components/demos/richcase/WorkAndFeatures";
import Pricing from "@/components/demos/richcase/Pricing";
import TelegramInvite from "@/components/demos/richcase/TelegramInvite";
import Footer from "@/components/demos/richcase/Footer";
import ScrollOptimizer from "@/components/demos/richcase/ScrollOptimizer";
import "@/components/demos/richcase/richcase.css";

export const metadata: Metadata = {
    title: { absolute: "RichCase — Leave it to me!" },
    description: "Binance Futures için otomatik kripto ticaret botu. Hesabını bağla, kazancı izle.",
    icons: {
        icon: [
            { url: "/demos/richcase/rc-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/demos/richcase/rc-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [{ url: "/demos/richcase/rc-700x700.png", sizes: "180x180" }],
    },
};

const FONTSHARE_CSS =
    "https://api.fontshare.com/v2/css?f%5B%5D=satoshi@400,500,700,900&f%5B%5D=chillax@400,500,600,700&f%5B%5D=excon@600,700,800&display=swap";

export default function Home() {
    return (
        // data-lenis-prevent: the portfolio's global Lenis ignores wheel events
        // here so the original ScrollOptimizer drives scrolling, as in the source.
        <main lang="tr" className="rc-root relative w-full bg-ink-950" data-lenis-prevent>
            <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={FONTSHARE_CSS} precedence="default" />

            <ScrollOptimizer />
            <Header />

            {/* Hero — 3D sahne, normal akış (sticky-track kaldırıldı) */}
            <section className="relative md:h-screen md:min-h-[640px] w-full overflow-hidden">
                <HeroScene />
            </section>

            <WorkAndFeatures />
            <Pricing />
            <TelegramInvite />
            <Footer />
        </main>
    );
}
