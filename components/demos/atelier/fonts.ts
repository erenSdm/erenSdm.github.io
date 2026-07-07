import { Fraunces, Space_Grotesk, JetBrains_Mono } from "next/font/google";

// Variable high-contrast serif — carries the couture display voice.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sev-serif",
});

// Clean grotesk for body + interface.
export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sev-grotesk",
});

// Mono for atelier meta / captions.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sev-mono",
});
