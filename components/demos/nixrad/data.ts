/**
 * Trimmed, hand-curated subset of the real Nixrad catalogue
 * (source: nixrad/products.json + nixrad/site/index.html).
 * Prices are the published VAT-inclusive list prices; specs are taken
 * from the product variants — nothing here is invented.
 */

export type Family = "radyator" | "aynali" | "havlupan";

export interface Product {
  id: string;
  name: string;
  series: string;
  group: string;
  family: Family;
  price?: string; // VAT-inclusive list price
  specs: [string, string][];
  images: [string, string];
  note?: string;
}

const img = (n: string) => `/demos/nixrad/${n}.webp`;

export const PRODUCTS: Product[] = [
  {
    id: "monolith",
    name: "Monolith 1200",
    series: "Monolith",
    group: "Özel Tasarım Radyatör",
    family: "radyator",
    price: "₺51.336",
    specs: [
      ["Genişlik", "570–930 mm"],
      ["Dilim", "10–16"],
      ["Renk", "Platin Krom · Siyah · Antrasit"],
    ],
    images: [img("monolith-1"), img("monolith-2")],
    note: "10 yıl garanti",
  },
  {
    id: "zeus",
    name: "Zeus 3+3 Aynalı",
    series: "Zeus",
    group: "Çelik Aynalı Radyatör",
    family: "aynali",
    price: "₺25.914",
    specs: [
      ["Ölçü", "1500 · 1600 · 1800 × 620"],
      ["Renk", "Antrasit · Siyah · Beyaz"],
    ],
    images: [img("zeus-1"), img("zeus-2")],
  },
  {
    id: "floransa",
    name: "Floransa 3+3 Aynalı",
    series: "Floransa",
    group: "Hibrit Aynalı Radyatör",
    family: "aynali",
    price: "₺28.378",
    specs: [
      ["Ölçü", "1500 · 1600 · 1800 × 780"],
      ["Renk", "Antrasit · Beyaz · Siyah"],
    ],
    images: [img("floransa-1"), img("floransa-2")],
  },
  {
    id: "nirvana",
    name: "Nirvana 1800",
    series: "Nirvana",
    group: "Dekoratif Hibrit Radyatör",
    family: "radyator",
    price: "₺10.008",
    specs: [
      ["Genişlik", "310–630 mm"],
      ["Dilim", "4–8"],
      ["Renk", "Beyaz · Antrasit · Siyah"],
    ],
    images: [img("nirvana-1"), img("nirvana-2")],
    note: "1638 W/m · TSE (Δt=60)",
  },
  {
    id: "akasya",
    name: "Akasya 1800",
    series: "Akasya",
    group: "Dekoratif Çelik Radyatör",
    family: "radyator",
    price: "₺20.640",
    specs: [
      ["Genişlik", "390–810 mm"],
      ["Dilim", "7–14"],
      ["Renk", "Siyah · Beyaz · Antrasit"],
    ],
    images: [img("akasya-1"), img("akasya-2")],
  },
  {
    id: "kumbaros",
    name: "Kumbaros 1200",
    series: "Kumbaros",
    group: "Hibrit Dekoratif Havlupan",
    family: "havlupan",
    price: "₺13.179",
    specs: [
      ["Genişlik", "400 · 500 · 600 mm"],
      ["Renk", "Beyaz · Siyah · Antrasit"],
    ],
    images: [img("kumbaros-1"), img("kumbaros-2")],
    note: "5 yıl garanti",
  },
  {
    id: "dualis",
    name: "Dualis 1200",
    series: "Dualis",
    group: "Dekoratif Çelik Radyatör",
    family: "radyator",
    specs: [
      ["Malzeme", "Çelik"],
      ["Üretim", "İstenen ölçü ve renkte"],
    ],
    images: [img("dualis-1"), img("dualis-2")],
  },
  {
    id: "saros",
    name: "Saros 500/1200",
    series: "Saros",
    group: "Hibrit Alüminyum & Çelik Havlupan",
    family: "havlupan",
    price: "₺21.276",
    specs: [
      ["Ölçü", "500 × 1200 mm"],
      ["Dilim", "12"],
      ["Renk", "Antrasit · Beyaz · Mat Platin Krom"],
    ],
    images: [img("saros-1"), img("saros-2")],
  },
  {
    id: "prag",
    name: "Prag 600",
    series: "Prag",
    group: "Dekoratif Hibrit Radyatör",
    family: "radyator",
    price: "₺6.840",
    specs: [
      ["Genişlik", "470–1590 mm"],
      ["Dilim", "6–20"],
    ],
    images: [img("prag-1"), img("prag-2")],
  },
  {
    id: "falez",
    name: "Falez 800",
    series: "Falez",
    group: "Paslanmaz Çelik Havlupan",
    family: "havlupan",
    price: "₺16.261",
    specs: [
      ["Genişlik", "480 mm"],
      ["Yüzey", "Siyah seramik"],
    ],
    images: [img("falez-1"), img("falez-2")],
  },
  {
    id: "harmonia",
    name: "Harmonia",
    series: "Harmonia",
    group: "Dekoratif Çelik Radyatör",
    family: "radyator",
    specs: [
      ["Malzeme", "Çelik"],
      ["Renk", "Farklı renk seçenekleri"],
    ],
    images: [img("harmonia-2"), img("harmonia-1")],
  },
  {
    id: "lia",
    name: "Lia 800",
    series: "Lia",
    group: "Paslanmaz Çelik Havlupan",
    family: "havlupan",
    specs: [
      ["Malzeme", "Paslanmaz çelik"],
      ["Renk", "Siyah"],
    ],
    images: [img("lia-1"), img("lia-2")],
  },
];

export const FILTERS: { key: "all" | Family; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "radyator", label: "Radyatör" },
  { key: "aynali", label: "Aynalı" },
  { key: "havlupan", label: "Havlupan" },
];

/* Claims lifted from the Nirvana / Monolith / Kumbaros product copy. */
export const PROOF: { value: string; unit: string; label: string }[] = [
  { value: "10", unit: "yıl", label: "Garanti — çelik serilerde" },
  { value: "50", unit: "bar", label: "Basınç testi, her üründe" },
  { value: "%33", unit: "", label: "Muadillerine göre daha fazla ısıl yayılım (Nirvana)" },
  { value: "%32", unit: "", label: "Daha düşük su hacmi — hızlı ısınma, yorulmayan kombi" },
];

export const CONTACT = {
  phone: "0262 658 11 58",
  phoneHref: "tel:+902626581158",
  email: "info@nixrad.com",
  sales: "satis@karpan.com.tr",
  hq: "Karpan Mühendislik",
  city: "Kocaeli, Türkiye",
};
