import { Bricolage_Grotesque, Geist } from "next/font/google";

/** Condensed race-bib numerals: Bricolage at wdth 75 / opsz 96. */
export const numerals = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  variable: "--pulse-num",
  display: "swap",
});

/** Interface face. */
export const ui = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--pulse-ui",
  display: "swap",
});
