import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

/** Display face: optical-size grotesque with a little swagger for titles. */
export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--wv-display",
  display: "swap",
  axes: ["opsz", "wdth"],
});

/** UI / body face: quiet, slightly condensed-capable sans. */
export const body = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--wv-body",
  display: "swap",
  axes: ["wdth"],
});
