import { BRANDS } from "../brands";
import type { SystemDef } from "../types";

/*
 * Top row is the hot path, market tick → risk decision; it narrows like a
 * funnel, thousands of ticks in and a handful of orders out. The bottom row
 * runs right to left: the exchange fills, the fill is stored, the user hears.
 */
const A = 110;
const B = 405;
const BNB = BRANDS.binance.tint;
const TG = BRANDS.telegram.tint;
const VOLT = "#ccff00";
const PAPER = "#f4f4ef";

export const richcasebot: SystemDef = {
  slug: "richcasebot",
  copy: {
    code: "S-01",
    kicker: { en: "Real-time data & execution", tr: "Gerçek zamanlı veri ve işlem" },
    title: { en: "Crypto analysis & trading systems", tr: "Kripto analiz ve trading sistemleri" },
    body: {
      en: "Behind RichcaseBot sits a pipeline that never sleeps. It reads the live Binance market stream, turns raw ticks into candles, runs each user's strategy, checks every order against risk limits and places it with a key that can trade but can never withdraw. Every fill reaches the user on Telegram within seconds.",
      tr: "RichcaseBot'un arkasında hiç durmayan bir veri hattı çalışıyor. Binance'in canlı piyasa akışını okuyor, ham fiyatları mumlara çeviriyor, her kullanıcının stratejisini çalıştırıyor, her emri risk limitlerinden geçiriyor ve emri yalnızca işlem yapabilen, para çekemeyen bir anahtarla gönderiyor. Gerçekleşen her işlem saniyeler içinde kullanıcıya Telegram'dan ulaşıyor.",
    },
    tags: ["WebSocket", "Event bus", "Time-series", "Risk engine", "Binance API", "Telegram Bot"],
    facts: [
      { k: { en: "Market input", tr: "Piyasa girişi" }, v: { en: "Live WS stream, auto-reconnect + gap backfill", tr: "Canlı WS akışı, otomatik yeniden bağlanma + boşluk doldurma" } },
      { k: { en: "Custody", tr: "Fon güvenliği" }, v: { en: "Trade-only keys, encrypted at rest — withdrawals impossible", tr: "Yalnızca işlem yetkili, şifreli anahtar — para çekmek imkânsız" } },
      { k: { en: "Guard rails", tr: "Koruma" }, v: { en: "Weekly caps, position sizing, stop-loss before every order", tr: "Her emirden önce haftalık limit, pozisyon boyutu, stop-loss" } },
    ],
    cta: { label: { en: "Open RichcaseBot", tr: "RichcaseBot'u aç" }, href: "/demos/richcase" },
  },
  metrics: [
    { k: { en: "Ticks / second", tr: "Saniyede tick" }, v: 2814, jitter: 240 },
    { k: { en: "Strategies running", tr: "Çalışan strateji" }, v: 1207, jitter: 3 },
    { k: { en: "Signal → fill, p95", tr: "Sinyal → işlem, p95" }, v: 184, jitter: 22, unit: "ms" },
    { k: { en: "Fills today", tr: "Bugünkü işlem" }, v: 18402, rate: 0.7 },
  ],
  funnel: {
    x: 545,
    y: 222,
    w: 300,
    title: { en: "Per minute, in → out", tr: "Dakikada, giren → çıkan" },
    rows: [
      { v: 168840, unit: { en: "ticks", tr: "tick" } },
      { v: 412, unit: { en: "candles", tr: "mum" } },
      { v: 41, unit: { en: "signals", tr: "sinyal" } },
      { v: 30, unit: { en: "orders placed", tr: "gönderilen emir" } },
    ],
  },
  stations: [
    { id: "binance", x: 90, y: A, label: "Binance", sub: "WebSocket stream", brand: "binance", kind: "ext", load: { en: "2.8k ticks/s", tr: "2,8 bin tick/s" } },
    { id: "ingest", x: 270, y: A, label: "Ingest", sub: { en: "reconnect · dedupe", tr: "bağlan · tekille" }, icon: "plug", load: { en: "0 gaps", tr: "0 boşluk" } },
    { id: "candles", x: 480, y: A, w: 210, h: 170, label: "Candle forge", sub: "tick → OHLCV", icon: "chart", widget: "candles", load: { en: "412 pairs", tr: "412 parite" } },
    { id: "strategy", x: 700, y: A, label: "Strategies", sub: { en: "one per user", tr: "kullanıcı başına" }, icon: "cpu", kind: "ai", load: { en: "~40 signals/min", tr: "~40 sinyal/dk" } },
    { id: "risk", x: 900, y: A, label: "Risk guard", sub: { en: "cap · size · stop", tr: "limit · boyut · stop" }, icon: "shield", kind: "gate", load: { en: "1 in 4 blocked", tr: "4'te 1 durdurulur" } },
    { id: "exec", x: 900, y: B, label: "Executor", sub: { en: "trade-only key", tr: "yalnız işlem anahtarı" }, icon: "zap", load: { en: "0 withdrawals", tr: "0 para çekme" } },
    { id: "order", x: 700, y: B, label: "Binance", sub: "REST · POST /order", brand: "binance", kind: "ext" },
    { id: "bus", x: 480, y: B, w: 210, h: 80, label: "Store + bus", sub: { en: "candles · fills · events", tr: "mum · işlem · olay" }, icon: "db", kind: "store", load: { en: "9.4M rows/day", tr: "günde 9,4 M satır" } },
    { id: "notify", x: 270, y: B, label: "Notifier", sub: { en: "templates · TR/EN", tr: "şablon · TR/EN" }, icon: "bell" },
    { id: "telegram", x: 90, y: B, label: "Telegram", sub: { en: "user DM", tr: "kullanıcı DM" }, brand: "telegram", kind: "ext", load: { en: "< 1 s to phone", tr: "telefona < 1 sn" } },
  ],
  lanes: [
    { id: "feed", from: "binance", to: "ingest" },
    { id: "raw", from: "ingest", to: "candles" },
    { id: "bars", from: "candles", to: "strategy" },
    { id: "signal", from: "strategy", to: "risk" },
    { id: "approved", from: "risk", to: "exec" },
    { id: "place", from: "exec", to: "order" },
    { id: "fill", from: "order", to: "bus" },
    { id: "store", from: "candles", to: "bus" },
    { id: "event", from: "bus", to: "notify" },
    { id: "dm", from: "notify", to: "telegram" },
  ],
  streams: [
    { lane: "feed", rate: 70, colors: [BNB], size: 1.8, speed: 300 },
    { lane: "raw", rate: 58, colors: [BNB, PAPER], size: 1.8, speed: 300 },
    { lane: "bars", rate: 12, colors: [PAPER], size: 2.6 },
    { lane: "store", rate: 9, colors: [PAPER], size: 2 },
    { lane: "signal", rate: 4, colors: [VOLT], size: 3, drop: 0.27, dropAt: 0.9 },
    { lane: "approved", rate: 2.6, colors: [VOLT], size: 3 },
    { lane: "place", rate: 2.6, colors: [VOLT], size: 3 },
    { lane: "fill", rate: 2.6, colors: [BNB], size: 3 },
    { lane: "event", rate: 2.6, colors: [VOLT], size: 3 },
    { lane: "dm", rate: 2.6, colors: [TG], size: 3 },
  ],
  stories: [
    {
      id: "signal-to-fill",
      label: { en: "Tick → order → Telegram", tr: "Tick → emir → Telegram" },
      entity: "rc-7f3a91",
      steps: [
        {
          at: "binance",
          ms: 0,
          title: { en: "trade tick arrives", tr: "fiyat tick'i geldi" },
          payload: ['{ "e": "trade", "s": "BTCUSDT",', '  "p": "64213.70", "q": "0.01200",', '  "T": 1759411204118 }'],
        },
        {
          at: "ingest",
          via: "feed",
          ms: 4,
          title: { en: "order checked, no duplicates", tr: "sıra kontrolü, tekrar yok" },
          payload: ['seq 88213941 · prev 88213940', 'dup: false · gap: false', 'lag 3.8 ms from exchange'],
        },
        {
          at: "candles",
          via: "raw",
          ms: 11,
          cue: "close",
          title: { en: "1m candle closes", tr: "1 dk mum kapandı" },
          payload: ['{ "pair": "BTCUSDT", "tf": "1m",', '  "o": 64180.2, "h": 64221.0,', '  "l": 64171.5, "c": 64213.7,', '  "v": 182.43 }'],
        },
        {
          at: "strategy",
          via: "bars",
          ms: 23,
          title: { en: "EMA cross → LONG", tr: "EMA kesişimi → LONG" },
          payload: ['user u_3817 · plan "Pro"', 'ema9 64,196.4 > ema21 64,188.9', '{ "side": "BUY", "conf": 0.71 }'],
        },
        {
          at: "risk",
          via: "signal",
          ms: 9,
          title: { en: "limits pass", tr: "limitler uygun" },
          payload: ['weekly trades  61 / 150', 'size 0.0042 BTC = 1.8% equity', 'stop-loss 63,570 set'],
        },
        {
          at: "exec",
          via: "approved",
          ms: 6,
          title: { en: "order signed", tr: "emir imzalandı" },
          payload: ['key k_0aa1 · scope TRADE', 'withdraw: DENIED by exchange', 'clientId rc-7f3a91 (idempotent)'],
        },
        {
          at: "order",
          via: "place",
          ms: 142,
          title: { en: "exchange fills", tr: "borsa gerçekleştirdi" },
          payload: ['POST /api/v3/order → 200', '{ "status": "FILLED",', '  "price": "64214.10", "qty": "0.0042" }'],
        },
        {
          at: "bus",
          via: "fill",
          ms: 8,
          title: { en: "fill stored + event", tr: "işlem kaydı + olay" },
          payload: ['INSERT fills (rc-7f3a91) · 0.9 ms', 'emit fill.created → 3 consumers'],
        },
        {
          at: "notify",
          via: "event",
          ms: 12,
          title: { en: "message rendered", tr: "mesaj hazırlandı" },
          payload: ['template fill_buy · locale tr', 'chat_id 41•••92'],
        },
        {
          at: "telegram",
          via: "dm",
          ms: 298,
          title: { en: "user notified", tr: "kullanıcıya iletildi" },
          bubble: { tone: "out", text: { en: "Bought 0.0042 BTC @ 64,214.1 · stop 63,570", tr: "0.0042 BTC alındı @ 64.214,1 · stop 63.570" } },
          payload: ['sendMessage → 200 · message_id 99812'],
        },
      ],
    },
    {
      id: "risk-reject",
      label: { en: "Weekly cap hit", tr: "Haftalık limit doldu" },
      entity: "sig-u0952",
      steps: [
        { at: "binance", ms: 0, title: { en: "ETH tick", tr: "ETH tick'i" }, payload: ['{ "s": "ETHUSDT", "p": "3412.08" }'] },
        { at: "ingest", via: "feed", ms: 5, title: { en: "accepted", tr: "kabul edildi" }, payload: ['seq 51200877 · dup: false'] },
        { at: "candles", via: "raw", ms: 10, cue: "close", title: { en: "5m candle closes", tr: "5 dk mum kapandı" }, payload: ['{ "pair": "ETHUSDT", "tf": "5m",', '  "c": 3412.08, "v": 2210.7 }'] },
        { at: "strategy", via: "bars", ms: 19, title: { en: "SHORT signal", tr: "SHORT sinyali" }, payload: ['user u_0952 · plan "Max"', '{ "side": "SELL", "conf": 0.64 }'] },
        {
          at: "risk",
          via: "signal",
          ms: 3,
          state: "err",
          title: { en: "blocked: weekly cap", tr: "durduruldu: haftalık limit" },
          payload: ['weekly trades  150 / 150', 'REJECT · resets Mon 00:00', 'exchange calls made: 0'],
        },
      ],
    },
    {
      id: "reconnect",
      label: { en: "Stream drops", tr: "Akış koptu" },
      entity: "ws-conn-04",
      steps: [
        {
          at: "binance",
          ms: 0,
          state: "err",
          mute: ["feed", "raw", "bars", "store"],
          title: { en: "socket closed 1006", tr: "soket kapandı 1006" },
          payload: ['close code 1006 · heartbeat missed', 'last seq 88214102'],
        },
        {
          at: "ingest",
          via: "feed",
          ms: 800,
          state: "warn",
          mute: ["feed", "raw", "bars", "store"],
          title: { en: "reconnect, backoff", tr: "yeniden bağlan, bekle" },
          payload: ['attempt 1 · backoff 800 ms', 'other 3 sockets healthy'],
        },
        { at: "binance", via: "~feed", ms: 470, title: { en: "stream restored", tr: "akış geri geldi" }, payload: ['subscribed 412 streams', 'offline 1.27 s'] },
        { at: "ingest", via: "feed", ms: 96, title: { en: "3 candles backfilled", tr: "3 mum tamamlandı" }, payload: ['GET /api/v3/klines × 3 → 200', 'seq 88214103 … 88217540'] },
        { at: "candles", via: "raw", ms: 14, cue: "close", title: { en: "series has no gaps", tr: "seride boşluk yok" }, payload: ['continuity check: OK', 'no strategy saw the outage'] },
      ],
    },
  ],
};
