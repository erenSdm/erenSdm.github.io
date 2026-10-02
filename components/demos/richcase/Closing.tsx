"use client";

import { Mail } from "lucide-react";
import { GOLD, GOLD_HI, Reveal, Wordmark, fBody, fDisplay, fMono } from "./ui";

function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export function Community() {
  return (
    <section id="topluluk" className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(160deg,#1a1a1a_0%,#0f0f0f_50%,#060606_100%)] px-6 py-16 text-center md:px-16 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-full opacity-60 blur-[100px]"
              style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.22), transparent)" }}
            />
            <h2
              className={`${fDisplay} relative mx-auto max-w-[14ch] text-[clamp(2.4rem,8.5vw,5.2rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white`}
              style={{ fontStretch: "112%" }}
            >
              Gruba katıl, <span style={{ color: GOLD_HI }}>içeride ol.</span>
            </h2>
            <p className={`${fBody} relative mx-auto mt-7 max-w-[44ch] text-[16.5px] leading-[1.65] text-[#9a9a9a]`}>
              Piyasa yorumları, bot güncellemeleri ve üye sohbeti — hepsi RichCase Telegram grubunda. Katıl, topluluğun nabzını tut.
            </p>
            <div className="relative mt-10 flex flex-col items-center gap-4">
              <a
                href="https://t.me/richcase"
                target="_blank"
                rel="noopener noreferrer"
                className={`${fBody} group inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-6 text-[15px] font-semibold text-[#0a0a0a] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] active:scale-[0.98]`}
                style={{
                  background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD})`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 30px -12px rgba(212,175,55,0.55)",
                }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a]/90 text-[#E6C75A] transition-transform duration-500 group-hover:rotate-[-8deg]">
                  <TelegramIcon className="h-4 w-4" />
                </span>
                Gruba katıl
              </a>
              <span className={`${fMono} text-[11px] uppercase tracking-[0.2em] text-[#6b6b6b]`}>Ücretsiz · Herkese açık</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const COLS = [
  { title: "Ürün", links: ["Özellikler", "Fiyatlar", "Nasıl çalışır", "Dökümantasyon"] },
  { title: "Şirket", links: ["Hakkımızda", "Blog", "İletişim", "Kariyer"] },
  { title: "Yasal", links: ["Gizlilik Politikası", "Kullanım Şartları", "Risk Bilgilendirmesi", "İade Politikası"] },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080808]">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demos/richcase/rc-32x32.png" alt="" width={28} height={28} className="h-7 w-7 rounded-[8px]" />
              <Wordmark className="text-[20px]" />
            </div>
            <p className={`${fBody} mt-5 max-w-[34ch] text-[14px] leading-[1.6] text-[#7a7a7a]`}>
              Binance Futures için profesyonel otomatik kripto ticaret botu. Hesabını bağla, kazancı izle.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title} className={c.title === "Yasal" ? "col-span-2 sm:col-span-1" : ""}>
              <h3 className={`${fMono} text-[10.5px] uppercase tracking-[0.2em] text-[#C0C0C0]`}>{c.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className={`${fBody} text-[14px] text-[#7a7a7a] transition-colors duration-300 hover:text-[#E6C75A]`}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
          <div className={`${fMono} text-[10.5px] uppercase tracking-[0.2em]`} style={{ color: GOLD }}>
            Risk uyarısı
          </div>
          <p className={`${fBody} mt-3 text-[13px] leading-[1.65] text-[#6f6f6f]`}>
            Kripto para ticareti yüksek risk içerir ve her yatırımcıya uygun değildir. Vadeli işlem, hisse ve opsiyon değerleri
            dalgalanabilir; bu nedenle ilk yatırımdan daha fazlasını kaybedebilirsiniz. Geçmiş performans gelecek garantisi
            vermez. RC Platform, kullanıcıların ticaret zararlarından sorumlu değildir.
          </p>
        </div>

        <div className={`${fMono} mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-[11px] uppercase tracking-[0.16em] text-[#5a5a5a] md:flex-row md:items-center`}>
          <span>© 2026 RICHCASE PLATFORM · TÜM HAKLARI SAKLIDIR</span>
          <a href="mailto:support@richcase.com" className="inline-flex items-center gap-2 normal-case tracking-normal text-[#7a7a7a] hover:text-[#E6C75A]">
            <Mail className="h-3.5 w-3.5" /> support@richcase.com
          </a>
        </div>
      </div>
    </footer>
  );
}
