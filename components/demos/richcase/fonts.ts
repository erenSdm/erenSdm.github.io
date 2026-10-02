import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

// Wide, heavy grotesk — the confident "Leave it to me" voice. Width axis lets us stretch it.
export const display = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-rc-display",
});

// Italic serif accent — used once per headline, never for body.
export const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-rc-serif",
});

// Interface + body copy.
export const body = Geist({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-rc-body",
});

// Prices, PnL, pairs — tabular data voice.
export const mono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-rc-mono",
});
