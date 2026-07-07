"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDownLeft,
  Check,
  ShieldCheck,
  Lock,
  Globe,
  Zap,
  Repeat,
  TrendingUp,
  TrendingDown,
  Fingerprint,
} from "lucide-react";
import { Counter } from "./Counter";

/* ------------------------------------------------------------------ *
 * LEDGER — neobrutalist fintech settlement-layer landing.
 * Off-white structural panels (#F4F4EF) against dark blocks (#0A0A0A),
 * hard 2px borders, solid offset shadows, emerald #2FE6A0 accent.
 * ------------------------------------------------------------------ */

const INK = "#0a0a0a";
const EMER = "#2FE6A0";

const display =
  "font-[family-name:var(--font-archivo)] uppercase leading-[0.9] tracking-[-0.01em]";

/* ---------- motion helper ---------- */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- tactile neobrutalist button ---------- */
type BtnVariant = "solid" | "dark" | "ghost";
function Btn({
  children,
  variant = "solid",
  className = "",
  arrow = true,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  className?: string;
  arrow?: boolean;
}) {
  const base =
    "group inline-flex items-center gap-2 border-2 border-[#0a0a0a] px-6 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.02em] will-change-transform transition-[transform,box-shadow] duration-100 ease-out hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2FE6A0]";
  const variants: Record<BtnVariant, string> = {
    solid:
      "bg-[#2FE6A0] text-[#0a0a0a] shadow-[6px_6px_0_#0a0a0a] hover:shadow-[7px_7px_0_#0a0a0a]",
    dark:
      "bg-[#0a0a0a] text-[#F4F4EF] border-[#0a0a0a] shadow-[6px_6px_0_#2FE6A0] hover:shadow-[7px_7px_0_#2FE6A0]",
    ghost:
      "bg-[#F4F4EF] text-[#0a0a0a] shadow-[6px_6px_0_#0a0a0a] hover:shadow-[7px_7px_0_#0a0a0a]",
  };
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <ArrowUpRight
          size={17}
          strokeWidth={2.5}
          className="transition-transform duration-150 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
        />
      )}
    </button>
  );
}

/* ---------- brutalist toggle switch ---------- */
function Switch({ defaultOn = false, label }: { defaultOn?: boolean; label: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn((v) => !v)}
      className="relative h-7 w-12 shrink-0 border-2 border-[#0a0a0a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2FE6A0] transition-colors duration-150"
      style={{ background: on ? EMER : "#e4e4dc" }}
    >
      <span
        className="absolute top-[2px] h-[18px] w-[18px] border-2 border-[#0a0a0a] bg-[#0a0a0a] transition-[left] duration-150 ease-out"
        style={{ left: on ? "22px" : "2px" }}
      />
    </button>
  );
}

/* ---------- small parts ---------- */
function CcyDot({ code, color }: { code: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2 border-2 border-[#0a0a0a] bg-[#F4F4EF] px-2.5 py-1.5">
      <span
        className="h-3.5 w-3.5 border border-[#0a0a0a]"
        style={{ background: color }}
        aria-hidden
      />
      <span className="font-mono text-xs font-bold tracking-wide">{code}</span>
    </span>
  );
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-[#0a0a0a] px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] ${
        dark ? "bg-[#0a0a0a] text-[#2FE6A0]" : "bg-[#2FE6A0] text-[#0a0a0a]"
      }`}
    >
      <span className="h-1.5 w-1.5 bg-current animate-blink" aria-hidden />
      {children}
    </span>
  );
}

/* ================================================================== *
 * NAV
 * ================================================================== */
function Nav() {
  const links = ["Product", "Rates", "Developers", "Company"];
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#0a0a0a] bg-[#F4F4EF]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span
            className="grid h-8 w-8 place-items-center border-2 border-[#0a0a0a] bg-[#2FE6A0] font-[family-name:var(--font-archivo)] text-lg leading-none"
            aria-hidden
          >
            L
          </span>
          <span className={`${display} text-xl`}>Ledger</span>
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0a0a0a] transition-colors hover:text-[#0a0a0a]/60"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden font-mono text-xs font-bold uppercase tracking-[0.14em] sm:inline"
          >
            Sign in
          </a>
          <Btn variant="solid" className="!px-4 !py-2.5 !text-[0.7rem]" arrow={false}>
            Get started
          </Btn>
        </div>
      </div>
    </header>
  );
}

/* ================================================================== *
 * HERO
 * ================================================================== */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-[#0a0a0a] bg-[#F4F4EF]">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        {/* copy */}
        <Reveal>
          <Eyebrow>Settlement layer · Live</Eyebrow>
          <h1 className={`${display} mt-6 text-[clamp(3rem,8.5vw,6.5rem)]`}>
            Move money
            <br />
            like it&rsquo;s
            <br />
            just{" "}
            <span className="bg-[#2FE6A0] px-2 box-decoration-clone">data.</span>
          </h1>
          <p className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-[#0a0a0a]/75">
            LEDGER is the treasury account for businesses that operate across
            borders. Hold 190 currencies, convert at the mid-market rate, and
            settle cross-border in milliseconds — not banking days.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Btn variant="solid">Open an account</Btn>
            <Btn variant="ghost" arrow={false}>
              View live rates
            </Btn>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[#0a0a0a]/55">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} strokeWidth={2} /> SOC 2 Type II
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock size={14} strokeWidth={2} /> PCI-DSS Level 1
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe size={14} strokeWidth={2} /> 190 currencies
            </span>
          </div>
        </Reveal>

        {/* visual stack */}
        <Reveal delay={0.12}>
          <div className="relative mx-auto w-full max-w-md lg:mr-0">
            {/* balance panel */}
            <div className="border-2 border-[#0a0a0a] bg-[#0a0a0a] p-6 text-[#F4F4EF] shadow-[10px_10px_0_#2FE6A0]">
              <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#F4F4EF]/60">
                <span>Available balance</span>
                <span className="inline-flex items-center gap-1.5 text-[#2FE6A0]">
                  <span className="h-1.5 w-1.5 bg-[#2FE6A0] animate-blink" aria-hidden />
                  USD · Main
                </span>
              </div>
              <div className="mt-4 font-[family-name:var(--font-archivo)] text-[clamp(2.4rem,6vw,3.4rem)] leading-none tracking-[-0.02em] tabular-nums">
                <Counter to={2418204.65} decimals={2} prefix="$" />
              </div>
              <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-[#F4F4EF]/20 pt-4">
                <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-[#2FE6A0]">
                  <TrendingUp size={15} strokeWidth={2.5} />
                  +$184,320 settled today
                </span>
                <span className="font-mono text-[0.72rem] text-[#F4F4EF]/50">
                  6 currencies
                </span>
              </div>
            </div>

            {/* mock card */}
            <div className="relative z-10 mt-5 ml-6 w-[74%] border-2 border-[#0a0a0a] bg-[#2FE6A0] p-5 shadow-[8px_8px_0_#0a0a0a]">
              <div className="flex items-start justify-between">
                <span className={`${display} text-base`}>Ledger</span>
                <span className="h-6 w-8 border-2 border-[#0a0a0a] bg-[#0a0a0a]/10" aria-hidden />
              </div>
              <div className="mt-8 font-mono text-sm font-bold tracking-[0.2em] text-[#0a0a0a]">
                4402 •••• •••• 7318
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#0a0a0a]/70">
                <span>R. Okonkwo</span>
                <span>Multi-currency</span>
              </div>
            </div>

            {/* floating transaction chip */}
            <div className="animate-floaty absolute -right-2 -top-5 z-20 hidden border-2 border-[#0a0a0a] bg-[#F4F4EF] px-3.5 py-2.5 shadow-[5px_5px_0_#0a0a0a] sm:block">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center border-2 border-[#0a0a0a] bg-[#2FE6A0]">
                  <ArrowDownLeft size={15} strokeWidth={2.75} />
                </span>
                <div className="leading-tight">
                  <div className="font-mono text-[0.72rem] font-bold">
                    +&euro;12,480.00
                  </div>
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[#0a0a0a]/55">
                    Stripe payout · 47ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== *
 * MARQUEE STRIP
 * ================================================================== */
function MarqueeStrip() {
  const items = [
    "190 currencies",
    "47ms median settlement",
    "0.20% flat FX margin",
    "$250M custody insurance",
    "SOC 2 Type II",
    "99.98% uptime",
  ];
  const Track = () => (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span
          key={t}
          className="flex items-center gap-4 whitespace-nowrap px-6 font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#0a0a0a]"
        >
          {t}
          <span className="text-[#0a0a0a]/40">/</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-b-2 border-[#0a0a0a] bg-[#2FE6A0] py-3">
      <div className="flex w-max animate-marquee">
        <Track />
        <Track />
      </div>
    </div>
  );
}

/* ================================================================== *
 * STAT BAND (dark)
 * ================================================================== */
function StatBand() {
  const stats = [
    { to: 2.41, decimals: 2, prefix: "$", suffix: "B", label: "Settled this quarter" },
    { to: 47, decimals: 0, suffix: "ms", label: "Median settlement time" },
    { to: 190, decimals: 0, suffix: "", label: "Currencies held on-ledger" },
    { to: 99.98, decimals: 2, suffix: "%", label: "Ledger uptime, trailing 12mo" },
  ];
  return (
    <section className="border-b-2 border-[#0a0a0a] bg-[#0a0a0a] text-[#F4F4EF]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className={`border-[#F4F4EF]/15 px-6 py-10 sm:py-14 ${
              i < stats.length - 1 ? "border-b-2 sm:border-b-2 lg:border-r-2" : ""
            } ${i % 2 === 0 ? "sm:border-r-2" : ""} ${i < 2 ? "sm:border-b-2" : "sm:border-b-0"} lg:border-b-0`}
          >
            <div className="font-[family-name:var(--font-archivo)] text-[clamp(2.6rem,6vw,4rem)] leading-none tracking-[-0.02em] tabular-nums text-[#2FE6A0]">
              <Counter to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[#F4F4EF]/60">
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== *
 * FEATURE MOCKS
 * ================================================================== */
function TransferMock() {
  return (
    <div className="border-2 border-[#0a0a0a] bg-[#F4F4EF] p-6 shadow-[10px_10px_0_#0a0a0a]">
      <div className="flex items-center justify-between">
        <span className={`${display} text-lg`}>Send money</span>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#0a0a0a]/55">
          Arrives in seconds
        </span>
      </div>

      <div className="mt-5 border-2 border-[#0a0a0a] bg-white p-4">
        <div className="flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#0a0a0a]/55">
          You send
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-[family-name:var(--font-archivo)] text-3xl tabular-nums">
            5,000.00
          </span>
          <CcyDot code="USD" color="#2FE6A0" />
        </div>
      </div>

      <div className="relative my-3 flex items-center justify-center">
        <div className="dotted h-[2px] w-full" aria-hidden />
        <span className="absolute grid h-9 w-9 place-items-center border-2 border-[#0a0a0a] bg-[#2FE6A0]">
          <Repeat size={16} strokeWidth={2.5} />
        </span>
      </div>

      <div className="border-2 border-[#0a0a0a] bg-white p-4">
        <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#0a0a0a]/55">
          They receive
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-[family-name:var(--font-archivo)] text-3xl tabular-nums">
            4,591.20
          </span>
          <CcyDot code="EUR" color="#0a0a0a" />
        </div>
      </div>

      <dl className="mt-5 space-y-2 font-mono text-[0.74rem]">
        <div className="flex items-center justify-between">
          <dt className="text-[#0a0a0a]/55">Mid-market rate</dt>
          <dd className="font-bold tabular-nums">1 USD = 0.9187 EUR</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#0a0a0a]/55">LEDGER fee</dt>
          <dd className="font-bold tabular-nums">$3.68 (0.20%)</dd>
        </div>
      </dl>

      <button
        type="button"
        className="group mt-5 flex w-full items-center justify-center gap-2 border-2 border-[#0a0a0a] bg-[#0a0a0a] px-6 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.04em] text-[#F4F4EF] shadow-[6px_6px_0_#2FE6A0] transition-[transform,box-shadow] duration-100 hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2FE6A0]"
      >
        Confirm transfer
        <ArrowRight
          size={17}
          strokeWidth={2.5}
          className="transition-transform group-hover:translate-x-[3px]"
        />
      </button>
    </div>
  );
}

function RateTickerMock() {
  const rows = [
    { pair: "EUR / USD", rate: "1.0885", delta: "+0.12%", up: true },
    { pair: "GBP / USD", rate: "1.2712", delta: "-0.08%", up: false },
    { pair: "USD / JPY", rate: "149.32", delta: "+0.21%", up: true },
    { pair: "USD / SGD", rate: "1.3401", delta: "+0.04%", up: true },
    { pair: "BTC / USD", rate: "63,418", delta: "+1.84%", up: true },
    { pair: "USDC / USD", rate: "1.0001", delta: "-0.01%", up: false },
  ];
  return (
    <div className="border-2 border-[#0a0a0a] bg-[#0a0a0a] text-[#F4F4EF] shadow-[10px_10px_0_#2FE6A0]">
      <div className="flex items-center justify-between border-b-2 border-[#F4F4EF]/15 px-5 py-4">
        <span className={`${display} text-lg text-[#F4F4EF]`}>Live rates</span>
        <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[#2FE6A0]">
          <span className="h-1.5 w-1.5 bg-[#2FE6A0] animate-blink" aria-hidden />
          Streaming
        </span>
      </div>
      <ul>
        {rows.map((r, i) => (
          <li
            key={r.pair}
            className={`flex items-center justify-between px-5 py-3.5 ${
              i < rows.length - 1 ? "border-b border-[#F4F4EF]/10" : ""
            }`}
          >
            <span className="font-mono text-sm font-bold tracking-[0.08em]">
              {r.pair}
            </span>
            <span className="flex items-center gap-4">
              <span className="font-mono text-sm tabular-nums text-[#F4F4EF]/85">
                {r.rate}
              </span>
              <span
                className="inline-flex w-[74px] items-center justify-end gap-1 font-mono text-xs font-bold tabular-nums"
                style={{ color: r.up ? EMER : "#ff6a4d" }}
              >
                {r.up ? (
                  <TrendingUp size={14} strokeWidth={2.75} />
                ) : (
                  <TrendingDown size={14} strokeWidth={2.75} />
                )}
                {r.delta}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t-2 border-[#F4F4EF]/15 px-5 py-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-[#F4F4EF]/45">
        Rates refreshed 12&times; per second · no markup
      </div>
    </div>
  );
}

function RulesMock() {
  const rules = [
    { label: "Cap spend at $10,000 / month", on: true },
    { label: "Require approval over $2,500", on: true },
    { label: "Block cash withdrawals", on: false },
    { label: "Auto-convert to USD on receipt", on: true },
  ];
  return (
    <div className="border-2 border-[#0a0a0a] bg-[#F4F4EF] p-6 shadow-[10px_10px_0_#0a0a0a]">
      {/* virtual card */}
      <div className="border-2 border-[#0a0a0a] bg-[#0a0a0a] p-5 text-[#F4F4EF]">
        <div className="flex items-center justify-between">
          <span className={`${display} text-base text-[#2FE6A0]`}>
            Virtual card
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#F4F4EF]/55">
            Payables · Ops
          </span>
        </div>
        <div className="mt-6 font-mono text-sm font-bold tracking-[0.2em]">
          8801 •••• •••• 2245
        </div>
      </div>

      {/* rules */}
      <ul className="mt-5 space-y-3">
        {rules.map((r) => (
          <li
            key={r.label}
            className="flex items-center justify-between gap-4 border-2 border-[#0a0a0a] bg-white px-4 py-3"
          >
            <span className="text-sm font-medium">{r.label}</span>
            <Switch defaultOn={r.on} label={r.label} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- generic zig-zag row ---------- */
function FeatureRow({
  index,
  kicker,
  title,
  body,
  points,
  mock,
  flip,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  body: string;
  points: string[];
  mock: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={flip ? "md:order-2" : ""}>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border-2 border-[#0a0a0a] bg-[#0a0a0a] font-mono text-sm font-bold text-[#2FE6A0]">
            {index}
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#0a0a0a]/60">
            {kicker}
          </span>
        </div>
        <h3 className={`${display} mt-5 text-[clamp(2rem,4.5vw,3.4rem)]`}>
          {title}
        </h3>
        <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-[#0a0a0a]/75">
          {body}
        </p>
        <ul className="mt-6 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border-2 border-[#0a0a0a] bg-[#2FE6A0]">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="text-[0.95rem] text-[#0a0a0a]/80">{p}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1} className={flip ? "md:order-1" : ""}>
        {mock}
      </Reveal>
    </div>
  );
}

function Features() {
  return (
    <section className="border-b-2 border-[#0a0a0a] bg-[#F4F4EF]">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>What you get</Eyebrow>
            <h2 className={`${display} mt-6 text-[clamp(2.4rem,6vw,4.5rem)]`}>
              One account.
              <br />
              Every currency.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-32">
          <FeatureRow
            index="01"
            kicker="Global transfers"
            title={<>Pay anyone, in 190 countries</>}
            body="Send in the currency your recipient actually uses. LEDGER routes over local rails where they exist and settles on-chain where they don't — always at the mid-market rate, with the fee shown before you confirm."
            points={[
              "Mid-market FX with a flat 0.20% margin",
              "Local ACH, SEPA, Faster Payments and PIX rails",
              "Batch up to 5,000 payouts from a single CSV",
            ]}
            mock={<TransferMock />}
          />

          <FeatureRow
            index="02"
            kicker="Markets"
            title={<>Rates you can actually watch</>}
            body="A live book streaming twelve times a second, straight from our liquidity providers. No hidden spread baked into the number — what you see is the rate you settle at."
            points={[
              "Streaming quotes on 190 currency pairs",
              "Rate alerts and limit orders on any pair",
              "Full tick history exportable to Parquet",
            ]}
            mock={<RateTickerMock />}
            flip
          />

          <FeatureRow
            index="03"
            kicker="Controls"
            title={<>Rules that run themselves</>}
            body="Issue a virtual card in seconds and attach spend logic to it. Caps, approvals and auto-conversion run on-ledger, so finance stops chasing receipts and starts closing the books on time."
            points={[
              "Per-card monthly caps and merchant locks",
              "Approval routing above any threshold you set",
              "Auto-convert incoming funds to your base currency",
            ]}
            mock={<RulesMock />}
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * PRICING
 * ================================================================== */
function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$0",
      cadence: "/ month",
      blurb: "For founders moving their first cross-border payroll.",
      features: [
        "Hold 12 currencies",
        "Up to $50k monthly volume",
        "Mid-market FX at 0.35%",
        "2 virtual cards",
      ],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Business",
      price: "$49",
      cadence: "/ month",
      blurb: "For teams settling with suppliers and contractors worldwide.",
      features: [
        "Hold all 190 currencies",
        "Unlimited monthly volume",
        "Mid-market FX at 0.20%",
        "Unlimited cards with spend rules",
        "Batch payouts + approvals",
      ],
      cta: "Choose Business",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      cadence: "",
      blurb: "For platforms embedding LEDGER through the API.",
      features: [
        "Volume-based FX from 0.08%",
        "Dedicated liquidity + IBANs",
        "SSO, audit log, SLA",
        "Named settlement engineer",
      ],
      cta: "Talk to sales",
      highlight: false,
    },
  ];

  return (
    <section className="border-b-2 border-[#0a0a0a] bg-[#0a0a0a] text-[#F4F4EF]">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow dark>Pricing</Eyebrow>
            <h2 className={`${display} mt-6 text-[clamp(2.4rem,6vw,4.5rem)]`}>
              Priced on the
              <br />
              spread. Nothing else.
            </h2>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-[#F4F4EF]/70">
              No wire fees, no minimum balance, no monthly surprises. You pay a
              flat margin on conversion — that&rsquo;s the whole model.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col border-2 p-7 transition-transform duration-150 ${
                  t.highlight
                    ? "border-[#2FE6A0] bg-[#2FE6A0] text-[#0a0a0a] shadow-[10px_10px_0_#F4F4EF] lg:-translate-y-4"
                    : "border-[#F4F4EF] bg-[#0a0a0a] text-[#F4F4EF]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`${display} text-xl`}>{t.name}</span>
                  {t.highlight && (
                    <span className="border-2 border-[#0a0a0a] bg-[#0a0a0a] px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#2FE6A0]">
                      Most picked
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="font-[family-name:var(--font-archivo)] text-5xl leading-none tracking-[-0.02em]">
                    {t.price}
                  </span>
                  {t.cadence && (
                    <span
                      className={`mb-1 font-mono text-xs uppercase tracking-[0.14em] ${
                        t.highlight ? "text-[#0a0a0a]/60" : "text-[#F4F4EF]/50"
                      }`}
                    >
                      {t.cadence}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-4 text-sm leading-relaxed ${
                    t.highlight ? "text-[#0a0a0a]/75" : "text-[#F4F4EF]/65"
                  }`}
                >
                  {t.blurb}
                </p>

                <ul className="mt-6 space-y-3 border-t-2 border-dashed pt-6"
                    style={{ borderColor: t.highlight ? "rgba(10,10,10,0.25)" : "rgba(244,244,239,0.2)" }}>
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check
                        size={16}
                        strokeWidth={3}
                        className="mt-0.5 shrink-0"
                        style={{ color: t.highlight ? INK : EMER }}
                      />
                      <span className={t.highlight ? "text-[#0a0a0a]/85" : "text-[#F4F4EF]/85"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-2">
                  <button
                    type="button"
                    className={`group flex w-full items-center justify-center gap-2 border-2 px-6 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.04em] will-change-transform transition-[transform,box-shadow] duration-100 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2FE6A0] ${
                      t.highlight
                        ? "border-[#0a0a0a] bg-[#0a0a0a] text-[#F4F4EF] shadow-[6px_6px_0_#0a0a0a] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                        : "border-[#2FE6A0] bg-[#2FE6A0] text-[#0a0a0a] shadow-[6px_6px_0_#2FE6A0] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                    }`}
                  >
                    {t.cta}
                    <ArrowUpRight
                      size={16}
                      strokeWidth={2.75}
                      className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                    />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * SECURITY / TRUST STRIP
 * ================================================================== */
function Security() {
  const badges = [
    { icon: ShieldCheck, k: "SOC 2 Type II", v: "Audited annually" },
    { icon: Lock, k: "PCI-DSS Level 1", v: "Card data tokenized" },
    { icon: Fingerprint, k: "256-bit AES", v: "Encryption at rest" },
    { icon: Zap, k: "$250M custody", v: "Insured & segregated" },
  ];
  return (
    <section className="border-b-2 border-[#0a0a0a] bg-[#F4F4EF]">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Trust &amp; custody</Eyebrow>
            <h2 className={`${display} mt-5 text-[clamp(1.8rem,4vw,3rem)]`}>
              Your funds never
              <br />
              touch our balance sheet.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[0.78rem] leading-relaxed text-[#0a0a0a]/60">
            Client balances sit in bankruptcy-remote accounts at regulated
            partner banks. We can see them. We can&rsquo;t spend them.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 border-2 border-[#0a0a0a] sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal
                key={b.k}
                delay={i * 0.06}
                className={`bg-[#F4F4EF] p-6 ${
                  i < badges.length - 1
                    ? "border-b-2 border-[#0a0a0a] lg:border-b-0 lg:border-r-2"
                    : ""
                } ${i % 2 === 0 ? "sm:border-r-2 sm:border-[#0a0a0a] lg:border-r-2" : ""} ${
                  i < 2 ? "sm:border-b-2 sm:border-[#0a0a0a] lg:border-b-0" : "sm:border-b-0"
                }`}
              >
                <Icon size={26} strokeWidth={1.75} />
                <div className={`${display} mt-4 text-lg`}>{b.k}</div>
                <div className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[#0a0a0a]/55">
                  {b.v}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * CTA FOOTER
 * ================================================================== */
function CtaFooter() {
  return (
    <section className="bg-[#0a0a0a] text-[#F4F4EF]">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <h2 className={`${display} text-[clamp(2.6rem,9vw,7rem)]`}>
            Money should move
            <br />
            at the speed of
            <br />
            <span className="text-[#2FE6A0]">the internet.</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Btn variant="solid" className="!px-8 !py-4 !text-sm">
              Open an account
            </Btn>
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-[#F4F4EF]/55">
              Live in 4 minutes · no wire fees
            </span>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-6 border-t-2 border-[#F4F4EF]/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="grid h-8 w-8 place-items-center border-2 border-[#F4F4EF] bg-[#2FE6A0] font-[family-name:var(--font-archivo)] text-lg leading-none text-[#0a0a0a]"
              aria-hidden
            >
              L
            </span>
            <span className={`${display} text-xl`}>Ledger</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[#F4F4EF]/55">
            {["Product", "Rates", "Developers", "Security", "Status", "Terms"].map(
              (l) => (
                <a key={l} href="#" className="transition-colors hover:text-[#2FE6A0]">
                  {l}
                </a>
              )
            )}
          </nav>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#F4F4EF]/35">
            &copy; 2026 Ledger Financial
          </span>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * PAGE
 * ================================================================== */
export function LedgerLanding() {
  return (
    <div className="min-h-[100dvh] bg-[#F4F4EF] font-[family-name:var(--font-grotesk)] text-[#0a0a0a] antialiased selection:bg-[#2FE6A0] selection:text-[#0a0a0a]">
      <Nav />
      <main>
        <Hero />
        <MarqueeStrip />
        <StatBand />
        <Features />
        <Pricing />
        <Security />
        <CtaFooter />
      </main>
    </div>
  );
}
