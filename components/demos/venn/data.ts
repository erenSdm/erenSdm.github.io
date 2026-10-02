/* Venn content — copy ported verbatim from venntr.com (apps/web). */

export type VentSlug = "sport" | "art" | "music" | "fun" | "chill" | "other";

/** Vent category palette from @venn/types (dark-theme marker bodies). */
export const VENT: Record<VentSlug, { color: string; glow: string }> = {
  sport: { color: "#F87171", glow: "#B91C1C" },
  art: { color: "#4ADE80", glow: "#15803D" },
  music: { color: "#60A5FA", glow: "#1D4ED8" },
  fun: { color: "#FB923C", glow: "#C2410C" },
  chill: { color: "#D97706", glow: "#78350F" },
  other: { color: "#818CF8", glow: "#3730A3" },
};

/** Hero map markers — % of the Istanbul map image (lib/hero-vents.ts). */
export const HERO_VENTS: { slug: VentSlug; member: boolean; x: number; y: number }[] = [
  { slug: "music", member: true, x: 46.97, y: 49.07 },
  { slug: "sport", member: false, x: 49.51, y: 46.28 },
  { slug: "fun", member: false, x: 47.21, y: 38.38 },
  { slug: "art", member: true, x: 52.06, y: 70.9 },
  { slug: "chill", member: false, x: 50.61, y: 54.18 },
  { slug: "art", member: false, x: 46, y: 62.54 },
  { slug: "chill", member: false, x: 51.7, y: 76.01 },
  { slug: "music", member: false, x: 50.12, y: 30.01 },
  { slug: "other", member: false, x: 51.21, y: 16.06 },
  { slug: "fun", member: false, x: 52.06, y: 44.42 },
  { slug: "sport", member: true, x: 54, y: 30.48 },
  { slug: "chill", member: false, x: 52.43, y: 28.62 },
  { slug: "art", member: false, x: 48.06, y: 43.96 },
  { slug: "music", member: false, x: 46.6, y: 51.86 },
  { slug: "fun", member: false, x: 45.63, y: 55.58 },
  { slug: "other", member: false, x: 42.6, y: 52.79 },
  { slug: "art", member: false, x: 46.12, y: 39.31 },
  { slug: "other", member: false, x: 48.06, y: 35.13 },
  { slug: "chill", member: false, x: 56.19, y: 45.35 },
  { slug: "sport", member: false, x: 33.86, y: 75.55 },
  { slug: "chill", member: false, x: 37.26, y: 68.58 },
  { slug: "music", member: false, x: 32.04, y: 65.79 },
  { slug: "sport", member: false, x: 31.43, y: 48.14 },
  { slug: "fun", member: false, x: 34.71, y: 46.28 },
  { slug: "art", member: false, x: 38.11, y: 37.45 },
  { slug: "chill", member: true, x: 40.66, y: 43.96 },
  { slug: "sport", member: false, x: 33.01, y: 17.46 },
  { slug: "other", member: false, x: 24.76, y: 23.04 },
  { slug: "fun", member: false, x: 22.09, y: 65.33 },
];

/** Waitlist goal + the site's own offline placeholder count. */
export const WAITLIST = { total: 247, goal: 1000 };

export const MOODS: {
  key: string;
  label: string;
  slug: VentSlug;
  event: { tag: string; title: string; place: string; time: string; going: number };
}[] = [
  { key: "kafa", label: "Kafa dağıtmak", slug: "chill", event: { tag: "Chill", title: "Sahilde çay & sohbet", place: "Moda, Kadıköy", time: "Cumartesi 16:00", going: 7 } },
  { key: "enerji", label: "Enerji atmak", slug: "sport", event: { tag: "Spor", title: "5v5 halı saha, 2 kişi eksik", place: "Beşiktaş", time: "Bu akşam 21:00", going: 8 } },
  { key: "uret", label: "Üretmek & öğrenmek", slug: "art", event: { tag: "Sanat", title: "Başlangıç seramik workshopu", place: "Karaköy", time: "Pazar 14:00", going: 6 } },
  { key: "muhabbet", label: "Sadece muhabbet", slug: "other", event: { tag: "Sohbet", title: "Dil kafe: herkes bir dil pratik yapar", place: "Cihangir", time: "Salı 20:00", going: 11 } },
  { key: "gece", label: "Gece & müzik", slug: "music", event: { tag: "Müzik", title: "Akustik sahne, küçük mekân", place: "Beyoğlu", time: "Cuma 22:00", going: 14 } },
  { key: "kesif", label: "Yeni yer keşfet", slug: "fun", event: { tag: "Keşif", title: "Adalar'a birlikte vapur turu", place: "Kabataş iskele", time: "Yarın 10:00", going: 9 } },
];

export const PERKS = [
  { title: "Özel kurucu rozetleri", body: "Yayında hesabında beliren, sonradan alınamayan rozetler. Buraya ilk gelenlerden olduğunun kalıcı işareti." },
  { title: "Erken tanışma fırsatları", body: "İlk kadro küçük ve seçili. Kalabalık büyümeden, doğru insanlarla önce sen tanış." },
  { title: "Venn'i beraber kuralım", body: "Geri bildirimin yön veriyor. Buranın nasıl bir yer olacağını ilk 1000 kişi belirliyor." },
];

export const PANELS = [
  { eyebrow: "Harita", title: "Yakınındaki her buluşma, tek haritada.", body: "Bir vente dokun, kimlerin geldiğini gör, katıl. Gitmek istediğin yere giden birileri kesin vardır." },
  { eyebrow: "Odalar", title: "Konuş, planla, gerçekten buluş.", body: "Grup odasına gir, saati ve yeri birlikte belirleyin. Muhabbet lafta kalmasın, plana dönüşsün." },
  { eyebrow: "Oluştur", title: "Aradığın etkinlik yoksa, sen kur.", body: "Dakikalar içinde kendi buluşmanı aç, haritada yayına al. Sonra doğru insanlar kapına gelsin." },
] as const;

export const SWAPS = [
  { reject: "Sonsuz akış, bitmeyen kaydırma", title: "Grup ve etkinlik önce", body: "Birlikte yapılacak gerçek şeyler. Grup kur, etkinliğe katıl, hayatta buluş." },
  { reject: "Algoritma senin yerine eşleştirir", title: "Öneri sunar, kararı sen verirsin", body: "Algoritma yalnızca önerir. Kiminle, nerede, ne zaman tanışacağın hep sende." },
  { reject: "Konumun hep açık, hep izlenir", title: "Konumun sana ait", body: "Kiminle paylaşacağına sen karar verirsin. Haritayı tamamen kapatabilirsin." },
  { reject: "Reklam, takip, veri satışı", title: "Reklamsız ve takipsiz", body: "Reklam yok, izleme yok, veri satışı yok. Sakin bir alan, gürültüsüz bir akış." },
];

export const CATEGORIES: { label: string; examples: string[]; slug: VentSlug; wide?: boolean }[] = [
  { label: "Yeme İçme", examples: ["kahve turu", "brunch", "şarap tadımı"], slug: "chill", wide: true },
  { label: "Aktif Yaşam", examples: ["sabah koşusu", "bisiklet", "yoga"], slug: "sport" },
  { label: "Eğlence", examples: ["oyun gecesi", "karaoke", "piknik"], slug: "fun" },
  { label: "Etkinlik ve Gece", examples: ["konser", "stand-up", "gece yürüyüşü"], slug: "music", wide: true },
  { label: "Düşünce ve Üretim", examples: ["kitap kulübü", "atölye", "workshop"], slug: "art" },
  { label: "Keşif", examples: ["şehir turu", "müze", "doğa yürüyüşü"], slug: "fun" },
  { label: "Sohbet Kültürü", examples: ["kitap sohbeti", "felsefe kafe", "dil pratiği"], slug: "other" },
  { label: "Dijital Dünya", examples: ["board game", "e-spor", "kod buluşması"], slug: "music" },
  { label: "El İşi ve Hobiler", examples: ["seramik", "örgü", "ahşap atölye"], slug: "art" },
  { label: "Kariyer ve Gelişim", examples: ["networking", "mentörlük", "sunum pratiği"], slug: "other" },
];

export const TRUST = [
  { title: "Haritayı kapatabilirsin", body: "Konumun varsayılan olarak gizli. Haritayı tamamen kapatmak algoritmaya zarar vermez." },
  { title: "Reklam ve takip yok", body: "Reklam SDK'sı yok, izleme yok, veri satışı yok. Kendi sunucumuzda, PII kapalı." },
  { title: "İnsan denetimli moderasyon", body: "Şikayetleri ekibimiz inceler, hedef süre 48 saat. Yapay zekâ değil, insan." },
];

export const TRUST_CHIPS = [
  "Her yerde şikayet ve engelle",
  "18 yaş ve üzeri, sunucuda zorunlu",
  "Kademeli, ekip onaylı yaptırım",
];

export const CHANNELS = [
  { label: "Instagram", handle: "@venn", body: "Perde arkası, topluluk anları ve duyurular. Asıl buluşma noktamız." },
  { label: "Telegram", handle: "Venn topluluğu", body: "Sohbet, erken haberler ve ilk kullanıcılarla tanışma." },
  { label: "WhatsApp", handle: "Venn grubu", body: "Küçük, sıcak grup. Sorularını sor, gelişmeleri yakala." },
];

export const FAQS = [
  { q: "Venn nedir?", a: "Venn, grup ve etkinlik odaklı sakin bir sosyal bağlantı uygulamasıdır. Ortak ilgi alanlarına göre insanları anlamlı gruplarda buluşturur ve gerçek hayatta buluşmayı kolaylaştırır. Bir dating uygulaması değildir." },
  { q: "Venn bir dating uygulaması mı?", a: "Hayır. Venn önce arkadaşlık ve etkinlik odaklıdır. Flört, isteyene özel, ana menüde bile görünmeyen gizli bir katman olarak vardır ve dilediğin an tamamen kapatılabilir." },
  { q: "Venn ne zaman çıkıyor?", a: "Uygulama, ilk 1000 erken erişim üyesi toplandığında App Store ve Google Play'de yayına girer. Barın doluluğunu ana sayfadan canlı takip edebilirsin." },
  { q: "Erken erişime nasıl katılırım?", a: "E-posta, Google veya Apple ile ücretsiz kaydolman yeterli. İlk 1000 kişi arasına girersen kurucu kadroda kalır ve uygulama yayına girince Kurucu/Erken Üye rozetini kazanırsın." },
  { q: "Venn ücretsiz mi?", a: "Evet, katılmak ücretsiz. Reklam yok, veri satışı yok. Grup açma ve etkinlik oluşturma gibi haklar uygulama içinde satılmaz, kullanımla kazanılır." },
  { q: "Verilerim ve gizliliğim güvende mi?", a: "Konumun varsayılan olarak gizlidir ve haritayı tamamen kapatabilirsin. Reklam ve takip SDK'sı kullanmıyoruz. Moderasyon kullanıcı şikayetleri ve ekip incelemesiyle yapılır; hedef inceleme süresi 48 saattir." },
  { q: "Konumum başkalarına görünür mü?", a: "Sen izin vermedikçe hayır. Konum modları sende: gizli, yalnızca aktif etkinlik sırasında ya da sadece takip ettiklerin. İstediğin an haritayı kapatabilirsin." },
];
