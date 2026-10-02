import type { Dictionary } from "./en";

export const tr: Dictionary = {
  meta: {
    title: "MONOLITH — Dijital Ürün Stüdyosu | Web & Uygulama Tasarımı",
    description:
      "MONOLITH, İstanbul merkezli bir dijital ürün stüdyosu. Web platformları, e-ticaret, marka landing sayfaları, mobil uygulamalar ve tasarım sistemleri — hepsi tıklayıp içine girebileceğin canlı projeler.",
  },
  nav: {
    items: [
      { id: "top", label: "Ana Sayfa" },
      { id: "services", label: "Hizmetler" },
      { id: "work", label: "İşler" },
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
    title: ["Donanım gibi", "inşa edilen", "arayüzler."],
    body: "MONOLITH, kaydırılıp geçilmek yerine akılda kalmak isteyen markalar için web siteleri ve uygulamalar tasarlar ve geliştirir. Strateji, arayüz, kod ve hareket — tek çatı altında.",
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
    title: ["Beş disiplin.", "Tek stüdyo."],
    lead: "Birbirine kusursuz kenetlenen beş hizmet:",
    body: "Bir ürünü |web platformlarına| ve |mağazalara| dönüştürür, markaya omurgası olan bir |landing sayfası| verir, |mobil uygulamalarla| cebine taşır ve hepsini hareket eden bir |tasarım sistemiyle| bir arada tutarız.",
    stats: [
      { key: "builds", label: "Canlı proje" },
      { key: "disciplines", label: "Disiplin" },
      { key: "fps", label: "Hareket hedefi" },
      { key: "templates", label: "Kullanılan şablon" },
    ],
  },
  services: {
    kicker: "Hizmetler",
    title: "Ne inşa ediyoruz",
    sub: "Aşağıdaki her disiplin gerçek bir projeyle çalışıyor. Sağdan bir proje seç — ekran görüntüsü değil, canlı.",
    live: "Canlı",
    open: "Aç",
    builds: "proje",
    items: {
      platforms: {
        title: "Web platformları & dashboard'lar",
        tags: ["SaaS", "Dashboard", "Gerçek zamanlı veri", "Geliştirici araçları"],
        body: "Yük altında sakin kalan, veri yoğun ürünler. Önce bilgi hiyerarşisini tasarlıyor, sonra yüzeyi React ile — yerel yazılım gibi tepki veren grafikler, tablolar ve komut çubuklarıyla — inşa ediyoruz.",
        cta: "Platformları keşfet",
      },
      commerce: {
        title: "E-ticaret",
        tags: ["Vitrinler", "Ürün sayfaları", "Ödeme", "Drop'lar"],
        body: "Ürün fotoğrafı ile tipografinin aynı podyumu paylaştığı vitrinler. Lüks kataloglardan geri sayımlı drop'lara kadar her akış, müşteriyi gezintiden sepete taşımak için tasarlanır.",
        cta: "E-ticareti keşfet",
      },
      brand: {
        title: "Marka landing sayfaları",
        tags: ["Lansmanlar", "Kampanyalar", "Scroll hikâyeleri", "Gerçek müşteriler"],
        body: "Bir bakış açısı olan landing sayfaları. Dev tipografi, scroll koreografisi ve yerine oturan rakamlar — lansmanlar, yatırım turları ve olduğu kadar keskin görünmek isteyen şirketler için.",
        cta: "Landing sayfalarını keşfet",
      },
      mobile: {
        title: "Mobil uygulamalar",
        tags: ["iOS", "Android", "Fintek", "Sağlık", "Mesajlaşma"],
        body: "Sunum için değil, başparmak için tasarlanmış uygulama arayüzleri. Yerel hissettiren hareket, bir bakışta okunan veri ve insanların günde iki kez açtığı ekranlar.",
        cta: "Uygulamaları keşfet",
      },
      systems: {
        title: "Tasarım sistemleri & hareket",
        tags: ["Token'lar", "Tip ölçekleri", "Bileşenler", "Hareket spec'leri"],
        body: "Bu sayfadaki her proje kendi token setiyle çalışıyor — renk, tipografi, boşluk, easing. Bu sistemi belgelenmiş şekilde teslim ediyoruz; ekibin bir sonraki ekranı bizsiz yayına alır.",
        cta: "Tüm sistemleri gör",
      },
    },
    systemsCaption: "aksan sistemi, her projeye bir tane",
  },
  work: {
    kicker: "Dizin",
    title: "Tüm işler",
    sub: "Stüdyodaki her proje, canlı. Tam projeyi açmak için herhangi bir satıra dokun.",
    web: "Web",
    mobile: "Mobil",
    open: "Projeyi aç",
  },
  mobile: {
    label: "Elinde",
    title: "Mobil uygulamalar",
    subtitle: "Bir ekrandan diğerine geçmek için kaydır. Her telefon gerçek uygulamayı çalıştırıyor.",
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
