import type { Metadata } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Grain } from "@/components/primitives/Grain";
import { en } from "@/lib/i18n/dict/en";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  keywords: [
    "digital product studio",
    "interface design",
    "frontend engineering",
    "web design",
    "app design",
    "brand and typography",
    "motion design",
    "Next.js studio",
  ],
  openGraph: {
    type: "website",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Grain />
      </body>
    </html>
  );
}
