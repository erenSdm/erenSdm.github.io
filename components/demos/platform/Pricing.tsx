"use client";

import { ArrowRight, Check } from "lucide-react";
import { Kicker, mono, Reveal, sans } from "./primitives";

const TIERS: {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}[] = [
  {
    name: "Hobby",
    price: "$0",
    cadence: "/mo",
    blurb: "For side projects and prototypes on the edge.",
    features: [
      "100k edge requests / mo",
      "1 region · shared compute",
      "Community Discord support",
      "1 GB vector store",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$20",
    cadence: "/mo",
    blurb: "For teams shipping production traffic worldwide.",
    features: [
      "50M edge requests / mo",
      "All 34 regions · autoscaling",
      "Instant rollbacks + previews",
      "100 GB vector store",
      "Traces & logs, 30-day retention",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "For platforms with compliance and scale needs.",
    features: [
      "Volume pricing from $0.20/M",
      "Dedicated compute + BYOC",
      "SOC 2, HIPAA, SSO/SAML",
      "99.99% uptime SLA",
      "Named solutions engineer",
    ],
    cta: "Talk to sales",
  },
];

export function Pricing() {
  return (
    <section className="border-b border-line bg-[#070708]">
      <div className="mx-auto max-w-[1220px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="text-center">
          <Kicker className="justify-center">Pricing</Kicker>
          <h2
            className={`${sans} mx-auto mt-4 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.04] tracking-[-0.03em] text-paper`}
          >
            Priced per request. Scales to zero.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.02rem] leading-relaxed text-bone">
            No seats, no idle charges. Start on the free tier and only pay when
            traffic shows up.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                  t.highlight
                    ? "border-[#22d3ee]/50 bg-gradient-to-b from-[#22d3ee]/[0.07] to-transparent shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_30px_80px_-40px_rgba(34,211,238,0.5)] lg:-translate-y-3"
                    : "border-line bg-ink"
                }`}
              >
                {t.highlight && (
                  <span
                    className={`${mono} absolute -top-3 left-7 rounded-full bg-[#22d3ee] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#04141a]`}
                  >
                    Most popular
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <span className={`${sans} text-[17px] font-semibold text-paper`}>
                    {t.name}
                  </span>
                </div>
                <div className="mt-5 flex items-end gap-1">
                  <span
                    className={`${sans} text-[44px] font-bold leading-none tracking-[-0.03em] text-paper`}
                  >
                    {t.price}
                  </span>
                  {t.cadence && (
                    <span className={`${mono} mb-1.5 text-[13px] text-dim`}>
                      {t.cadence}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-ash">
                  {t.blurb}
                </p>

                <ul className="mt-6 space-y-3 border-t border-line pt-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13.5px]">
                      <Check
                        size={15}
                        strokeWidth={2.75}
                        className="mt-0.5 shrink-0 text-[#22d3ee]"
                      />
                      <span className="text-bone">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className={`${sans} group mt-8 inline-flex items-center justify-center gap-1.5 rounded-lg px-5 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-px ${
                    t.highlight
                      ? "bg-[#22d3ee] text-[#04141a] shadow-[0_10px_30px_-10px_rgba(34,211,238,0.7)]"
                      : "border border-line bg-[#0c0c0e] text-paper hover:border-line-soft"
                  }`}
                >
                  {t.cta}
                  <ArrowRight
                    size={15}
                    strokeWidth={2.5}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
