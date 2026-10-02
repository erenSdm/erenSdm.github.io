"use client";

import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { CONTACT, PROOF } from "./data";
import { Wordmark } from "./TopBar";
import { Eyebrow, PillButton, Reveal, SectionIndex } from "./ui";

/* ------------------------------------------------------------ Spotlight */
const MONOLITH_SPECS: [string, string][] = [
  ["Malzeme", "Tamamen çelik"],
  ["Genişlik", "570 · 690 · 810 · 930 mm"],
  ["Dilim", "10 · 12 · 14 · 16"],
  ["Renk", "Platin Krom · Siyah · Antrasit"],
  ["Garanti", "10 yıl"],
];

export function Spotlight() {
  return (
    <section className="bg-[#151514] py-24 text-[#E9E6E0] md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <Reveal>
          <SectionIndex n="03" label="Özel tasarım" tone="light" />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <div className="rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[calc(2rem-0.375rem)]">
                <Image
                  src="/demos/nixrad/monolith-2.webp"
                  alt="Monolith 1200 çelik dekoratif radyatör"
                  fill
                  sizes="(min-width:1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Eyebrow tone="light">Seri 01 — Monolith</Eyebrow>
              <h2 className="mt-7 font-[family-name:var(--font-nx-display)] text-[clamp(2.6rem,7vw,6rem)] font-semibold uppercase leading-[0.88] tracking-[-0.035em] [font-stretch:112%]">
                Radyatör değil,
                <span className="block text-[#C4622D]">bir duruş.</span>
              </h2>
              <p className="mt-7 max-w-md text-[16px] leading-[1.65] text-[#E9E6E0]/60">
                Farklı boylarda dikey çelik borular, duvarda ritmik bir kompozisyon
                kurar. Monolith; ısıyı verimli ileten tamamen çelik gövdesiyle
                mekâna sanatsal bir dokunuş katar ve 10 yıl garantiyle gelir.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {MONOLITH_SPECS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="font-[family-name:var(--font-nx-mono)] text-[11px] uppercase tracking-[0.18em] text-[#E9E6E0]/45">
                      {k}
                    </dt>
                    <dd className="text-right text-[14px] text-[#E9E6E0]/85">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <PillButton href="#satis" tone="ember">
                  Monolith için teklif al
                </PillButton>
                <span className="font-[family-name:var(--font-nx-mono)] text-[12px] tracking-[0.08em] text-[#E9E6E0]/50">
                  ₺51.336&apos;dan başlayan fiyatlarla
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Technology */
const HYBRID: [string, string][] = [
  ["Çelik su kanalları", "Merkezi ısıtmaya uyumlu, yüksek basınca ve korozyona dayanıklı."],
  ["Alüminyum hava kanalları", "Yüksek ısı iletkenliği — ısı çok daha hızlı yayılır."],
  ["Çelik kaynak, sıkı geçme değil", "%100 sızdırmaz; bükme ve darbe testlerinde üstün dayanım."],
  ["Tortu birikimi yok", "Alüminyum radyatörlerde sık görülen tortu oluşmaz."],
];

export function Technology() {
  return (
    <section id="teknoloji" className="bg-[#DCD7CE] py-24 text-[#151514] md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <Reveal>
          <SectionIndex n="04" label="Hibrit teknoloji" />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="max-w-[15ch] font-[family-name:var(--font-nx-display)] text-[clamp(2.2rem,6vw,5.2rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em] [font-stretch:110%]">
                Çeliğin gücü, alüminyumun hızı.
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] bg-[#151514]/10 ring-1 ring-[#151514]/10 sm:grid-cols-2">
                {HYBRID.map(([t, d], i) => (
                  <li key={t} className="bg-[#E9E6E0] p-6 md:p-7">
                    <span className="font-[family-name:var(--font-nx-mono)] text-[11px] tracking-[0.18em] text-[#C4622D]">
                      0{i + 1}
                    </span>
                    <h3 className="mt-3 text-[17px] font-medium tracking-[-0.01em]">{t}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#151514]/60">{d}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-[2rem] bg-[#151514]/[0.05] p-1.5 ring-1 ring-[#151514]/[0.08]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-0.375rem)]">
                <Image
                  src="/demos/nixrad/nirvana-1.webp"
                  alt="Nirvana hibrit dekoratif radyatör"
                  fill
                  sizes="(min-width:1024px) 38vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 rounded-[1.1rem] bg-[#E9E6E0]/88 p-4 backdrop-blur-md">
                  <p className="font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.18em] text-[#151514]/50">
                    Nirvana · TSE sonucu (Δt=60)
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-nx-display)] text-[30px] font-semibold leading-none tracking-[-0.02em] [font-stretch:110%]">
                    1638 <span className="text-[16px] font-medium text-[#151514]/55">W/m ısıl güç</span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 border-t border-[#151514]/15 pt-10 md:mt-24 lg:grid-cols-4">
          {PROOF.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.06}>
              <dt className="font-[family-name:var(--font-nx-display)] text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-none tracking-[-0.04em] [font-stretch:112%]">
                {p.value}
                {p.unit && <span className="ml-1 text-[0.4em] font-medium tracking-[-0.01em] text-[#151514]/50">{p.unit}</span>}
              </dt>
              <dd className="mt-3 max-w-[22ch] text-[13px] leading-snug text-[#151514]/60">{p.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Contact */
export function Contact() {
  return (
    <section id="satis" className="bg-[#E9E6E0] py-24 text-[#151514] md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <Reveal>
          <SectionIndex n="05" label="Satış noktaları" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-10 font-[family-name:var(--font-nx-display)] text-[clamp(2.6rem,9vw,8.5rem)] font-semibold uppercase leading-[0.86] tracking-[-0.04em] [font-stretch:112%]">
            Size en yakın
            <span className="block text-[#151514]/35">Nixrad noktası.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-20 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7">
            <div className="h-full rounded-[2rem] bg-[#151514]/[0.04] p-1.5 ring-1 ring-[#151514]/[0.07]">
              <div className="flex h-full flex-col justify-between gap-10 rounded-[calc(2rem-0.375rem)] bg-[#151514] p-7 text-[#E9E6E0] md:p-10">
                <div>
                  <Eyebrow tone="light">Merkez</Eyebrow>
                  <p className="mt-6 font-[family-name:var(--font-nx-display)] text-[28px] font-semibold uppercase leading-none tracking-[-0.02em] [font-stretch:110%] md:text-[40px]">
                    {CONTACT.hq}
                  </p>
                  <p className="mt-3 text-[15px] text-[#E9E6E0]/55">
                    {CONTACT.city} — Türkiye genelindeki yetkili satış noktalarına
                    yönlendirme için bize ulaşın.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={CONTACT.phoneHref}
                    className="group flex items-center justify-between rounded-2xl bg-white/[0.05] px-5 py-4 ring-1 ring-white/10 transition-colors duration-500 hover:bg-white/[0.09]"
                  >
                    <span className="flex items-center gap-3 text-[15px] tabular-nums">
                      <Phone className="h-4 w-4 text-[#C4622D]" strokeWidth={1.25} />
                      {CONTACT.phone}
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-50 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.25} />
                  </a>
                  <a
                    href={`mailto:${CONTACT.sales}`}
                    className="group flex items-center justify-between rounded-2xl bg-white/[0.05] px-5 py-4 ring-1 ring-white/10 transition-colors duration-500 hover:bg-white/[0.09]"
                  >
                    <span className="flex min-w-0 items-center gap-3 truncate text-[15px]">
                      <Mail className="h-4 w-4 shrink-0 text-[#C4622D]" strokeWidth={1.25} />
                      {CONTACT.sales}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.25} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="h-full rounded-[2rem] bg-[#151514]/[0.04] p-1.5 ring-1 ring-[#151514]/[0.07]">
              <div className="flex h-full flex-col justify-between gap-10 rounded-[calc(2rem-0.375rem)] bg-[#F4F2EE] p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] md:p-10">
                <div>
                  <Eyebrow>Bayilik</Eyebrow>
                  <p className="mt-6 font-[family-name:var(--font-nx-display)] text-[28px] font-semibold uppercase leading-none tracking-[-0.02em] [font-stretch:110%] md:text-[40px]">
                    Nixrad bayisi olun.
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#151514]/60">
                    Ürünlerimizi satmak istiyorsanız başvurunuzu iletin; ekibimiz
                    sizinle iletişime geçsin.
                  </p>
                </div>
                <PillButton href={`mailto:${CONTACT.email}?subject=Bayilik%20Ba%C5%9Fvurusu`} className="self-start">
                  Başvuru yap
                </PillButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Footer */
export function Footer() {
  return (
    <footer className="overflow-hidden bg-[#151514] pt-16 text-[#E9E6E0] md:pt-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Wordmark className="text-[18px]" />
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[#E9E6E0]/50">
              Dekoratif radyatör ve havlupan çözümleri. 10 yıl garanti, 50 bar test.
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.2em] text-[#E9E6E0]/40">Ürünler</p>
            <ul className="mt-4 space-y-2 text-[14px] text-[#E9E6E0]/75">
              <li><a href="#kategoriler" className="hover:text-[#E9E6E0]">Radyatörler</a></li>
              <li><a href="#kategoriler" className="hover:text-[#E9E6E0]">Havlupanlar</a></li>
              <li><a href="#koleksiyon" className="hover:text-[#E9E6E0]">Koleksiyon</a></li>
            </ul>
          </div>
          <div>
            <p className="font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.2em] text-[#E9E6E0]/40">İletişim</p>
            <ul className="mt-4 space-y-2 text-[14px] text-[#E9E6E0]/75">
              <li><a href={CONTACT.phoneHref} className="hover:text-[#E9E6E0]">{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-[#E9E6E0]">{CONTACT.email}</a></li>
              <li>{CONTACT.city}</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        lang="en"
        className="mt-16 select-none whitespace-nowrap text-center font-[family-name:var(--font-nx-display)] text-[25vw] font-bold uppercase leading-[0.72] tracking-[-0.04em] text-[#E9E6E0]/[0.06] [font-stretch:125%] md:mt-20"
      >
        Nixrad
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-white/10 px-5 py-6 font-[family-name:var(--font-nx-mono)] text-[10px] uppercase tracking-[0.18em] text-[#E9E6E0]/40 md:flex-row md:justify-between md:px-10 lg:px-14">
        <span>© 2026 Nixrad. Tüm hakları saklıdır.</span>
        <span>TSE · CE · Türk Patent</span>
      </div>
    </footer>
  );
}
