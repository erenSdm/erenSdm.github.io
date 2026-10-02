import { BRANDS } from "../brands";
import type { SystemDef } from "../types";

/* Channels on the left, business tools on the right, one agent in the middle. */
const WA = BRANDS.whatsapp.tint;
const IG = BRANDS.instagram.tint;
const META = BRANDS.meta.tint;
const VOLT = "#ccff00";
const PAPER = "#f4f4ef";

export const integrations: SystemDef = {
  slug: "integrations",
  copy: {
    code: "S-03",
    kicker: { en: "Integrations", tr: "Entegrasyonlar" },
    title: { en: "Messaging & CRM integrations", tr: "Mesajlaşma ve CRM entegrasyonları" },
    body: {
      en: "WhatsApp, Instagram DMs and Meta lead forms land in one place. An AI agent reads each message, checks the order in your store, writes the lead into your CRM, replies in the same channel and pings the team when a person needs to step in. Nobody copies data between tabs anymore.",
      tr: "WhatsApp, Instagram DM ve Meta form başvuruları tek bir yere düşüyor. Bir AI ajanı her mesajı okuyor, siparişi mağazanızdan kontrol ediyor, müşteri adayını CRM'e yazıyor, aynı kanaldan cevap veriyor ve bir insanın devreye girmesi gerektiğinde ekibe haber veriyor. Kimse sekmeler arasında veri kopyalamıyor.",
    },
    tags: ["WhatsApp Cloud API", "Instagram Graph", "Meta Lead Ads", "Webhooks", "OAuth", "CRM", "Shopify / Woo"],
    facts: [
      { k: { en: "Inbound", tr: "Gelen" }, v: { en: "Signed webhooks, verified and de-duplicated", tr: "İmzalı webhook'lar, doğrulanıp tekilleştirilir" } },
      { k: { en: "Replies", tr: "Cevaplar" }, v: { en: "Same channel, inside Meta's 24h window or via approved templates", tr: "Aynı kanaldan, Meta'nın 24 saat penceresinde ya da onaylı şablonla" } },
      { k: { en: "Hand-off", tr: "Devir" }, v: { en: "Complaints and edge cases go to a human inbox", tr: "Şikâyet ve istisnalar insan gelen kutusuna düşer" } },
    ],
  },
  metrics: [
    { k: { en: "Messages today", tr: "Bugünkü mesaj" }, v: 4812, rate: 0.4 },
    { k: { en: "First reply, median", tr: "İlk cevap, medyan" }, v: 1.4, jitter: 0.12, decimals: 1, unit: "s" },
    { k: { en: "Solved without a person", tr: "İnsansız çözülen" }, v: 83.6, jitter: 0.4, decimals: 1, unit: "%" },
    { k: { en: "Waiting for the team", tr: "Ekibi bekleyen" }, v: 3, jitter: 0 },
  ],
  stations: [
    { id: "wa", x: 90, y: 90, label: "WhatsApp", sub: "Cloud API", brand: "whatsapp", kind: "ext" },
    { id: "ig", x: 90, y: 260, label: "Instagram", sub: "DM · comments", brand: "instagram", kind: "ext" },
    { id: "meta", x: 90, y: 430, label: "Lead Ads", sub: { en: "Meta instant forms", tr: "Meta anlık formlar" }, brand: "meta", kind: "ext" },
    { id: "gw", x: 285, y: 260, label: "Webhook gateway", sub: { en: "verify · dedupe", tr: "doğrula · tekille" }, icon: "shield", kind: "gate", load: { en: "0 duplicates", tr: "0 tekrar" } },
    { id: "hub", x: 505, y: 260, w: 220, h: 190, label: "AI agent", sub: { en: "one inbox, every channel", tr: "tek kutu, tüm kanallar" }, icon: "sparkles", kind: "ai", widget: "inbox" },
    { id: "human", x: 505, y: 62, label: "Team inbox", sub: { en: "a person takes over", tr: "bir kişi devralır" }, icon: "users" },
    { id: "sheets", x: 505, y: 462, label: "Sheets", sub: { en: "every event logged", tr: "her olay kayıtlı" }, brand: "googlesheets", kind: "store" },
    { id: "shopify", x: 905, y: 90, label: "Shopify", sub: { en: "orders · stock", tr: "sipariş · stok" }, brand: "shopify", kind: "ext" },
    { id: "hubspot", x: 905, y: 260, label: "HubSpot", sub: "CRM", brand: "hubspot", kind: "ext" },
    { id: "gmail", x: 905, y: 430, label: "Gmail", sub: { en: "team alerts", tr: "ekip bildirimi" }, brand: "gmail", kind: "ext" },
  ],
  lanes: [
    { id: "wa-in", from: "wa", to: "gw", via: [[285, 90]] },
    { id: "ig-in", from: "ig", to: "gw" },
    { id: "meta-in", from: "meta", to: "gw", via: [[285, 430]] },
    { id: "queue", from: "gw", to: "hub" },
    { id: "handoff", from: "hub", to: "human" },
    { id: "log", from: "hub", to: "sheets" },
    { id: "store", from: "hub", to: "shopify", via: [[720, 200], [720, 90]] },
    { id: "crm", from: "hub", to: "hubspot" },
    { id: "alert", from: "hub", to: "gmail", via: [[720, 320], [720, 430]] },
  ],
  streams: [
    { lane: "wa-in", rate: 5, colors: [WA], size: 2.8 },
    { lane: "wa-in", rate: 3, colors: [VOLT], size: 2.2, reverse: true },
    { lane: "ig-in", rate: 4, colors: [IG], size: 2.8 },
    { lane: "ig-in", rate: 2.4, colors: [VOLT], size: 2.2, reverse: true },
    { lane: "meta-in", rate: 1.6, colors: [META], size: 2.8 },
    { lane: "queue", rate: 10, colors: [WA, IG, META], size: 2.6 },
    { lane: "queue", rate: 5, colors: [VOLT], size: 2.2, reverse: true },
    { lane: "store", rate: 2, colors: [VOLT], size: 2.6 },
    { lane: "crm", rate: 1.4, colors: [VOLT], size: 2.6 },
    { lane: "alert", rate: 0.6, colors: [VOLT], size: 2.6 },
    { lane: "log", rate: 4, colors: [PAPER], size: 2 },
    { lane: "handoff", rate: 0.35, colors: ["#ff3b1f"], size: 3 },
  ],
  stories: [
    {
      id: "wa-order",
      label: { en: "WhatsApp: where's my order?", tr: "WhatsApp: siparişim nerede?" },
      entity: "thread #8841",
      steps: [
        {
          at: "wa",
          ms: 0,
          title: { en: "customer writes", tr: "müşteri yazdı" },
          bubble: { tone: "in", side: "right", text: { en: "Hi, where's my order #48213?", tr: "Merhaba, #48213 siparişim nerede?" } },
          payload: ['{ "from": "90532•••1847",', '  "type": "text",', '  "text": "…#48213 siparişim nerede?" }'],
        },
        { at: "gw", via: "wa-in", ms: 6, title: { en: "signature verified", tr: "imza doğrulandı" }, payload: ['X-Hub-Signature-256 ✓', 'message id seen before: no'] },
        {
          at: "hub",
          via: "queue",
          ms: 380,
          title: { en: "intent understood", tr: "niyet anlaşıldı" },
          payload: ['intent  order_status  0.97', 'entities { "order": 48213 }', 'tool → getOrder'],
        },
        { at: "shopify", via: "store", ms: 164, title: { en: "order looked up", tr: "sipariş sorgulandı" }, payload: ['GET /orders/48213.json → 200', '{ "fulfillment": "shipped",', '  "carrier": "Yurtiçi", "eta": "tomorrow" }'] },
        { at: "hub", via: "~store", ms: 92, title: { en: "reply written", tr: "cevap yazıldı" }, payload: ['tone: friendly · lang: tr', 'inside 24h window → free reply'] },
        {
          at: "wa",
          via: ["~queue", "~wa-in"],
          ms: 310,
          title: { en: "answered on WhatsApp", tr: "WhatsApp'tan cevaplandı" },
          bubble: { tone: "out", side: "right", text: { en: "It's on its way with Yurtiçi, arriving tomorrow. Tracking: 7720419938", tr: "Yurtiçi Kargo ile yolda, yarın elinizde. Takip: 7720419938" } },
          payload: ['POST /messages → 200', 'first reply in 0.95 s'],
        },
      ],
    },
    {
      id: "ig-lead",
      label: { en: "Instagram DM → lead", tr: "Instagram DM → aday" },
      entity: "thread #8842",
      steps: [
        {
          at: "ig",
          ms: 0,
          title: { en: "DM arrives", tr: "DM geldi" },
          bubble: { tone: "in", text: { en: "How much for 3 nights in May?", tr: "Mayısta 3 gece ne kadar?" } },
          payload: ['{ "object": "instagram",', '  "text": "Mayısta 3 gece ne kadar?" }'],
        },
        { at: "gw", via: "ig-in", ms: 5, title: { en: "verified", tr: "doğrulandı" }, payload: ['signature ✓ · thread #8842 opened'] },
        { at: "hub", via: "queue", ms: 412, title: { en: "dates extracted", tr: "tarihler çıkarıldı" }, payload: ['intent  quote  0.93', '{ "from": "2026-05-14",', '  "to": "2026-05-17", "guests": 2 }'] },
        { at: "hubspot", via: "crm", ms: 220, title: { en: "lead created", tr: "aday oluşturuldu" }, payload: ['POST /crm/v3/objects/contacts', 'source instagram · stage new'] },
        { at: "gmail", via: ["~crm", "alert"], ms: 130, title: { en: "sales told", tr: "satış ekibine haber" }, payload: ['to sales@ · "New lead, 3 nights, May"'] },
        {
          at: "ig",
          via: ["~alert", "~queue", "~ig-in"],
          ms: 290,
          title: { en: "quote sent in DM", tr: "fiyat DM'den gitti" },
          bubble: { tone: "out", text: { en: "3 nights, 14–17 May: ₺18,600. Book here →", tr: "14–17 Mayıs, 3 gece: 18.600 ₺. Rezervasyon için →" } },
          payload: ['POST /me/messages → 200'],
        },
      ],
    },
    {
      id: "complaint",
      label: { en: "Complaint → a person", tr: "Şikâyet → bir kişi" },
      entity: "thread #8846",
      steps: [
        {
          at: "ig",
          ms: 0,
          title: { en: "public comment", tr: "herkese açık yorum" },
          bubble: { tone: "in", text: { en: "Third time it arrived broken.", tr: "Üçüncü kez kırık geldi." } },
          payload: ['{ "field": "comments",', '  "text": "Üçüncü kez kırık geldi." }'],
        },
        { at: "gw", via: "ig-in", ms: 9, title: { en: "verified", tr: "doğrulandı" }, payload: ['signature ✓'] },
        {
          at: "hub",
          via: "queue",
          ms: 350,
          state: "warn",
          title: { en: "auto-reply held back", tr: "otomatik cevap durduruldu" },
          payload: ['sentiment -0.82 · repeat issue', 'rule: complaints go to a person'],
        },
        { at: "human", via: "handoff", ms: 120, title: { en: "assigned, high priority", tr: "atandı, yüksek öncelik" }, payload: ['assigned support · P1', 'order history attached (3 orders)'] },
        { at: "sheets", via: ["~handoff", "log"], ms: 60, title: { en: "case logged", tr: "vaka kaydedildi" }, payload: ['row 2,214 · case "damaged x3"'] },
      ],
    },
  ],
};
