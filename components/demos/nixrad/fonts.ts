import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";

// Variable grotesk with a width axis — set expanded for architectural display type.
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-nx-display",
});

// Body + interface.
export const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-nx-sans",
});

// Spec sheets, stock codes, dimensions.
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-nx-mono",
});
