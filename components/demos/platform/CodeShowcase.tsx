"use client";

import { Check, Terminal as TerminalIcon } from "lucide-react";
import {
  CodeBlock,
  Com,
  Fn,
  K,
  Kicker,
  mono,
  Num,
  Prop,
  Pu,
  Reveal,
  sans,
  Str,
  Ty,
} from "./primitives";

/* cobalt.config.ts */
const CONFIG_LINES = [
  <>
    <K>import</K> <Pu>{"{ "}</Pu>
    <Fn>defineConfig</Fn>
    <Pu>{" }"}</Pu> <K>from</K> <Str>&quot;cobalt&quot;</Str>
    <Pu>;</Pu>
  </>,
  <>&nbsp;</>,
  <>
    <K>export</K> <K>default</K> <Fn>defineConfig</Fn>
    <Pu>{"({"}</Pu>
  </>,
  <>
    {"  "}
    <Prop>project</Prop>
    <Pu>:</Pu> <Str>&quot;edge-api&quot;</Str>
    <Pu>,</Pu>
  </>,
  <>
    {"  "}
    <Prop>runtime</Prop>
    <Pu>:</Pu> <Str>&quot;edge&quot;</Str>
    <Pu>,</Pu> <Com>// or &quot;node&quot;</Com>
  </>,
  <>
    {"  "}
    <Prop>cache</Prop>
    <Pu>:</Pu> <Pu>{"{ "}</Pu>
    <Prop>strategy</Prop>
    <Pu>:</Pu> <Str>&quot;swr&quot;</Str>
    <Pu>,</Pu> <Prop>ttl</Prop>
    <Pu>:</Pu> <Num>60</Num> <Pu>{"},"}</Pu>
  </>,
  <>
    {"  "}
    <Prop>vectors</Prop>
    <Pu>:</Pu> <Pu>{"{ "}</Pu>
    <Prop>dim</Prop>
    <Pu>:</Pu> <Num>1536</Num>
    <Pu>,</Pu> <Prop>metric</Prop>
    <Pu>:</Pu> <Str>&quot;cosine&quot;</Str> <Pu>{"},"}</Pu>
  </>,
  <>
    {"  "}
    <Prop>observability</Prop>
    <Pu>:</Pu> <Pu>{"{ "}</Pu>
    <Prop>sampleRate</Prop>
    <Pu>:</Pu> <Num>1.0</Num> <Pu>{"},"}</Pu>
  </>,
  <>
    <Pu>{"})"}</Pu>
    <Pu>;</Pu>
  </>,
];

const CONFIG_RAW = `import { defineConfig } from "cobalt";

export default defineConfig({
  project: "edge-api",
  runtime: "edge", // or "node"
  cache: { strategy: "swr", ttl: 60 },
  vectors: { dim: 1536, metric: "cosine" },
  observability: { sampleRate: 1.0 },
});`;

const RESPONSE = [
  <>
    <Prop>$</Prop> <Fn>curl</Fn> <Pu>-i</Pu>{" "}
    <Str>https://edge-api.cobalt.sh/health</Str>
  </>,
  <>&nbsp;</>,
  <>
    <Ty>HTTP</Ty>/<Num>2</Num> <Num>200</Num>
  </>,
  <>
    <Prop>cbt-region</Prop>
    <Pu>:</Pu> <Str>iad1</Str>
  </>,
  <>
    <Prop>cbt-cache</Prop>
    <Pu>:</Pu> <Str>HIT</Str>
  </>,
  <>
    <Prop>server-timing</Prop>
    <Pu>:</Pu> <Str>edge;dur=8</Str>
  </>,
  <>&nbsp;</>,
  <>
    <Pu>{"{ "}</Pu>
    <Prop>&quot;status&quot;</Prop>
    <Pu>:</Pu> <Str>&quot;ok&quot;</Str>
    <Pu>,</Pu> <Prop>&quot;region&quot;</Prop>
    <Pu>:</Pu> <Str>&quot;iad1&quot;</Str> <Pu>{"}"}</Pu>
  </>,
];

const RESPONSE_RAW = `$ curl -i https://edge-api.cobalt.sh/health

HTTP/2 200
cbt-region: iad1
cbt-cache: HIT
server-timing: edge;dur=8

{ "status": "ok", "region": "iad1" }`;

const FEATURES = [
  "Zero-config framework detection",
  "Stale-while-revalidate edge caching",
  "Structured logs streamed to your sink",
];

export function CodeShowcase() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1220px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-28">
        {/* copy */}
        <Reveal>
          <Kicker>Config over convention</Kicker>
          <h2
            className={`${sans} mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.04] tracking-[-0.03em] text-paper`}
          >
            One file describes your whole deployment.
          </h2>
          <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-bone">
            Declare your runtime, caching, vector index, and tracing in a single
            typed config. COBALT provisions the rest and hands you back a URL
            that answers in single-digit milliseconds.
          </p>
          <ul className="mt-7 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-[#22d3ee]/40 bg-[#22d3ee]/10 text-[#22d3ee]">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-[14px] text-bone">{f}</span>
              </li>
            ))}
          </ul>
          <div
            className={`${mono} mt-8 inline-flex items-center gap-2 rounded-lg border border-line bg-[#0a0a0b] px-3.5 py-2 text-[12px] text-ash`}
          >
            <TerminalIcon size={13} className="text-[#22d3ee]" />
            benchmarked on c6i.xlarge · median of 10k requests
          </div>
        </Reveal>

        {/* stacked code */}
        <Reveal delay={0.12}>
          <div className="space-y-4">
            <CodeBlock
              tabs={[{ name: "cobalt.config.ts", active: true }]}
              meta={<span className={`${mono} text-[11px] text-dim`}>edge</span>}
              lines={CONFIG_LINES}
              copyText={CONFIG_RAW}
            />
            <CodeBlock
              numbers={false}
              tabs={[{ name: "terminal", active: true }]}
              meta={
                <span className={`${mono} text-[11px] text-[#86efac]`}>
                  200 OK
                </span>
              }
              lines={RESPONSE}
              copyText={RESPONSE_RAW}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
