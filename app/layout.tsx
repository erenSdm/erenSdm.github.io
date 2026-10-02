import type { Metadata, Viewport } from "next";
import {
  Anton,
  Space_Grotesk,
  JetBrains_Mono,
  Lexend_Exa,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Grain } from "@/components/primitives/Grain";
import { en } from "@/lib/i18n/dict/en";

/* legacy faces — still used by several demo routes */
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
});

/* homepage system — wide geometric display (Avant Garde lineage) + Plex Mono */
const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: en.meta.title,
    template: "%s — MONOLITH",
  },
  description: en.meta.description,
  applicationName: "MONOLITH",
  keywords: [
    "digital product studio",
    "Istanbul design studio",
    "web design",
    "dashboard design",
    "e-commerce design",
    "landing page design",
    "mobile app design",
    "design systems",
    "Next.js studio",
    "dijital ürün stüdyosu",
    "web tasarım İstanbul",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "MONOLITH",
    title: en.meta.title,
    description: en.meta.description,
    locale: "en_US",
    alternateLocale: ["tr_TR"],
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: en.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${grotesk.variable} ${mono.variable} ${lexendExa.variable} ${plexMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Grain />
      </body>
    </html>
  );
}
