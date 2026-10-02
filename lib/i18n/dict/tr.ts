import type { Dictionary } from "./en";

export const tr: Dictionary = {
  meta: {
    title: "MONOLITH — Dijital Ürün Stüdyosu | Web & Uygulama Tasarımı",
    description:
      "MONOLITH, İstanbul merkezli bir dijital ürün stüdyosu. Web siteleri, mobil uygulamalar ve backend otomasyonları — hepsi tıklayıp içine girebileceğin canlı projeler.",
  },
  nav: {
    items: [
      { id: "services", label: "Web siteleri" },
      { id: "mobile", label: "Mobil" },
      { id: "systems", label: "Otomasyon" },
      { id: "process", label: "Süreç" },
      { id: "contact", label: "İletişim" },
    ],
    cta: "Proje başlat",
    menu: "Menü",
    close: "Kapat",
    lang: "Dili değiştir",
  },
  hero: {
    kicker: "Dijital ürün stüdyosu — İstanbul",
    title: ["Akılda", "kalmak için", "tasarlandı."],
    body: "Web siteleri, mobil uygulamalar ve onları ayakta tutan sistemler — küçük bir stüdyo tarafından uçtan uca tasarlanır ve geliştirilir. Strateji, arayüz, kod ve hareket; aradaki kopukluklar olmadan.",
    cta: "İşleri gör",
    secondary: "Hizmetler",
    liveBuilds: "canlı proje",
    ticker: [
      "Web platformları",
      "Dashboard'lar",
      "E-ticaret",
      "Marka landing sayfaları",
      "Mobil uygulamalar",
      "Tasarım sistemleri",
      "Hareket tasarımı",
      "Frontend mühendisliği",
    ],
  },
  intro: {
    kicker: "Stüdyo",
    title: ["Tek stüdyo.", "Bütün katmanlar."],
    lead: "MONOLITH full-stack çalışan bir stüdyo: ekranı tasarlayan, arayüzü kodlayan ve arkasındaki sistemi kuran aynı eller.",
    body: "Bir ürün genelde |tasarım|, |frontend| ve |backend| arasında üç kez el değiştirir ve her devirde bir şeyler kaybolur. Burada her katman aynı masada yapılıyor. Bu yüzden ekranda gördüğün hareketle arkada akan veri aynı dili konuşuyor.",
    parts: [
      {
        target: "services",
        title: "Web siteleri",
        sub: "Platformlar, mağazalar, marka sayfaları",
        body: "Bakış açısı olan landing sayfaları, e-ticaret vitrinleri, SaaS panelleri ve gerçek zamanlı 3D sahneler. Next.js ve React ile hızlı, erişilebilir ve akılda kalan arayüzler.",
        tags: ["Next.js", "React", "Three.js", "GSAP"],
        cta: "Web sitelerini gör",
      },
      {
        target: "mobile",
        title: "Mobil uygulamalar",
        sub: "iOS ve Android arayüzleri",
        body: "Başparmak için tasarlanmış uygulama ekranları: yerel hissettiren geçişler, bir bakışta okunan veriler ve kayıttan ödemeye kadar uçtan uca çalışan akışlar.",
        tags: ["iOS", "Android", "Etkileşim", "Prototip"],
        cta: "Uygulamaları gör",
      },
      {
        target: "systems",
        title: "Backend ve otomasyon",
        sub: "API'ler, botlar, yapay zekâ",
        body: "Ekranın arkasındaki kısım: API'ler ve veritabanları, borsa ve ödeme entegrasyonları, Telegram ve WhatsApp botları, yapay zekâ destekli arama ve tekrar eden işi insanların elinden alan otomasyonlar.",
        tags: ["API", "Webhook", "AI / RAG", "Bot"],
        cta: "Sistemleri gör",
      },
    ],
  },
  services: {
    kicker: "Web siteleri",
    title: "Ne inşa ediyoruz",
    sub: "Web projelerimizden bir seçki: yayındaki müşteri sitelerinden stüdyo konseptlerine. Aşağıdaki her pencere ekran görüntüsü değil, çalışan gerçek site. Kaydırarak gez ya da birini tam ekran aç.",
    live: "Canlı",
    open: "Aç",
  },
  mobile: {
    label: "Elinde",
    title: "Mobil uygulamalar",
    open: "Uygulamayı aç",
  },
  process: {
    kicker: "Süreç",
    title: "İş nasıl ilerliyor",
    steps: [
      {
        n: "01",
        title: "Sinyal",
        body: "Brief'ten ve konunun gerçek dünyasından başlarız — malzemeleri, dili, gördüğü iş.",
      },
      {
        n: "02",
        title: "Plan",
        body: "Token'lar, tip ölçeği ve bir imza hamle. İşin hatırlanacağı o tek şey.",
      },
      {
        n: "03",
        title: "İnşa",
        body: "Gerçek bileşenler, gerçek hareket, gerçek içerik. İlerledikçe eleştirir, işe yaramayanı keseriz.",
      },
      {
        n: "04",
        title: "Teslim",
        body: "Mobile duyarlı, varsayılan olarak erişilebilir, yük altında hızlı. Temiz şekilde teslim edilir.",
      },
    ],
  },
  contact: {
    kicker: "İletişim",
    title: ["Keskin bir şey", "birlikte", "inşa edelim."],
    body: "Şablondan daha iyisini hak eden bir ürünün mü var? Ne yaptığını ve kimin için olduğunu anlat — bir iş günü içinde dönüyoruz.",
    cta: "Proje başlat",
    availabilityLabel: "Müsaitlik",
    availability: "Q4 2026 — Q1 2027 için rezervasyon açık",
    emailLabel: "Doğrudan",
    locationLabel: "Stüdyo",
    location: "İstanbul, TR — dünya çapında uzaktan",
  },
  footer: {
    tag: "Dijital ürün stüdyosu",
    backToTop: "Başa dön",
    colophon: "Next.js, GSAP ve fazlaca kahveyle yapıldı.",
  },
  common: {
    close: "Kapat",
    menu: "Menü",
    loading: "Yükleniyor",
  },
};
