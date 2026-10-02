import { BRANDS } from "../brands";
import type { SystemDef } from "../types";

/*
 * Top row indexes documents into the vector space; bottom row turns a
 * question into a point in that same space. The right column is where the
 * best passages become a cited answer.
 */
const VOLT = "#ccff00";
const PAPER = "#f4f4ef";
const DRIVE = BRANDS.googledrive.tint;

export const rag: SystemDef = {
  slug: "rag",
  copy: {
    code: "S-02",
    kicker: { en: "AI & retrieval", tr: "Yapay zekâ ve arama" },
    title: { en: "RAG: answers from your own documents", tr: "RAG: kendi verinizden cevap" },
    body: {
      en: "An assistant that answers only from your PDFs, help center, Notion pages and product data, and shows the source for every claim. When the sources don't cover a question, it says so and hands the conversation to a person instead of making something up.",
      tr: "PDF'lerinizden, yardım merkezinizden, Notion sayfalarınızdan ve ürün verinizden cevap veren, her bilginin kaynağını gösteren bir asistan. Kaynaklarda olmayan bir soru gelirse bunu söylüyor ve uydurmak yerine konuşmayı bir insana aktarıyor.",
    },
    tags: ["Embeddings", "Vector DB", "Hybrid search", "Rerank", "LLM", "Citations"],
    facts: [
      { k: { en: "Sources", tr: "Kaynaklar" }, v: { en: "PDF, web pages, Notion, Sheets, product catalog", tr: "PDF, web sayfası, Notion, Sheets, ürün kataloğu" } },
      { k: { en: "Grounding", tr: "Doğruluk" }, v: { en: "Every answer cites the passage it came from", tr: "Her cevap dayandığı paragrafı kaynak olarak gösterir" } },
      { k: { en: "Fallback", tr: "Yedek plan" }, v: { en: "Low confidence → handed to a human, never guessed", tr: "Düşük güven → insana aktarılır, asla tahmin edilmez" } },
    ],
  },
  metrics: [
    { k: { en: "Chunks indexed", tr: "İndekslenen parça" }, v: 48210, rate: 0.2 },
    { k: { en: "Search, p50", tr: "Arama, p50" }, v: 31, jitter: 4, unit: "ms" },
    { k: { en: "Answered from sources", tr: "Kaynaktan cevaplanan" }, v: 96.8, jitter: 0.3, decimals: 1, unit: "%" },
    { k: { en: "Questions today", tr: "Bugünkü soru" }, v: 1386, rate: 0.12 },
  ],
  stations: [
    { id: "notion", x: 90, y: 40, label: "Notion", sub: { en: "412 pages", tr: "412 sayfa" }, brand: "notion", kind: "ext" },
    { id: "drive", x: 90, y: 155, label: "Drive", sub: "PDF · Docs", brand: "googledrive", kind: "ext" },
    { id: "web", x: 90, y: 270, label: "Help center", sub: { en: "crawled nightly", tr: "her gece taranır" }, icon: "globe", kind: "ext" },
    { id: "chunk", x: 280, y: 155, label: "Parse + chunk", sub: { en: "512 tokens each", tr: "512 token parça" }, icon: "scissors", load: { en: "48,210 chunks", tr: "48.210 parça" } },
    { id: "embed", x: 470, y: 155, label: "Embed", sub: { en: "text → vector", tr: "metin → vektör" }, icon: "sparkles", kind: "ai", load: "1536-d" },
    { id: "space", x: 685, y: 190, w: 200, h: 250, label: "Vector space", sub: "hnsw + bm25", icon: "layers", kind: "store", widget: "vectors" },
    { id: "rerank", x: 905, y: 110, label: "Rerank", sub: { en: "24 → best 5", tr: "24 → en iyi 5" }, icon: "shield", kind: "gate" },
    { id: "llm", x: 905, y: 270, label: "Claude", sub: { en: "grounded prompt", tr: "kaynaklı prompt" }, brand: "claude", kind: "ai" },
    { id: "answer", x: 905, y: 440, label: "Answer", sub: { en: "+ citations", tr: "+ kaynaklar" }, icon: "quote" },
    { id: "user", x: 90, y: 440, label: "Customer", sub: { en: "chat widget", tr: "sohbet widget'ı" }, icon: "chat", kind: "ext" },
    { id: "plan", x: 280, y: 440, label: "Query planner", sub: { en: "rewrite · filter", tr: "yeniden yaz · filtre" }, icon: "route", kind: "ai" },
    { id: "qembed", x: 470, y: 440, label: "Embed query", sub: "1536-d", icon: "sparkles", kind: "ai" },
  ],
  lanes: [
    { id: "n", from: "notion", to: "chunk", via: [[185, 40], [185, 145]] },
    { id: "d", from: "drive", to: "chunk" },
    { id: "w", from: "web", to: "chunk", via: [[185, 270], [185, 165]] },
    { id: "split", from: "chunk", to: "embed" },
    { id: "index", from: "embed", to: "space" },
    { id: "ask", from: "user", to: "plan" },
    { id: "rewrite", from: "plan", to: "qembed" },
    { id: "search", from: "qembed", to: "space", via: [[685, 440]] },
    { id: "hits", from: "space", to: "rerank" },
    { id: "context", from: "rerank", to: "llm" },
    { id: "write", from: "llm", to: "answer" },
  ],
  streams: [
    { lane: "n", rate: 3, colors: [PAPER], size: 2.6 },
    { lane: "d", rate: 4, colors: [DRIVE], size: 2.6 },
    { lane: "w", rate: 3, colors: [PAPER], size: 2.6 },
    { lane: "split", rate: 22, colors: [PAPER], size: 1.8 },
    { lane: "index", rate: 22, colors: [VOLT, PAPER], size: 1.8 },
    { lane: "ask", rate: 1.4, colors: [PAPER], size: 3 },
    { lane: "rewrite", rate: 1.4, colors: [VOLT], size: 3 },
    { lane: "search", rate: 1.4, colors: [VOLT], size: 3 },
    { lane: "hits", rate: 6, colors: [PAPER], size: 2, drop: 0.78, dropAt: 0.92 },
    { lane: "context", rate: 1.4, colors: [VOLT], size: 3 },
    { lane: "write", rate: 1.4, colors: [VOLT], size: 3 },
  ],
  stories: [
    {
      id: "returns",
      label: { en: "\"How long do returns take?\"", tr: "\"İade süresi kaç gün?\"" },
      entity: "q_20931",
      steps: [
        {
          at: "user",
          ms: 0,
          title: { en: "question asked", tr: "soru soruldu" },
          bubble: { tone: "in", text: { en: "How many days do I have to return something?", tr: "Bir ürünü iade etmek için kaç günüm var?" } },
          payload: ['{ "text": "Bir ürünü iade etmek için', '   kaç günüm var?",', '  "session": "s_8f21", "lang": "tr" }'],
        },
        {
          at: "plan",
          via: "ask",
          ms: 212,
          cue: "query",
          title: { en: "rewritten for search", tr: "aramaya göre yazıldı" },
          payload: ['query  "iade süresi gün"', 'filter { "type": "policy" }', 'history: 2 turns used'],
        },
        {
          at: "qembed",
          via: "rewrite",
          ms: 18,
          title: { en: "turned into a vector", tr: "vektöre çevrildi" },
          payload: ['[ 0.0213, -0.1148, 0.0871,', '  0.0402, -0.0067, … ]', '1536 dimensions'],
        },
        {
          at: "space",
          via: "search",
          ms: 31,
          cue: "topk",
          title: { en: "24 nearest chunks", tr: "en yakın 24 parça" },
          payload: ['scanned 48,210 chunks', 'vector + keyword (hybrid)', 'top-k 24 · best score 0.91'],
        },
        {
          at: "rerank",
          via: "hits",
          ms: 64,
          cue: "rerank",
          title: { en: "best 5 kept", tr: "en iyi 5 kaldı" },
          payload: ['iade-politikasi.pdf p.2   0.94', 'yardim/iade-adimlari      0.88', 'notion/kargo-sss          0.71', '+ 2 more · 19 discarded'],
        },
        {
          at: "llm",
          via: "context",
          ms: 690,
          title: { en: "answer from sources only", tr: "sadece kaynaktan cevap" },
          payload: ['system: answer only from [1]–[5]', 'context 2,140 tokens', 'output 61 tokens · streamed'],
        },
        {
          at: "answer",
          via: "write",
          ms: 40,
          title: { en: "sent with citations", tr: "kaynaklarıyla gönderildi" },
          bubble: { tone: "out", text: { en: "You have 14 days from delivery, return shipping is free. [1] [2]", tr: "Teslimattan itibaren 14 gününüz var, iade kargosu ücretsiz. [1] [2]" } },
          payload: ['citations [1] iade-politikasi.pdf p.2', '          [2] yardim/iade-adimlari', 'confidence 0.93'],
        },
      ],
    },
    {
      id: "not-covered",
      label: { en: "Not in the docs", tr: "Belgelerde yok" },
      entity: "q_20944",
      steps: [
        {
          at: "user",
          ms: 0,
          title: { en: "question asked", tr: "soru soruldu" },
          bubble: { tone: "in", text: { en: "Do you ship to Japan?", tr: "Japonya'ya gönderim var mı?" } },
          payload: ['{ "text": "Japonya\'ya gönderim var mı?" }'],
        },
        { at: "plan", via: "ask", ms: 198, cue: "miss", title: { en: "rewritten", tr: "yeniden yazıldı" }, payload: ['query  "uluslararası kargo japonya"'] },
        { at: "qembed", via: "rewrite", ms: 17, cue: "query", title: { en: "vector", tr: "vektör" }, payload: ['[ -0.0912, 0.0334, … ] · 1536-d'] },
        { at: "space", via: "search", ms: 29, cue: "topk", title: { en: "nothing close", tr: "yakın parça yok" }, payload: ['scanned 48,210 chunks', 'best score 0.41'] },
        {
          at: "rerank",
          via: "hits",
          ms: 58,
          cue: "rerank",
          state: "warn",
          title: { en: "below threshold", tr: "eşiğin altında" },
          payload: ['best 0.41 < required 0.62', 'decision: do not answer'],
        },
        {
          at: "answer",
          via: ["context", "write"],
          ms: 35,
          state: "warn",
          title: { en: "handed to a person", tr: "bir kişiye aktarıldı" },
          bubble: { tone: "out", text: { en: "I couldn't find this in our docs, so I've passed you to the team.", tr: "Bunu belgelerimizde bulamadım, sizi ekibe aktardım." } },
          payload: ['handoff → support inbox', 'no answer generated, nothing guessed'],
        },
      ],
    },
    {
      id: "indexing",
      label: { en: "New PDF uploaded", tr: "Yeni PDF yüklendi" },
      entity: "doc_7781",
      steps: [
        { at: "drive", ms: 0, title: { en: "file changed", tr: "dosya değişti" }, payload: ['iade-politikasi-2026.pdf', '14 pages · 312 KB', 'webhook drive.changes'] },
        { at: "chunk", via: "d", ms: 840, title: { en: "parsed into 38 chunks", tr: "38 parçaya bölündü" }, payload: ['pages 14 · tables 2', 'chunks 38 × ~512 tokens', 'overlap 64 tokens'] },
        { at: "embed", via: "split", ms: 412, title: { en: "38 vectors", tr: "38 vektör" }, payload: ['batch 38 · 1536-d', 'old version vectors: 31 removed'] },
        { at: "space", via: "index", ms: 22, cue: "insert", title: { en: "searchable now", tr: "artık aranabilir" }, payload: ['upsert 38 · index size 48,217', 'live in answers in < 2 s'] },
      ],
    },
  ],
};
