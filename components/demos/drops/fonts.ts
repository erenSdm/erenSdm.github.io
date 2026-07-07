import { Bebas_Neue, Space_Grotesk, Space_Mono } from "next/font/google";

// Ultra-condensed display — the loud drop voice.
export const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cad-display",
});

// Clean grotesk for body + interface.
export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cad-grotesk",
});

// Monospace — SKUs, prices, countdown telemetry.
export const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cad-mono",
});
