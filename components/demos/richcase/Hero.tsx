"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LivePanel } from "./LivePanel";
import { EASE, GOLD, GhostCta, PrimaryCta, Eyebrow, fBody, fDisplay, fMono, fSerif } from "./ui";

const PAIRS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "AVAX/USDT", "LINK/USDT"];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 32, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1, ease: EASE, delay },
        };

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 md:pt-36">
      {/* Brand glow — the gold R + silver C lightbox, abstracted */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-[20%] top-[-10%] h-[60vh] w-[70vw] rounded-full opacity-60 blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.28), transparent)" }}
        />
        <div
          className="absolute -right-[15%] top-[10%] h-[55vh] w-[55vw] rounded-full opacity-50 blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(192,192,192,0.16), transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-5 pb-20 md:px-8 lg:grid-cols-12 lg:gap-10 lg:pb-28">
        <div className="lg:col-span-7 lg:pt-6">
          <motion.div {...rise(0.05)}>
            <Eyebrow>BINANCE FUTURES · OTOMATİK BOT</Eyebrow>
          </motion.div>

          <motion.h1
            lang="en"
            {...rise(0.15)}
            className={`${fDisplay} mt-7 text-[clamp(3.4rem,15vw,8.6rem)] lg:text-[clamp(4.5rem,7.4vw,7.4rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] text-white`}
            style={{ fontStretch: "118%" }}
          >
            <span className="block">Leave it</span>
            <span className="block">
              to{" "}
              <span
                className={`${fSerif} font-normal normal-case italic tracking-[-0.02em]`}
                style={{
                  background: "linear-gradient(100deg, #F3DC8A 0%, #E6C75A 35%, #D4AF37 70%, #9C7E1E 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  paddingRight: "0.08em",
                }}
              >
                me!
              </span>
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.3)}
            className={`${fBody} mt-8 max-w-[34ch] text-[17px] leading-[1.6] text-[#a8a8a8] md:text-[19px]`}
          >
            Binance hesabına bağla, kaldıraçlı kripto ticaret botunu aktifleştir ve kazanmaya başla.
          </motion.p>

          <motion.div {...rise(0.42)} className="mt-10 flex flex-wrap items-center gap-3">
            <PrimaryCta href="#paketler">Hemen başla</PrimaryCta>
            <GhostCta href="#nasil-calisir">Nasıl çalışır</GhostCta>
          </motion.div>

          <motion.dl
            {...rise(0.55)}
            className={`${fMono} mt-14 grid max-w-[520px] grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] text-[11px] uppercase tracking-[0.14em]`}
          >
            {[
              ["Borsa", "Binance"],
              ["Ödeme", "Haftalık"],
              ["Bildirim", "Telegram"],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#0b0b0c] px-4 py-4">
                <dt className="text-[#6b6b6b]">{k}</dt>
                <dd className="mt-1.5 text-[12.5px] normal-case tracking-normal text-[#e5e5e5]">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="relative lg:col-span-5"
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/demos/richcase/rc-700x700.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-16 -z-10 w-[78%] max-w-[360px] rounded-[2.5rem] opacity-[0.22] blur-[2px] [mask-image:radial-gradient(closest-side,black,transparent)]"
          />
          <LivePanel />
        </motion.div>
      </div>

      {/* pair ticker */}
      <div className="relative border-y border-white/[0.06] bg-[#0b0b0c]/60 py-4">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className={`${reduce ? "" : "rc-marquee"} flex shrink-0 items-center gap-10 pr-10`}>
            {[...PAIRS, ...PAIRS].map((p, i) => (
              <span key={i} className={`${fMono} flex items-center gap-3 whitespace-nowrap text-[12px] tracking-[0.12em] text-[#7d7d7d]`}>
                <span className="h-1 w-1 rounded-full" style={{ background: i % 2 ? "#C0C0C0" : GOLD }} />
                {p}
              </span>
            ))}
          </div>
          <div aria-hidden className={`${reduce ? "hidden" : "rc-marquee flex"} shrink-0 items-center gap-10 pr-10`}>
            {[...PAIRS, ...PAIRS].map((p, i) => (
              <span key={i} className={`${fMono} flex items-center gap-3 whitespace-nowrap text-[12px] tracking-[0.12em] text-[#7d7d7d]`}>
                <span className="h-1 w-1 rounded-full" style={{ background: i % 2 ? "#C0C0C0" : GOLD }} />
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
