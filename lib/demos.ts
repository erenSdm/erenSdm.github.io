/**
 * DEMO MANIFEST — single source of truth.
 * Both the landing showcases and the demo routes read from here.
 * Agents building a demo should verify their entry (brand, accent, taglines).
 */

export type Locale = "en" | "tr";
export type DemoKind = "web" | "mobile";

export interface Demo {
  slug: string;
  brand: string; // product name shown on the card
  kind: DemoKind;
  route: string;
  accent: string; // hex — per-demo signature color used on the card chrome
  index: string; // telemetry index label, e.g. "W-01"
  domain: { en: string; tr: string }; // one-word category
  tagline: { en: string; tr: string }; // headline pitch
  blurb: { en: string; tr: string }; // 1–2 sentence marketing copy
  stack: string[]; // short tech/aesthetic tags
}

export const WEB_DEMOS: Demo[] = [
  {
    slug: "saas-panel",
    brand: "HELM",
    kind: "web",
    route: "/demos/saas-panel",
    accent: "#ccff00",
    index: "W-01",
    domain: { en: "Analytics", tr: "Analitik" },
    tagline: {
      en: "The analytics deck that reads like a cockpit.",
      tr: "Kokpit gibi okunan analitik paneli.",
    },
    blurb: {
      en: "A dark, data-dense command surface. Every metric earns its pixels — no chart is there to decorate.",
      tr: "Koyu, veri-yoğun bir komuta yüzeyi. Her metrik pikselini hak ediyor — hiçbir grafik süs değil.",
    },
    stack: ["Dashboard", "Realtime", "Charts"],
  },
  {
    slug: "atelier",
    brand: "SÉVIGNÉ",
    kind: "web",
    route: "/demos/atelier",
    accent: "#e7c98a",
    index: "W-02",
    domain: { en: "Commerce", tr: "E-ticaret" },
    tagline: {
      en: "Couture commerce, cut from editorial cloth.",
      tr: "Editoryal kumaştan biçilmiş couture ticaret.",
    },
    blurb: {
      en: "A luxury fashion house storefront where the product photography and the typography share the same runway.",
      tr: "Ürün fotoğrafı ile tipografinin aynı podyumu paylaştığı bir lüks moda vitrini.",
    },
    stack: ["Editorial", "E-commerce", "Serif"],
  },
  {
    slug: "ledger",
    brand: "LEDGER",
    kind: "web",
    route: "/demos/ledger",
    accent: "#2fe6a0",
    index: "W-03",
    domain: { en: "Fintech", tr: "Fintek" },
    tagline: {
      en: "Money that moves at the speed of type.",
      tr: "Tipografinin hızında hareket eden para.",
    },
    blurb: {
      en: "A fintech landing built on sharp neobrutalist blocks, animated figures, and a promise you can measure.",
      tr: "Keskin neobrütalist bloklar, animasyonlu rakamlar ve ölçebileceğin bir vaat üstüne kurulu fintek landing'i.",
    },
    stack: ["Fintech", "Neobrutalist", "Counters"],
  },
  {
    slug: "agency",
    brand: "VANTA",
    kind: "web",
    route: "/demos/agency",
    accent: "#ff4d2e",
    index: "W-04",
    domain: { en: "Studio", tr: "Stüdyo" },
    tagline: {
      en: "A studio site that argues with you.",
      tr: "Seninle tartışan bir stüdyo sitesi.",
    },
    blurb: {
      en: "A creative agency landing that leads with a point of view — oversized type, scroll theatre, zero filler.",
      tr: "Bir bakış açısıyla açılan yaratıcı ajans landing'i — dev tipografi, scroll tiyatrosu, sıfır dolgu.",
    },
    stack: ["Agency", "Scroll", "Kinetic"],
  },
  {
    slug: "workspace",
    brand: "HORIZON",
    kind: "web",
    route: "/demos/workspace",
    accent: "#6366f1",
    index: "W-05",
    domain: { en: "Workspace", tr: "İş Alanı" },
    tagline: {
      en: "The workspace your team stops fighting.",
      tr: "Ekibinin artık savaşmadığı çalışma alanı.",
    },
    blurb: {
      en: "A project console where boards, sprints, and people share one calm surface. Dense with signal, empty of noise.",
      tr: "Panoların, sprintlerin ve insanların tek bir sakin yüzeyi paylaştığı bir proje konsolu. Sinyalle dolu, gürültüden arınmış.",
    },
    stack: ["SaaS", "Kanban", "Product"],
  },
  {
    slug: "drops",
    brand: "CADENCE",
    kind: "web",
    route: "/demos/drops",
    accent: "#ff2e88",
    index: "W-06",
    domain: { en: "Retail", tr: "Perakende" },
    tagline: {
      en: "Streetwear that sells before the timer hits zero.",
      tr: "Sayaç sıfırlanmadan satan sokak modası.",
    },
    blurb: {
      en: "A drop-culture storefront built on hype mechanics — countdowns, size runs, a cart that feels like a heist.",
      tr: "Hype mekaniği üstüne kurulu bir drop vitrini — geri sayımlar, beden stokları ve soygun gibi hissettiren bir sepet.",
    },
    stack: ["E-commerce", "Drops", "Grid"],
  },
  {
    slug: "platform",
    brand: "COBALT",
    kind: "web",
    route: "/demos/platform",
    accent: "#22d3ee",
    index: "W-07",
    domain: { en: "Platform", tr: "Platform" },
    tagline: {
      en: "Infrastructure that explains itself.",
      tr: "Kendini anlatan altyapı.",
    },
    blurb: {
      en: "A developer-platform landing where the code block is the hero and every feature earns a benchmark. Docs-grade clarity.",
      tr: "Kod bloğunun kahraman olduğu, her özelliğin bir benchmark hak ettiği bir geliştirici-platformu landing'i. Dokümantasyon netliğinde.",
    },
    stack: ["Dev Tools", "Bento", "Landing"],
  },
  {
    slug: "motors",
    brand: "APEX",
    kind: "web",
    route: "/demos/motors",
    accent: "#ffb800",
    index: "W-08",
    domain: { en: "Automotive", tr: "Otomotiv" },
    tagline: {
      en: "An electric flagship, configured in the dark.",
      tr: "Karanlıkta yapılandırılan elektrikli amiral gemisi.",
    },
    blurb: {
      en: "A cinematic EV product page — spec counters, a live paint configurator, and performance numbers that land like a launch.",
      tr: "Sinematik bir elektrikli araç ürün sayfası — spec sayaçları, canlı boya yapılandırıcısı ve lansman gibi düşen performans rakamları.",
    },
    stack: ["Automotive", "Configurator", "Cinematic"],
  },
];

export const MOBILE_DEMOS: Demo[] = [
  {
    slug: "chat",
    brand: "RELAY",
    kind: "mobile",
    route: "/demos/mobile/chat",
    accent: "#3e6ff0",
    index: "M-01",
    domain: { en: "Messaging", tr: "Mesajlaşma" },
    tagline: {
      en: "Messaging with a pulse.",
      tr: "Nabzı olan mesajlaşma.",
    },
    blurb: {
      en: "Threads, presence, and typing that feel alive. A chat app that respects the conversation.",
      tr: "Canlı hissettiren sohbetler, çevrimiçi durumu ve yazıyor animasyonu. Konuşmaya saygı duyan bir chat.",
    },
    stack: ["Chat", "Presence", "Bubbles"],
  },
  {
    slug: "wallet",
    brand: "MINT",
    kind: "mobile",
    route: "/demos/mobile/wallet",
    accent: "#2fbf8c",
    index: "M-02",
    domain: { en: "Finance", tr: "Finans" },
    tagline: {
      en: "A wallet you actually open.",
      tr: "Gerçekten açtığın bir cüzdan.",
    },
    blurb: {
      en: "Cards, balances, and spending that read in a glance. Personal finance without the anxiety.",
      tr: "Bir bakışta okunan kartlar, bakiyeler ve harcamalar. Kaygısız kişisel finans.",
    },
    stack: ["Wallet", "Cards", "Insights"],
  },
  {
    slug: "pulse",
    brand: "PULSE",
    kind: "mobile",
    route: "/demos/mobile/pulse",
    accent: "#f0654a",
    index: "M-03",
    domain: { en: "Fitness", tr: "Fitness" },
    tagline: {
      en: "Rings that mean something.",
      tr: "Bir anlamı olan halkalar.",
    },
    blurb: {
      en: "Activity, streaks, and heart data with real energy. A health tracker built to be checked, not dreaded.",
      tr: "Gerçek enerjiyle aktivite, seri ve kalp verisi. Korkulan değil, bakılan bir sağlık takipçisi.",
    },
    stack: ["Health", "Rings", "Streaks"],
  },
  {
    slug: "waves",
    brand: "WAVES",
    kind: "mobile",
    route: "/demos/mobile/waves",
    accent: "#9b87e8",
    index: "M-04",
    domain: { en: "Music", tr: "Müzik" },
    tagline: {
      en: "Sound you can see.",
      tr: "Görebildiğin ses.",
    },
    blurb: {
      en: "A player where album art, waveform, and motion move as one. Streaming that looks as good as it sounds.",
      tr: "Albüm kapağı, dalga formu ve hareketin tek vücut olduğu bir çalar. Duyulduğu kadar iyi görünen streaming.",
    },
    stack: ["Music", "Waveform", "Player"],
  },
];

export const ALL_DEMOS: Demo[] = [...WEB_DEMOS, ...MOBILE_DEMOS];

export function getDemo(slug: string): Demo | undefined {
  return ALL_DEMOS.find((d) => d.slug === slug);
}
