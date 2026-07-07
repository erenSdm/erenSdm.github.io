"use client";

import { ArrowUpRight } from "lucide-react";
import { MODEL, formatUSD, heroImage } from "./data";
import { useConfig } from "./config";
import { DISPLAY, MONO, Label, Reveal } from "./ui";

export function ReserveFooter() {
  const { paint, wheel, interior, total, rangeKm } = useConfig();

  const summary: [string, string][] = [
    ["Model", `${MODEL.marque} ${MODEL.name}`],
    ["Paint", paint.name],
    ["Wheels", wheel.name],
    ["Interior", interior.name],
    ["Est. range", `${rangeKm} km WLTP`],
  ];

  return (
    <footer id="reserve" className="relative overflow-hidden border-t border-line">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          // eslint-disable-next-line @next/next/no-img-element
          src={heroImage(paint.seed)}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/85 to-void/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-28 md:px-10 md:py-36">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Headline */}
          <div className="lg:col-span-7">
            <Reveal>
              <Label accent>Reserve</Label>
              <h2
                className={`${DISPLAY} mt-5 font-medium uppercase leading-[0.86] tracking-[-0.01em] text-paper`}
                style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
              >
                Be first
                <br />
                on the road
              </h2>
              <p className="mt-7 max-w-md text-[15px] leading-relaxed text-bone">
                Secure your build with a fully refundable $1,000 deposit.
                Production allocation opens Q3 2026 — reservation holders
                configure and confirm first.
              </p>

              <a
                href="#reserve"
                className={`${MONO} group mt-10 inline-flex items-center gap-4 bg-[#ffb800] px-8 py-4 text-[12px] uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:bg-white`}
              >
                Reserve for $1,000
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            </Reveal>
          </div>

          {/* Configured summary card */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="border border-line bg-void/60 p-7 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Label>Your configuration</Label>
                  <span
                    className="h-4 w-4 rounded-full border border-white/25"
                    style={{ backgroundColor: paint.hex }}
                  />
                </div>

                <dl className="mt-6 flex flex-col">
                  {summary.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between border-t border-line-soft py-3"
                    >
                      <dt className={`${MONO} text-[11px] uppercase tracking-[0.16em] text-ash`}>
                        {k}
                      </dt>
                      <dd className="text-[13.5px] tracking-[0.01em] text-paper">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex items-end justify-between border-t border-line pt-6">
                  <span className={`${MONO} text-[10.5px] uppercase tracking-[0.22em] text-ash`}>
                    Est. total
                  </span>
                  <span className={`${DISPLAY} text-[42px] font-medium leading-none text-[#ffb800]`}>
                    {formatUSD(total)}
                  </span>
                </div>
                <p className={`${MONO} mt-3 text-[10px] tracking-[0.12em] text-dim`}>
                  Excl. taxes, incentives &amp; destination.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-24 flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <span className={`${DISPLAY} text-[16px] font-semibold uppercase tracking-[0.42em] text-paper`}>
            APEX
          </span>
          <span className={`${MONO} text-[10.5px] uppercase tracking-[0.2em] text-ash`}>
            {MODEL.designation}
          </span>
          <span className={`${MONO} text-[10.5px] uppercase tracking-[0.2em] text-dim`}>
            © 2026 APEX Motors — Concept
          </span>
        </div>
      </div>
    </footer>
  );
}
