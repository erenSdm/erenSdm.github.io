"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Flag, Gavel, Plus, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { CATEGORIES, CHANNELS, FAQS, HERO_VENTS, PANELS, PERKS, SWAPS, TRUST, TRUST_CHIPS, VENT } from "./data";
import { LiveBar } from "./Hero";
import { Bezel, EASE, Eyebrow, FD, FM, PillCta, Reveal, SectionHead, VennLogo } from "./primitives";

const WRAP = "mx-auto w-full max-w-[1180px] px-5 sm:px-8";

/* ------------------------------------------------------- Early access */

function JoinForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "sending" | "done">("idle");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("sending");
    window.setTimeout(() => setState("done"), 900);
  };
  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-start gap-4 rounded-2xl bg-[var(--vn-teal)]/10 p-5 ring-1 ring-[var(--vn-teal)]/30"
          role="status"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--vn-teal)] text-[var(--vn-ink)]">
            <Check size={18} strokeWidth={2} />
          </span>
          <div>
            <p className={`${FD} text-[20px] font-semibold tracking-[-0.02em] text-[var(--vn-cream)]`}>Listedesin.</p>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--vn-muted)]">
              {email} adresine onay bağlantısı gönderiyoruz. Bar dolduğunda ilk haber alanlardan olacaksın.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -8 }} className="grid gap-2">
          <label htmlFor="vn-email" className="text-[13px] font-medium text-[var(--vn-cream)]/85">
            E-posta adresin
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:rounded-full sm:bg-[var(--vn-bg)] sm:p-1.5 sm:ring-1 sm:ring-[var(--vn-line)] sm:focus-within:ring-[var(--vn-violet)]">
            <input
              id="vn-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ornek@posta.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              aria-invalid={state === "error"}
              aria-describedby="vn-email-help"
              className="h-12 w-full min-w-0 shrink-0 rounded-full sm:w-auto sm:flex-1 bg-[var(--vn-bg)] px-5 text-[16px] text-[var(--vn-cream)] ring-1 ring-[var(--vn-line)] placeholder:text-[var(--vn-faint)] focus:outline-none focus:ring-[var(--vn-violet)] sm:bg-transparent sm:ring-0"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--vn-cream)] px-6 text-[15px] font-medium text-[var(--vn-ink)] transition-[transform,background-color] duration-300 hover:bg-white active:scale-[0.98] disabled:opacity-70"
            >
              {state === "sending" ? "Kaydediliyor" : "Yerimi ayır"}
              <ArrowRight size={16} strokeWidth={1.75} />
            </button>
          </div>
          <p id="vn-email-help" className={`text-[13px] ${state === "error" ? "text-[#F87171]" : "text-[var(--vn-faint)]"}`}>
            {state === "error" ? "Geçerli bir e-posta adresi gir, örneğin ad@posta.com." : "Ücretsiz. Reklam yok, veri satışı yok."}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export function EarlyAccess() {
  return (
    <section id="erken-erisim" className="py-28 sm:py-40">
      <div className={`${WRAP} grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20`}>
        <div>
          <Reveal>
            <Eyebrow tone="yellow">İlk 1000</Eyebrow>
            <h2 className={`${FD} mt-5 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.045em] text-[var(--vn-cream)] [text-wrap:balance] sm:text-[4.4rem]`}>
              İlk <span className="text-[var(--vn-yellow)]">1000</span> kişi arasında yerini al.
            </h2>
            <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-[var(--vn-muted)]">
              Bar dolduğu an Venn yayına giriyor. Kurucu kadroya girersen özel rozetler kazanır, herkesten önce tanışmaya başlar ve Venn&apos;in nasıl bir yer olacağını birlikte belirlersin.
            </p>
          </Reveal>
          <ul className="mt-12 divide-y divide-[var(--vn-line)] border-y border-[var(--vn-line)]">
            {PERKS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                <span className={`${FM} pt-1 text-[12px] text-[var(--vn-faint)]`}>{["A", "B", "A∩B"][i]}</span>
                <div>
                  <h3 className={`${FD} text-[21px] font-semibold tracking-[-0.025em] text-[var(--vn-cream)]`}>{p.title}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-[15px] leading-relaxed text-[var(--vn-muted)]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.1} className="lg:sticky lg:top-10 lg:self-start">
          <Bezel core="p-6 sm:p-9">
            <LiveBar />
            <div className="my-8 h-px bg-[var(--vn-line)]" />
            <JoinForm />
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Showcase */

function MiniMap() {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute left-[50%] top-1/2 aspect-[2000/692] h-[260%] -translate-x-1/2 -translate-y-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/demos/venn/map.webp" alt="" className="h-full w-full object-cover" loading="lazy" />
        {HERO_VENTS.slice(0, 18).map((v, i) => (
          <span
            key={i}
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--vn-bg)]"
            style={{ left: `${v.x}%`, top: `${v.y}%`, background: VENT[v.slug].color, boxShadow: `0 0 14px ${VENT[v.slug].glow}` }}
          />
        ))}
      </div>
      <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-[var(--vn-bg)]/85 p-3.5 ring-1 ring-[var(--vn-line)] backdrop-blur-md">
        <span className={`${FM} text-[10px] uppercase tracking-[0.16em]`} style={{ color: VENT.music.color }}>Müzik · Beyoğlu</span>
        <p className={`${FD} mt-1 text-[16px] font-semibold tracking-[-0.02em] text-[var(--vn-cream)]`}>Akustik sahne, küçük mekân</p>
        <p className={`${FM} mt-1 text-[11px] text-[var(--vn-muted)]`}>14 kişi gidiyor · Cuma 22:00</p>
      </div>
    </div>
  );
}

function MiniRoom() {
  return (
    <div className="flex h-full flex-col justify-end gap-2.5 p-5">
      <div className="rounded-2xl bg-[var(--vn-yellow)] p-4 text-[var(--vn-ink)]">
        <span className={`${FM} text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70`}>Plan · Chill</span>
        <p className={`${FD} mt-1 text-[17px] font-semibold leading-tight tracking-[-0.02em]`}>Sahilde çay &amp; sohbet</p>
        <p className={`${FM} mt-1 text-[11px] opacity-75`}>Moda, Kadıköy · Cumartesi 16:00</p>
        <span className="mt-3 block rounded-full bg-[var(--vn-ink)] py-2 text-center text-[12.5px] font-medium text-[var(--vn-cream)]">Katılıyorum</span>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-[var(--vn-bg)] px-4 py-2.5 text-[12px] text-[var(--vn-faint)] ring-1 ring-[var(--vn-line)]">
        Muhabbet lafta kalmaz, plana döner
      </div>
    </div>
  );
}

function MiniCreate() {
  return (
    <div className="flex h-full flex-col justify-end gap-2.5 p-5">
      <div className="rounded-2xl bg-[var(--vn-bg)] p-4 ring-1 ring-[var(--vn-line)]">
        <span className={`${FM} text-[10px] uppercase tracking-[0.16em] text-[var(--vn-faint)]`}>Kategori</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(["sport", "art", "music", "fun", "chill"] as const).map((s, i) => (
            <span key={s} className={`h-7 w-7 rounded-full ${i === 1 ? "ring-2 ring-[var(--vn-cream)] ring-offset-2 ring-offset-[var(--vn-bg)]" : ""}`} style={{ background: VENT[s].color }} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-[var(--vn-bg)] px-4 py-3 ring-1 ring-[var(--vn-line)]">
        <span className="text-[13px] text-[var(--vn-cream)]">6 kişilik kontenjan</span>
        <span className={`${FM} text-[11px] text-[var(--vn-faint)]`}>− 6 +</span>
      </div>
      <span className="rounded-full bg-[var(--vn-violet)] py-2.5 text-center text-[13.5px] font-medium text-[var(--vn-ink)]">Yayınla</span>
    </div>
  );
}

export function Showcase() {
  const visuals = [<MiniMap key="m" />, <MiniRoom key="r" />, <MiniCreate key="c" />];
  return (
    <section className="py-28 sm:py-40">
      <div className={WRAP}>
        <SectionHead
          eyebrow="Ne yapabilirsin"
          eyebrowTone="teal"
          title={<>Bütün şehir parmaklarının ucunda.</>}
          body="Keşfet, planla, kendi buluşmanı kur. Tek amaç: gerçek hayatta bir araya gelmek."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-6 md:grid-rows-[auto_auto]">
          {PANELS.map((p, i) => (
            <Reveal
              key={p.eyebrow}
              delay={i * 0.08}
              className={i === 0 ? "md:col-span-4 md:row-span-2" : "md:col-span-2"}
            >
              <Bezel className="h-full" core="flex h-full flex-col overflow-hidden">
                <div className={`relative overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,rgba(167,139,250,0.10),transparent_70%)] ${i === 0 ? "h-[300px] md:h-[440px]" : "h-[260px]"}`}>
                  {visuals[i]}
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className={`${FM} text-[10.5px] uppercase tracking-[0.18em] text-[var(--vn-violet)]`}>{p.eyebrow}</span>
                  <h3 className={`${FD} mt-3 text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--vn-cream)] [text-wrap:balance] ${i === 0 ? "sm:text-[32px]" : ""}`}>{p.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-[var(--vn-muted)]">{p.body}</p>
                </div>
              </Bezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Manifesto */

export function Manifesto() {
  return (
    <section id="ilkeler" className="py-28 sm:py-40">
      <div className={WRAP}>
        <Reveal className="max-w-3xl">
          <h2 className={`${FD} text-[3.2rem] font-semibold leading-[0.9] tracking-[-0.05em] text-[var(--vn-cream)] sm:text-[6.5rem]`}>
            <span className="text-[var(--vn-faint)] line-through decoration-[var(--vn-violet)] decoration-[0.06em]">Nicelik</span> değil,{" "}
            <span className="italic text-[var(--vn-yellow)]">nitelik.</span>
          </h2>
          <p className="mt-7 max-w-[52ch] text-[17px] leading-relaxed text-[var(--vn-muted)]">
            Venn dört ilke üzerine kurulu. Amacımız daha çok bağlantı değil, sana uygun doğru olan birkaçı. Her satırda neyi bırakıp neyi seçtiğimiz yazıyor.
          </p>
        </Reveal>
        <div className="mt-16">
          <div className={`${FM} hidden grid-cols-[1fr_1.4fr] gap-10 border-b border-[var(--vn-line)] pb-4 text-[10.5px] uppercase tracking-[0.18em] text-[var(--vn-faint)] md:grid`}>
            <span>Çoğu uygulamada</span>
            <span>Venn&apos;de</span>
          </div>
          <ul className="divide-y divide-[var(--vn-line)]">
            {SWAPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06} className="grid gap-3 py-8 md:grid-cols-[1fr_1.4fr] md:gap-10 md:py-10">
                <p className="text-[15px] text-[var(--vn-faint)] line-through decoration-[var(--vn-faint)]/60 md:pt-2">{s.reject}</p>
                <div>
                  <h3 className={`${FD} text-[26px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--vn-cream)] sm:text-[34px]`}>{s.title}</h3>
                  <p className="mt-2 max-w-[50ch] text-[15.5px] leading-relaxed text-[var(--vn-muted)]">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal className="mt-14 md:ml-[42%]">
          <div className="rounded-[1.5rem] bg-[var(--vn-violet)]/[0.08] p-6 ring-1 ring-[var(--vn-violet)]/25 sm:p-8">
            <span className={`${FM} text-[10.5px] uppercase tracking-[0.18em] text-[var(--vn-violet)]`}>Peki flört?</span>
            <p className="mt-3 text-[17px] leading-relaxed text-[var(--vn-cream)]/90">
              İsteyene özel, ana menüde bile görünmeyen gizli bir katman. Asla varsayılan değil, dilediğin an tamamen kapalı.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Categories */

export function Categories() {
  return (
    <section id="kategoriler" className="py-28 sm:py-40">
      <div className={WRAP}>
        <SectionHead
          eyebrow="Kategoriler"
          title="Senin insanların bir yerde."
          body="On ana ilgi alanı, sayısız grup. Sabah koşusundan gece fotoğrafçılığına, ortak noktan neyse orada bir grup var."
        />
        <ul className="mt-16 grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const col = VENT[c.slug].color;
            return (
              <Reveal
                as="li"
                key={c.label}
                delay={(i % 4) * 0.05}
                className={`group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[var(--vn-surface)] p-5 ring-1 ring-[var(--vn-line)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 sm:min-h-[200px] sm:p-6 ${c.wide ? "col-span-2" : ""}`}
              >
                <span
                  aria-hidden
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-45"
                  style={{ background: col }}
                />
                <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: col, boxShadow: `0 0 14px ${col}` }} />
                <div className="relative">
                  <h3 className={`${FD} text-[20px] font-semibold leading-tight tracking-[-0.025em] text-[var(--vn-cream)] sm:text-[24px]`}>{c.label}</h3>
                  <p className={`${FM} mt-2 text-[11px] leading-relaxed text-[var(--vn-muted)]`}>{c.examples.join(" · ")}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Trust */

export function Trust() {
  const icons = [Flag, ShieldCheck, Gavel];
  return (
    <section id="guven" className="py-28 sm:py-40">
      <div className={`${WRAP} grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
        <div className="lg:sticky lg:top-10 lg:self-start">
          <SectionHead
            eyebrow="Güven ve gizlilik"
            eyebrowTone="teal"
            title="Güvende ve kontrolde."
            body="Sakin bir sosyal alan, ancak güven zemininde olur. Venn'i baştan böyle kurduk."
          />
          <Reveal delay={0.1}>
            <ul className="mt-10 flex flex-col gap-2">
              {TRUST_CHIPS.map((t, i) => {
                const I = icons[i]!;
                return (
                  <li key={t} className={`${FM} flex items-center gap-3 text-[12.5px] text-[var(--vn-cream)]/80`}>
                    <I size={15} strokeWidth={1.5} className="text-[var(--vn-teal)]" />
                    {t}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
        <ol className="grid gap-4">
          {TRUST.map((t, i) => (
            <Reveal as="li" key={t.title} delay={i * 0.08}>
              <Bezel core="p-7 sm:p-9">
                <h3 className={`${FD} text-[26px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--vn-cream)] sm:text-[32px]`}>{t.title}</h3>
                <p className="mt-3 max-w-[48ch] text-[15.5px] leading-relaxed text-[var(--vn-muted)]">{t.body}</p>
              </Bezel>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Community */

export function Community() {
  const photos = ["/demos/venn/1.jpg", "/demos/venn/2.jpg", "/demos/venn/3.jpg", "/demos/venn/4.jpg"];
  const rot = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3"];
  return (
    <section className="overflow-hidden py-28 sm:py-40">
      <div className={WRAP}>
        <SectionHead
          eyebrow="Topluluk"
          eyebrowTone="yellow"
          title="Topluluk gruplarımız burada."
          body="Uygulama yayına girmeden önce insanlarla tanış. En canlı yer Instagram, sohbet Telegram ve WhatsApp'ta."
        />
      </div>
      <div className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 md:justify-center md:overflow-visible">
        {photos.map((src, i) => (
          <Reveal key={src} delay={i * 0.06} className={`shrink-0 snap-center ${rot[i]} ${i % 2 ? "md:translate-y-6" : ""}`}>
            <div className="w-[62vw] max-w-[240px] rounded-[1.25rem] bg-[var(--vn-cream)] p-2 pb-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] md:w-[230px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Venn topluluk buluşmasından bir kare" loading="lazy" className="aspect-square w-full rounded-[0.85rem] object-cover" />
            </div>
          </Reveal>
        ))}
      </div>
      <div className={`${WRAP} mt-16`}>
        <p className={`${FD} mb-6 text-[22px] italic tracking-[-0.02em] text-[var(--vn-yellow)]`}>Sen olmadan bir kişi eksiğiz.</p>
        <ul className="grid gap-px overflow-hidden rounded-[1.5rem] bg-[var(--vn-line)] ring-1 ring-[var(--vn-line)] md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 0.06} className="flex flex-col bg-[var(--vn-surface)] p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className={`${FD} text-[22px] font-semibold tracking-[-0.025em] text-[var(--vn-cream)]`}>{c.label}</h3>
                <span className={`${FM} rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--vn-faint)] ring-1 ring-[var(--vn-line)]`}>yakında</span>
              </div>
              <span className={`${FM} mt-1 text-[12px] text-[var(--vn-violet)]`}>{c.handle}</span>
              <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--vn-muted)]">{c.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------- Business teaser */

export function Business() {
  return (
    <section className="py-12 sm:py-20">
      <div className={WRAP}>
        <Reveal>
          <div className="grid gap-8 rounded-[2rem] bg-[var(--vn-yellow)] p-8 text-[var(--vn-ink)] sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <span className={`${FM} text-[10.5px] font-medium uppercase tracking-[0.18em] opacity-70`}>İşletmeler için</span>
              <h2 className={`${FD} mt-4 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[3.4rem]`}>
                Şehrin sosyal hayatında yerinizi alın.
              </h2>
              <p className="mt-4 max-w-[46ch] text-[16.5px] leading-relaxed opacity-80">
                Haritada görünün, etkinliklerinizi yayınlayın, kaç kişinin Venn ile geldiğini görün. Kurulumu birlikte planlıyoruz.
              </p>
            </div>
            <a
              href="#erken-erisim"
              className="group inline-flex items-center gap-3 justify-self-start rounded-full bg-[var(--vn-ink)] py-2 pl-6 pr-2 text-[15px] font-medium text-[var(--vn-cream)] transition-transform active:scale-[0.98] lg:justify-self-end"
            >
              İşletmeler için Venn
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--vn-yellow)] text-[var(--vn-ink)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowRight size={16} strokeWidth={1.75} />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- FAQ */

export function Faq() {
  return (
    <section id="sss" className="py-28 sm:py-40">
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
        <SectionHead eyebrow="SSS" title="Sık sorulanlar" className="lg:sticky lg:top-10 lg:self-start" />
        <Reveal>
          <div className="divide-y divide-[var(--vn-line)] border-y border-[var(--vn-line)]">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
                <summary className={`${FD} flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-5 text-[19px] font-medium tracking-[-0.02em] text-[var(--vn-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vn-violet)] sm:text-[22px]`}>
                  {f.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-[var(--vn-line)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45 group-open:bg-[var(--vn-cream)] group-open:text-[var(--vn-ink)]">
                    <Plus size={16} strokeWidth={1.5} />
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-6 pr-12 text-[15.5px] leading-relaxed text-[var(--vn-muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------- Final CTA + footer */

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-40">
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 opacity-60">
        <span className="h-[min(70vw,560px)] w-[min(70vw,560px)] rounded-full bg-[var(--vn-violet)]/25 blur-3xl" />
        <span className="-ml-[25%] h-[min(70vw,560px)] w-[min(70vw,560px)] rounded-full bg-[var(--vn-teal)]/20 blur-3xl" />
      </div>
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end`}>
        <Reveal>
          <h2 className={`${FD} text-[2.9rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--vn-cream)] [text-wrap:balance] sm:text-[5.2rem]`}>
            Yerini al, ilk 1000 arasında ol.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-[var(--vn-muted)]">
            Bar dolduğunda uygulama yayına giriyor. O ana kadar katılan herkes kurucu kadroda kalıyor.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Bezel core="p-6 sm:p-8">
            <LiveBar />
            <PillCta href="#erken-erisim" className="mt-7">İlk 1000 arasına katıl</PillCta>
          </Bezel>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--vn-line)] py-10">
      <div className={`${WRAP} flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-3">
          <VennLogo className="h-7 w-7" />
          <span className="text-[13.5px] text-[var(--vn-muted)]">Canın ne isterse, birlikte yapacak birileri var.</span>
        </div>
        <span className={`${FM} text-[11px] uppercase tracking-[0.16em] text-[var(--vn-faint)]`}>venntr.com · İstanbul</span>
      </div>
    </footer>
  );
}
