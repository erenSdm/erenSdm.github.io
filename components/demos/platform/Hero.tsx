"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import {
  CodeBlock,
  Com,
  Fn,
  K,
  mono,
  Num,
  Prop,
  Pu,
  Reveal,
  sans,
  Str,
  Ty,
} from "./primitives";
import { Terminal } from "./Terminal";

/* deploy.ts — hand-highlighted API snippet */
const DEPLOY_LINES = [
  <>
    <K>import</K> <Pu>{"{ "}</Pu>
    <Ty>Cobalt</Ty>
    <Pu>{" }"}</Pu> <K>from</K> <Str>&quot;cobalt&quot;</Str>
    <Pu>;</Pu>
  </>,
  <>&nbsp;</>,
  <>
    <K>const</K> <Prop>cbt</Prop> <Pu>=</Pu> <K>new</K> <Fn>Cobalt</Fn>
    <Pu>{"({ "}</Pu>token<Pu>:</Pu> <Prop>process</Prop>
    <Pu>.</Pu>env<Pu>.</Pu>
    <Prop>COBALT_TOKEN</Prop> <Pu>{"});"}</Pu>
  </>,
  <>&nbsp;</>,
  <>
    <Com>// ship to every edge region in one call</Com>
  </>,
  <>
    <K>export</K> <K>const</K> <Prop>app</Prop> <Pu>=</Pu> <K>await</K>{" "}
    <Prop>cbt</Prop>
    <Pu>.</Pu>
    <Fn>deploy</Fn>
    <Pu>{"({"}</Pu>
  </>,
  <>
    {"  "}
    <Prop>runtime</Prop>
    <Pu>:</Pu> <Str>&quot;edge&quot;</Str>
    <Pu>,</Pu>
  </>,
  <>
    {"  "}
    <Prop>regions</Prop>
    <Pu>:</Pu> <Pu>[</Pu>
    <Str>&quot;iad1&quot;</Str>
    <Pu>,</Pu> <Str>&quot;fra1&quot;</Str>
    <Pu>,</Pu> <Str>&quot;sin1&quot;</Str>
    <Pu>]</Pu>
    <Pu>,</Pu>
  </>,
  <>
    {"  "}
    <Prop>scaleToZero</Prop>
    <Pu>:</Pu> <Num>true</Num>
    <Pu>,</Pu>
  </>,
  <>
    <Pu>{"});"}</Pu>
  </>,
];

const DEPLOY_RAW = `import { Cobalt } from "cobalt";

const cbt = new Cobalt({ token: process.env.COBALT_TOKEN });

// ship to every edge region in one call
export const app = await cbt.deploy({
  runtime: "edge",
  regions: ["iad1", "fra1", "sin1"],
  scaleToZero: true,
});`;

const LOGOS = ["Ramp", "Linear", "Retool", "Supabase", "Replicate", "Vercel"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* subtle cyan mesh glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 68% 8%, rgba(34,211,238,0.10), transparent 60%), radial-gradient(40% 40% at 8% 30%, rgba(34,211,238,0.05), transparent 55%)",
        }}
      />
      {/* blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(#12121a 1px, transparent 1px), linear-gradient(90deg, #12121a 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage:
            "radial-gradient(80% 70% at 50% 20%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 70% at 50% 20%, #000 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1220px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-24">
        {/* ---------- copy ---------- */}
        <Reveal>
          <a
            href="#"
            className={`${mono} inline-flex items-center gap-2 rounded-full border border-line bg-[#0c0c0e] py-1 pl-1 pr-3 text-[12px] text-bone transition-colors hover:border-[#22d3ee]/40`}
          >
            <span className="rounded-full bg-[#22d3ee]/15 px-2 py-0.5 text-[11px] font-semibold text-[#22d3ee]">
              v4.2
            </span>
            Instant rollbacks are now GA
            <ArrowRight size={13} strokeWidth={2} className="text-ash" />
          </a>

          <h1
            className={`${sans} mt-6 text-[clamp(2.6rem,5.4vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.03em] text-paper`}
          >
            The edge platform
            <br />
            engineers{" "}
            <span className="text-[#22d3ee]">deploy to.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-bone">
            Push to production in milliseconds. COBALT runs your code across a
            global edge network with a type-safe SDK, instant rollbacks, and
            observability wired in from the first request.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className={`${sans} group inline-flex items-center gap-1.5 rounded-lg bg-[#22d3ee] px-5 py-3 text-[14px] font-semibold text-[#04141a] shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_10px_30px_-10px_rgba(34,211,238,0.7)] transition-transform hover:-translate-y-px`}
            >
              Start deploying
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#"
              className={`${sans} inline-flex items-center gap-2 rounded-lg border border-line bg-[#0c0c0e] px-5 py-3 text-[14px] font-medium text-bone transition-colors hover:border-line-soft hover:text-paper`}
            >
              <BookOpen size={16} strokeWidth={2} />
              Read the docs
            </a>
          </div>

          {/* install one-liner */}
          <div className="mt-6 flex max-w-md items-center justify-between gap-3 rounded-lg border border-line bg-[#0a0a0b] px-4 py-2.5">
            <code className={`${mono} text-[13px] text-bone`}>
              <span className="mr-2 text-[#22d3ee]">$</span>
              npm i <span className="text-paper">cobalt</span>
            </code>
            <span className={`${mono} text-[11px] text-dim`}>MIT</span>
          </div>

          {/* trusted by */}
          <div className="mt-10">
            <p className={`${mono} text-[11px] uppercase tracking-[0.2em] text-dim`}>
              Shipping in production at
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
              {LOGOS.map((l) => (
                <span
                  key={l}
                  className={`${sans} text-[15px] font-semibold tracking-tight text-ash transition-colors hover:text-bone`}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---------- code + terminal ---------- */}
        <Reveal delay={0.12} className="lg:pl-4">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-x-6 -top-6 bottom-10 -z-10 rounded-2xl bg-[#22d3ee]/[0.04] blur-2xl"
            />
            <CodeBlock
              className="shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
              tabs={[
                { name: "deploy.ts", active: true },
                { name: "cobalt.config.ts" },
              ]}
              meta={
                <span className={`${mono} text-[11px] text-dim`}>TypeScript</span>
              }
              lines={DEPLOY_LINES}
              copyText={DEPLOY_RAW}
            />
            <Terminal className="mt-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
