import { Bricolage_Grotesque, Geist, IBM_Plex_Mono } from "next/font/google";

// Venn's own display face — warm, slightly quirky grotesk with optical sizing.
export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-vn-display",
});

// Quiet body face (replaces the original Inter).
export const sans = Geist({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-vn-sans",
});

// Brand mono — labels, times, places.
export const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-vn-mono",
});
