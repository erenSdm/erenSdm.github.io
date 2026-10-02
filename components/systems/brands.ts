import {
  siBinance,
  siClaude,
  siGmail,
  siGoogledrive,
  siGooglesheets,
  siHubspot,
  siInstagram,
  siMeta,
  siNotion,
  siShopify,
  siStripe,
  siTelegram,
  siWhatsapp,
} from "simple-icons";

/**
 * Real logos come from simple-icons (24×24 paths). Services without an
 * official mark there get a wordmark tile in their brand colour instead.
 */
export interface Brand {
  name: string;
  /** tile background */
  bg: string;
  /** mark colour on the tile */
  fg: string;
  path?: string;
  wordmark?: string;
  /** particle colour for traffic that comes from this service */
  tint: string;
}

const mark = (icon: { title: string; path: string; hex: string }, fg = "#ffffff", bg = `#${icon.hex}`): Brand => ({
  name: icon.title,
  bg,
  fg,
  path: icon.path,
  tint: `#${icon.hex}`,
});

export const BRANDS = {
  binance: mark(siBinance, "#0c0d0b"),
  telegram: mark(siTelegram),
  whatsapp: mark(siWhatsapp),
  instagram: { ...mark(siInstagram), bg: "linear-gradient(45deg,#f9a825 0%,#ff0069 50%,#7638fa 100%)" },
  meta: mark(siMeta),
  shopify: mark(siShopify),
  hubspot: mark(siHubspot),
  notion: { ...mark(siNotion, "#0c0d0b", "#f4f4ef"), tint: "#f4f4ef" },
  googledrive: mark(siGoogledrive),
  googlesheets: mark(siGooglesheets),
  gmail: mark(siGmail),
  claude: mark(siClaude),
  stripe: mark(siStripe),
  woocommerce: { name: "WooCommerce", bg: "#7f54b3", fg: "#ffffff", wordmark: "woo", tint: "#96588a" },
  trendyol: { name: "Trendyol", bg: "#f27a1a", fg: "#ffffff", wordmark: "ty", tint: "#f27a1a" },
  yurtici: { name: "Yurtiçi Kargo", bg: "#1d3f94", fg: "#ffd200", wordmark: "YK", tint: "#ffd200" },
  gib: { name: "GİB e-Fatura", bg: "#f4f4ef", fg: "#b3121b", wordmark: "GİB", tint: "#f4f4ef" },
} satisfies Record<string, Brand>;

export type BrandKey = keyof typeof BRANDS;
