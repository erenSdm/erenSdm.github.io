import { BRANDS } from "../brands";
import type { SystemDef } from "../types";

/*
 * Orders flow left to right into one product database, then down the right
 * column: invoice, label, customer. Stock changes flow back out to every
 * storefront along the bottom.
 */
const VOLT = "#ccff00";
const PAPER = "#f4f4ef";

export const automation: SystemDef = {
  slug: "automation",
  copy: {
    code: "S-04",
    kicker: { en: "Automation & product ops", tr: "Otomasyon ve ürün operasyonu" },
    title: { en: "Product & inventory tracking systems", tr: "Ürün ve stok takip sistemleri" },
    body: {
      en: "One product database feeds the website, Trendyol and Shopify at the same time. A new order reserves stock, issues the e-invoice, prints the shipping label and tells the customer, all without anyone touching it. Unpaid orders get a reminder, and the morning report is ready before the team logs in.",
      tr: "Tek bir ürün veritabanı web sitesini, Trendyol'u ve Shopify'ı aynı anda besliyor. Yeni gelen sipariş stoğu ayırıyor, e-faturayı kesiyor, kargo etiketini basıyor ve müşteriye haber veriyor. Bunların hiçbiri için kimsenin elini sürmesi gerekmiyor. Ödenmemiş siparişlere hatırlatma gidiyor, sabah raporu da ekip giriş yapmadan hazır oluyor.",
    },
    tags: ["Queues", "Cron", "Webhooks", "e-Fatura", "Cargo APIs", "Stock sync", "Admin panel"],
    facts: [
      { k: { en: "Single source", tr: "Tek kaynak" }, v: { en: "Price and stock edited once, pushed to every channel", tr: "Fiyat ve stok bir kez girilir, her kanala dağılır" } },
      { k: { en: "Reliability", tr: "Güvenilirlik" }, v: { en: "Retries with backoff, every job idempotent and logged", tr: "Kademeli yeniden deneme, her iş tekrarsız ve kayıtlı" } },
      { k: { en: "Visibility", tr: "Görünürlük" }, v: { en: "Failed steps surface in the panel with one-click retry", tr: "Hatalı adımlar panelde görünür, tek tıkla yeniden çalışır" } },
    ],
  },
  metrics: [
    { k: { en: "Orders today", tr: "Bugünkü sipariş" }, v: 312, rate: 0.05 },
    { k: { en: "Order → label", tr: "Sipariş → etiket" }, v: 6.8, jitter: 0.5, decimals: 1, unit: "s" },
    { k: { en: "Stock mismatches", tr: "Stok uyuşmazlığı" }, v: 0, jitter: 0 },
    { k: { en: "Hands-on minutes", tr: "Elle harcanan dakika" }, v: 0, jitter: 0 },
  ],
  stations: [
    { id: "shopify", x: 90, y: 90, label: "Shopify", sub: { en: "web store", tr: "web mağaza" }, brand: "shopify", kind: "ext" },
    { id: "trendyol", x: 90, y: 260, label: "Trendyol", sub: { en: "marketplace", tr: "pazaryeri" }, brand: "trendyol", kind: "ext" },
    { id: "woo", x: 90, y: 430, label: "WooCommerce", sub: { en: "B2B store", tr: "B2B mağaza" }, brand: "woocommerce", kind: "ext" },
    { id: "queue", x: 285, y: 260, label: "Order queue", sub: { en: "one job per order", tr: "sipariş başına iş" }, icon: "inbox", load: { en: "312 today", tr: "bugün 312" } },
    { id: "pay", x: 460, y: 260, label: "Payment", sub: "iyzico · Stripe", brand: "stripe", kind: "gate", load: { en: "2% retried", tr: "%2 tekrar" } },
    { id: "db", x: 665, y: 260, w: 210, h: 200, label: "Product DB", sub: { en: "one stock, every channel", tr: "tek stok, tüm kanallar" }, icon: "db", kind: "store", widget: "stock" },
    { id: "invoice", x: 905, y: 90, label: "e-Fatura", sub: { en: "GİB e-Archive", tr: "GİB e-Arşiv" }, brand: "gib", kind: "ext" },
    { id: "cargo", x: 905, y: 260, label: "Yurtiçi", sub: { en: "label + tracking", tr: "etiket + takip" }, brand: "yurtici", kind: "ext" },
    { id: "customer", x: 905, y: 430, label: "Customer", sub: "WhatsApp · SMS", brand: "whatsapp", kind: "ext" },
  ],
  lanes: [
    { id: "s-in", from: "shopify", to: "queue", via: [[272, 90]] },
    { id: "t-in", from: "trendyol", to: "queue" },
    { id: "w-in", from: "woo", to: "queue", via: [[272, 430]] },
    { id: "charge", from: "queue", to: "pay" },
    { id: "reserve", from: "pay", to: "db" },
    { id: "bill", from: "db", to: "invoice", via: [[810, 200], [810, 90]] },
    { id: "ship", from: "invoice", to: "cargo" },
    { id: "tell", from: "cargo", to: "customer" },
    { id: "sync", from: "db", to: "queue", via: [[665, 498], [300, 498]] },
  ],
  streams: [
    { lane: "s-in", rate: 1.6, colors: [BRANDS.shopify.tint], size: 3 },
    { lane: "t-in", rate: 2.6, colors: [BRANDS.trendyol.tint], size: 3 },
    { lane: "w-in", rate: 1, colors: [BRANDS.woocommerce.tint], size: 3 },
    { lane: "s-in", rate: 1, colors: [PAPER], size: 2, reverse: true },
    { lane: "t-in", rate: 1, colors: [PAPER], size: 2, reverse: true },
    { lane: "w-in", rate: 1, colors: [PAPER], size: 2, reverse: true },
    { lane: "charge", rate: 5, colors: [VOLT], size: 3, drop: 0.06, dropAt: 0.9 },
    { lane: "reserve", rate: 4.6, colors: [VOLT], size: 3 },
    { lane: "bill", rate: 4.6, colors: [VOLT], size: 3 },
    { lane: "ship", rate: 4.6, colors: [BRANDS.yurtici.tint], size: 3 },
    { lane: "tell", rate: 4.6, colors: [BRANDS.whatsapp.tint], size: 3 },
    { lane: "sync", rate: 3, colors: [PAPER], size: 2 },
  ],
  stories: [
    {
      id: "trendyol-order",
      label: { en: "Trendyol order, zero hands", tr: "Trendyol siparişi, sıfır el" },
      entity: "TY-48213",
      steps: [
        {
          at: "trendyol",
          ms: 0,
          title: { en: "order placed", tr: "sipariş geldi" },
          payload: ['{ "orderNumber": "TY-48213",', '  "lines": [{ "sku": "KTN-GML-M-EKR",', '    "qty": 1 }], "total": 1249.90 }'],
        },
        { at: "queue", via: "t-in", ms: 9, title: { en: "queued once", tr: "tek sefer kuyruğa" }, payload: ['idempotency key TY-48213', 'job #31190 created'] },
        { at: "pay", via: "charge", ms: 420, title: { en: "payment confirmed", tr: "ödeme onaylandı" }, payload: ['marketplace settled · status PAID', '3-D Secure not needed'] },
        { at: "db", via: "reserve", ms: 14, cue: "reserve", title: { en: "1 unit reserved", tr: "1 adet ayrıldı" }, payload: ['SELECT … FOR UPDATE', 'stock 14 → 13 · commit 2.1 ms'] },
        { at: "db", ms: 640, cue: "sync", title: { en: "all stores updated", tr: "tüm mağazalar güncel" }, payload: ['Shopify   13  212 ms', 'Trendyol  13  640 ms', 'Woo       13  188 ms'] },
        { at: "invoice", via: "bill", ms: 1830, title: { en: "e-invoice issued", tr: "e-fatura kesildi" }, payload: ['e-Arşiv GIB2026000048213', 'PDF stored · mailed to buyer'] },
        { at: "cargo", via: "ship", ms: 2400, title: { en: "label printed", tr: "etiket basıldı" }, payload: ['createShipment → 7720419938', 'label.pdf → warehouse printer 2'] },
        {
          at: "customer",
          via: "tell",
          ms: 600,
          title: { en: "customer told", tr: "müşteriye haber verildi" },
          bubble: { tone: "out", text: { en: "Your order has shipped! Tracking: 7720419938", tr: "Siparişin kargoya verildi! Takip: 7720419938" } },
          payload: ['template order_shipped_tr → 200', 'total time, no one touched it: 5.9 s'],
        },
      ],
    },
    {
      id: "price-edit",
      label: { en: "Price changed once", tr: "Fiyat bir kez değişti" },
      entity: "KTN-GML-M-EKR",
      steps: [
        { at: "db", ms: 0, cue: "edit", title: { en: "edited in the admin panel", tr: "panelden düzenlendi" }, payload: ['price 1,249.90 → 1,199.90', 'by: admin · reason "autumn sale"'] },
        { at: "queue", via: "sync", ms: 12, title: { en: "3 update jobs", tr: "3 güncelleme işi" }, payload: ['fan-out → shopify, trendyol, woo'] },
        {
          at: "trendyol",
          via: "~t-in",
          ms: 640,
          cue: "fanout",
          title: { en: "every store shows the new price", tr: "her mağazada yeni fiyat" },
          payload: ['Trendyol  PUT price-and-inventory  640 ms', 'Shopify   PUT variants/…  212 ms', 'Woo       PUT products/…  188 ms'],
        },
      ],
    },
    {
      id: "declined",
      label: { en: "Card declined", tr: "Kart reddedildi" },
      entity: "WC-10771",
      steps: [
        { at: "woo", ms: 0, title: { en: "order placed", tr: "sipariş geldi" }, payload: ['{ "id": 10771, "total": 8420.00 }'] },
        { at: "queue", via: "w-in", ms: 8, title: { en: "queued", tr: "kuyruğa alındı" }, payload: ['job #31191'] },
        {
          at: "pay",
          via: "charge",
          ms: 960,
          state: "err",
          title: { en: "declined, stock untouched", tr: "reddedildi, stok korundu" },
          payload: ['iyzico → "card_declined"', 'stock NOT reserved', 'reminder scheduled +2 h, +24 h'],
        },
      ],
    },
  ],
};
