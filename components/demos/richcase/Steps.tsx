"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock, Send, ShieldCheck, X } from "lucide-react";
import { Bezel, EASE, GOLD, GOLD_HI, Reveal, SILVER, UP, fBody, fDisplay, fMono, usd } from "./ui";

/* Copy is the real "WorkAndFeatures" block copy from the RichCase landing. */
const STEPS: { title: string; accent: string; body: string; visual: ReactNode }[] = [
  {
    title: "Paketini seç,",
    accent: "botunu çalıştır.",
    body: "Aboneliği seç, satın al, anında bağlan. Bot işini yapmaya başlar — kod yazmana, ayar kurmana gerek yok.",
    visual: <PurchaseVisual />,
  },
  {
    title: "Bot çalışır,",
    accent: "kasan büyür.",
    body: "Bot Binance hesabına bağlanır, işlemler canlı panele düşer. Kapanan her işlemin kârı kasaya yazılır.",
    visual: <ColumnsVisual />,
  },
  {
    title: "Her hareket,",
    accent: "cebinde.",
    body: "Bot her açılan ve kapanan işlemi anında Telegram'dan bildirir. Sorularına da yine oradan cevap alırsın.",
    visual: <TelegramVisual />,
  },
  {
    title: "Hesabın hep",
    accent: "kalkan altında.",
    body: "Para senin Binance hesabında kalır. Bot yalnızca emir gönderir — fonlarına asla dokunamaz, çekemez.",
    visual: <VaultVisual />,
  },
];

export function Steps() {
  return (
    <section id="nasil-calisir" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2
              className={`${fDisplay} max-w-[12ch] text-[clamp(2.6rem,9vw,5.6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white`}
              style={{ fontStretch: "115%" }}
            >
              Nasıl <span style={{ color: GOLD_HI }}>çalışır</span>
            </h2>
            <p className={`${fMono} text-[11px] uppercase tracking-[0.2em] text-[#6b6b6b]`}>
              04 adım · sıfır kod
            </p>
          </div>
        </Reveal>

        <ol className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-32">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                <span className={`${fMono} text-[12px] tracking-[0.2em] text-[#6b6b6b]`}>
                  <span style={{ color: GOLD }}>0{i + 1}</span> / 04
                </span>
                <h3
                  className={`${fDisplay} mt-5 text-[clamp(2rem,6.4vw,3.4rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-white`}
                  style={{ fontStretch: "108%" }}
                >
                  {s.title}
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(100deg, #F3DC8A, #D4AF37 60%, #A8871F)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {s.accent}
                  </span>
                </h3>
                <p className={`${fBody} mt-6 max-w-[42ch] text-[16.5px] leading-[1.65] text-[#9a9a9a]`}>{s.body}</p>
              </Reveal>
              <Reveal delay={0.12} className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
                {s.visual}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- visuals */

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Bezel inner="relative overflow-hidden p-5 sm:p-7">
      <div className={`${fMono} mb-5 flex items-center justify-between text-[10.5px] uppercase tracking-[0.18em] text-[#5f5f5f]`}>
        <span>{label}</span>
        <span className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
        </span>
      </div>
      {children}
    </Bezel>
  );
}

function PurchaseVisual() {
  const reduce = useReducedMotion();
  const rows = [
    { k: "Paket", v: "Max" },
    { k: "Yönetilen bakiye", v: "1.500 USDT" },
    { k: "Borsa", v: "Binance" },
  ];
  return (
    <Frame label="Abonelik">
      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(212,175,55,0.14),transparent_60%)] p-5">
          <div className={`${fMono} text-[10.5px] uppercase tracking-[0.18em]`} style={{ color: GOLD }}>
            Tavsiye
          </div>
          <div className={`${fDisplay} mt-2 text-[2.2rem] font-black uppercase leading-none tracking-[-0.03em] text-white`}>Max</div>
          <div className="mt-5 flex items-baseline gap-1">
            <span className={`${fDisplay} text-[1.1rem] font-bold text-[#8a8a8a]`}>$</span>
            <span className={`${fDisplay} text-[2.6rem] font-black leading-none tracking-[-0.03em] text-white`}>150</span>
            <span className={`${fMono} ml-1 text-[11px] uppercase tracking-[0.14em] text-[#6b6b6b]`}>/ hafta</span>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <motion.li
              key={r.k}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.12 }}
              className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
            >
              <span className={`${fBody} text-[13px] text-[#8a8a8a]`}>{r.k}</span>
              <span className={`${fMono} text-[13px] text-white`}>{r.v}</span>
            </motion.li>
          ))}
          <motion.li
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
            className={`${fBody} mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[13.5px] font-semibold text-[#0a0a0a]`}
            style={{ background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD})` }}
          >
            <Check className="h-4 w-4" strokeWidth={2.25} /> Bot aktif
          </motion.li>
        </ul>
      </div>
    </Frame>
  );
}

/* The original hero's 3D motif — five rising columns, the RC coin hopping to the top — in 2D. */
function ColumnsVisual() {
  const reduce = useReducedMotion();
  const heights = [38, 50, 62, 76, 92];
  return (
    <Frame label="Kasa · örnek akış">
      <div className="relative h-[240px] sm:h-[300px]">
        <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between gap-3 sm:gap-5">
          {heights.map((h, i) => (
            <div key={i} className="relative flex h-full flex-1 items-end">
              <motion.div
                className="w-full rounded-t-[14px] border border-white/[0.07]"
                style={{
                  background:
                    i === heights.length - 1
                      ? `linear-gradient(180deg, ${GOLD_HI}, rgba(212,175,55,0.15))`
                      : "linear-gradient(180deg, rgba(192,192,192,0.22), rgba(192,192,192,0.03))",
                  boxShadow: i === heights.length - 1 ? "0 0 40px -6px rgba(212,175,55,0.45)" : undefined,
                }}
                initial={reduce ? false : { height: "0%" }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.12 }}
              />
            </div>
          ))}
        </div>
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-0 h-9 w-9 -translate-x-1/2 rounded-full ring-1 ring-[#D4AF37]/60"
            style={{
              background: `radial-gradient(circle at 35% 30%, #F3DC8A, ${GOLD} 55%, #8a6d14)`,
              boxShadow: "0 8px 24px -6px rgba(212,175,55,0.6)",
            }}
            initial={{ left: "10%", bottom: "41%" }}
            whileInView={{
              left: ["10%", "30%", "50%", "70%", "90%"],
              bottom: ["41%", "53%", "65%", "79%", "95%"],
            }}
            viewport={{ once: true }}
            transition={{ duration: 3.2, ease: "easeInOut", delay: 1.1, times: [0, 0.25, 0.5, 0.75, 1] }}
          >
            <span className={`${fDisplay} flex h-full items-center justify-center text-[12px] font-black text-[#2a2105]`}>RC</span>
          </motion.div>
        )}
      </div>
      <div className={`${fMono} mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-[11px] uppercase tracking-[0.16em] text-[#6b6b6b]`}>
        <span>Kapanan işlem → kasa</span>
        <span style={{ color: UP }}>+{usd(263.8)} USDT</span>
      </div>
    </Frame>
  );
}

/* Messages from the original Scene3Telegram sequence. */
function TelegramVisual() {
  const reduce = useReducedMotion();
  const msgs: { side: "bot" | "user"; node: ReactNode }[] = [
    {
      side: "bot",
      node: (
        <>
          <Tag color={UP}>İşlem kapandı</Tag>
          <div className="mt-1.5 flex items-baseline justify-between gap-6">
            <span className="text-white">BTC/USDT</span>
            <span className={fMono} style={{ color: UP }}>+124.50 · 2.4%</span>
          </div>
        </>
      ),
    },
    {
      side: "bot",
      node: (
        <>
          <Tag color={GOLD}>İşlem açıldı</Tag>
          <div className="mt-1.5 flex items-baseline justify-between gap-6">
            <span className="text-white">ETH/USDT</span>
            <span className={`${fMono} text-[#f87171]`}>SHORT</span>
          </div>
          <div className={`${fMono} mt-1 text-[11px] text-[#7a7a7a]`}>Giriş 3,240 · $30</div>
        </>
      ),
    },
    { side: "user", node: <span>Kasam ne kadar?</span> },
    {
      side: "bot",
      node: (
        <>
          <Tag color={GOLD}>Kasa</Tag>
          <div className={`${fDisplay} mt-1.5 text-[1.6rem] font-black leading-none tracking-[-0.02em]`} style={{ color: GOLD_HI }}>
            {usd(263.8)} <span className={`${fMono} text-[11px] font-normal text-[#8a8a8a]`}>USDT</span>
          </div>
        </>
      ),
    },
  ];
  return (
    <Frame label="TELEGRAM · RICHCASE BOT">
      <ul className="flex flex-col gap-2.5">
        {msgs.map((m, i) => (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 130, damping: 18, delay: 0.2 + i * 0.45 }}
            className={`${fBody} max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] ${
              m.side === "user"
                ? "self-end rounded-br-md bg-[#D4AF37] font-medium text-[#0a0a0a]"
                : "self-start rounded-bl-md border border-white/[0.06] bg-white/[0.035] text-[#d4d4d4]"
            }`}
          >
            {m.node}
          </motion.li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] py-1.5 pl-4 pr-1.5">
        <span className={`${fBody} flex-1 text-[13px] text-[#5f5f5f]`}>Mesaj yaz…</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: GOLD }}>
          <Send className="h-3.5 w-3.5 text-[#0a0a0a]" strokeWidth={2} />
        </span>
      </div>
    </Frame>
  );
}

function Tag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span className={`${fMono} text-[10px] uppercase tracking-[0.16em]`} style={{ color }}>
      {children}
    </span>
  );
}

function VaultVisual() {
  const reduce = useReducedMotion();
  return (
    <Frame label="BINANCE API · YETKİLER">
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
          {[0, 1, 2].map((r) => (
            <motion.span
              key={r}
              aria-hidden
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: r === 0 ? "rgba(212,175,55,0.5)" : "rgba(192,192,192,0.12)", margin: r * 14 }}
              animate={reduce ? undefined : { rotate: r % 2 ? -360 : 360 }}
              transition={{ duration: 28 + r * 10, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: r === 0 ? GOLD : SILVER }} />
            </motion.span>
          ))}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10">
            <ShieldCheck className="h-7 w-7" style={{ color: GOLD_HI }} strokeWidth={1.5} />
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          <Perm ok label="Emir gönderme" />
          <Perm ok={false} label="Para çekme" />
          <Perm ok={false} label="Fonlara erişim" />
          <li className={`${fBody} mt-2 flex items-start gap-2.5 text-[13px] leading-[1.55] text-[#8a8a8a]`}>
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GOLD }} strokeWidth={2} />
            Para senin Binance hesabında kalır.
          </li>
        </ul>
      </div>
    </Frame>
  );
}

function Perm({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <span className={`${fBody} text-[13.5px] text-[#d4d4d4]`}>{label}</span>
      <span
        className={`${fMono} inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] uppercase tracking-[0.12em]`}
        style={{
          color: ok ? UP : "#f87171",
          background: ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
        }}
      >
        {ok ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <X className="h-3 w-3" strokeWidth={2.5} />}
        {ok ? "Açık" : "Kapalı"}
      </span>
    </li>
  );
}
