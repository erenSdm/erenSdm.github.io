"use client";

import { Kicker, mono, Reveal, sans } from "./primitives";

const STEPS: {
  n: string;
  title: string;
  body: string;
  code: string[];
}[] = [
  {
    n: "01",
    title: "Connect your repo",
    body: "Point COBALT at a Git repository. We detect your framework and wire up preview deploys on every push.",
    code: ["$ cobalt link", "✔ detected  next@16", "✔ branch    main → prod"],
  },
  {
    n: "02",
    title: "Write against the SDK",
    body: "Import the type-safe client. Queries, storage, and vectors are one import away — no glue code, no config sprawl.",
    code: [
      "import { Cobalt }",
      "  from \"cobalt\";",
      "const db = cbt.sql;",
    ],
  },
  {
    n: "03",
    title: "Ship to the edge",
    body: "One command deploys to every region behind a global anycast address. Rollbacks and logs are there when you need them.",
    code: ["$ cobalt deploy", "→ 34 regions · 2.1s", "→ live: cobalt.sh/x"],
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-line bg-[#070708]">
      <div className="mx-auto max-w-[1220px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <Kicker>Workflow</Kicker>
          <h2
            className={`${sans} mt-4 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.03em] text-paper`}
          >
            From clone to production in three steps.
          </h2>
        </Reveal>

        <div className="relative mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 0.1}
              className="flex flex-col bg-ink p-7"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`${mono} text-[13px] font-semibold text-[#22d3ee]`}
                >
                  STEP {s.n}
                </span>
                <span className={`${sans} text-[40px] font-bold leading-none text-line`}>
                  {s.n}
                </span>
              </div>
              <h3 className={`${sans} mt-6 text-[19px] font-semibold text-paper`}>
                {s.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ash">
                {s.body}
              </p>
              <div className="mt-6 rounded-lg border border-line bg-[#08080a] px-3.5 py-3">
                <pre className={`${mono} text-[11.5px] leading-[1.75]`}>
                  <code className="block whitespace-pre text-bone">
                    {s.code.map((line, j) => (
                      <div
                        key={j}
                        className={
                          line.startsWith("✔") || line.startsWith("→")
                            ? "text-[#22d3ee]"
                            : line.startsWith("$")
                            ? "text-paper"
                            : "text-ash"
                        }
                      >
                        {line}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
