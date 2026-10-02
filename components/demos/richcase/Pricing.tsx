"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { GOLD, GOLD_HI, Reveal, fBody, fDisplay, fMono } from "./ui";

/* Real plans from rc-platform/frontend-landing Pricing.tsx */
const FEATURES = ["Tam otomatik trading", "Sadece Binance", "Kaldıraçlı işlemler", "Anlık bildirimler", "7/24 Destek"];
const PLANS = [
  { name: "Lite", limit: "500", price: "75" },
  { name: "Pro", limit: "1.000", price: "110" },
  { name: "Max", limit: "1.500", price: "150", highlight: true },
  { name: "Elite", limit: "2.000", price: "250" },
  { name: "Ultimate", limit: "5.000", price: "550" },
];
const INITIAL = 2;

export function Pricing() {
  const scroller = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(INITIAL);

  // Center the recommended plan on mobile carousels.
  useEffect(() => {
    const el = scroller.current;
    const card = cards.current[INITIAL];
    if (!el || !card) return;
    const t = window.setTimeout(() => {
      if (el.scrollWidth <= el.clientWidth) return;
      const er = el.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      el.scrollLeft += cr.left + cr.width / 2 - (er.left + er.width / 2);
      setActive(INITIAL);
    }, 120);
    return () => window.clearTimeout(t);
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const er = el.getBoundingClientRect();
    const center = er.left + er.width / 2;
    let best = 0;
    let dist = Infinity;
    cards.current.forEach((c, i) => {
      if (!c) return;
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setActive(best);
  };

  return (
    <section id="paketler" className="relative overflow-hidden border-t border-white/[0.06] bg-[#0d0d0e] py-24 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.16), transparent)" }}
      />
      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal>
          <h2
            className={`${fDisplay} text-[clamp(2.8rem,10vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white`}
            style={{ fontStretch: "115%" }}
          >
            Paketini <span style={{ color: GOLD_HI }}>seç</span>
          </h2>
          <p className={`${fBody} mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-[#9a9a9a]`}>
            Sadece kazandıkça büyüt. Tüm paketlerde haftalık ödeme, uzun vadeli taahhüt yok.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div
          ref={scroller}
          onScroll={onScroll}
          className="relative mx-auto mt-14 max-w-[1240px] snap-x snap-mandatory overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:mt-20 md:px-8 xl:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex gap-3 xl:grid xl:grid-cols-5">
            {PLANS.map((p, i) => {
              const hi = !!p.highlight;
              return (
                <li
                  key={p.name}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className={`w-[76vw] max-w-[300px] shrink-0 snap-center transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] xl:w-auto xl:max-w-none xl:opacity-100 ${
                    active === i ? "opacity-100" : "opacity-60 xl:opacity-100"
                  } ${hi ? "xl:-translate-y-3" : ""}`}
                >
                  <div
                    className={`h-full rounded-[1.75rem] p-1.5 ${hi ? "" : "border border-white/[0.07] bg-white/[0.02]"}`}
                    style={
                      hi
                        ? {
                            background: `linear-gradient(160deg, ${GOLD_HI}, rgba(212,175,55,0.25) 45%, rgba(212,175,55,0.05))`,
                            boxShadow: "0 30px 80px -30px rgba(212,175,55,0.45)",
                          }
                        : undefined
                    }
                  >
                    <div className="flex h-full flex-col rounded-[calc(1.75rem-0.375rem)] bg-[#0f0f10] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <div className="flex items-center justify-between">
                        <h3
                          lang="en"
                          className={`${fDisplay} text-[1.6rem] font-black uppercase leading-none tracking-[-0.02em]`}
                          style={{ color: hi ? GOLD_HI : "#f5f5f5", fontStretch: "110%" }}
                        >
                          {p.name}
                        </h3>
                        {hi && (
                          <span
                            className={`${fMono} rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#0a0a0a]`}
                            style={{ background: GOLD }}
                          >
                            Tavsiye
                          </span>
                        )}
                      </div>

                      <div className="mt-7 border-b border-white/[0.06] pb-6">
                        <div className={`${fMono} text-[10.5px] uppercase tracking-[0.16em] text-[#6b6b6b]`}>Yönetilen bakiye</div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span
                            className={`${fDisplay} text-[2rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums`}
                            style={{ color: hi ? GOLD_HI : "#d4d4d4" }}
                          >
                            {p.limit}
                          </span>
                          <span className={`${fMono} text-[11px] text-[#6b6b6b]`}>USDT</span>
                        </div>
                        <div className="mt-6 flex items-baseline gap-1">
                          <span className={`${fDisplay} text-[1.15rem] font-bold text-[#7a7a7a]`}>$</span>
                          <span className={`${fDisplay} text-[3.2rem] font-black leading-none tracking-[-0.04em] text-white tabular-nums`}>
                            {p.price}
                          </span>
                        </div>
                        <div className={`${fMono} mt-2 text-[10.5px] uppercase tracking-[0.16em] text-[#6b6b6b]`}>/ hafta</div>
                      </div>

                      <ul className="mt-6 flex flex-1 flex-col gap-3">
                        {FEATURES.map((f) => (
                          <li key={f} className={`${fBody} flex items-center gap-3 text-[13.5px] text-[#c4c4c4]`}>
                            <span
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                              style={{ background: hi ? "rgba(212,175,55,0.22)" : "rgba(255,255,255,0.05)" }}
                            >
                              <Check className="h-2.5 w-2.5" style={{ color: hi ? GOLD_HI : "#9a9a9a" }} strokeWidth={3} />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <a
                        href="#top"
                        className={`${fBody} mt-8 block rounded-full py-3.5 text-center text-[14px] font-semibold transition-[transform,background-color,border-color,color] duration-300 active:scale-[0.98] ${
                          hi
                            ? "text-[#0a0a0a] hover:brightness-110"
                            : "border border-[#D4AF37]/30 text-[#E6C75A] hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/[0.06]"
                        }`}
                        style={hi ? { background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD})` } : undefined}
                      >
                        Başla
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>

      <div className="mt-4 flex justify-center gap-1.5 xl:hidden" aria-hidden>
        {PLANS.map((p, i) => (
          <span
            key={p.name}
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: active === i ? 22 : 6, background: active === i ? GOLD : "rgba(255,255,255,0.15)" }}
          />
        ))}
      </div>
    </section>
  );
}
