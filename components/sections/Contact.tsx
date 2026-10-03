"use client";

import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { scrollToId } from "@/lib/utils";
import { SplitButton } from "@/components/primitives/SplitButton";

const EMAIL = "errenaydemir@gmail.com";
const PHONE = "+90 546 262 42 74";
const PHONE_DIGITS = "905462624274";

export function Contact() {
  const { t, locale, toggle } = useLanguage();

  return (
    <footer id="contact" data-prism="contact" className="relative text-paper">
      <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-28 md:px-10 md:pt-40 lg:px-[8.5vw]">

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* pulled out of the gutter to line up with the wordmark below */}
          <h2 className="font-wide text-[clamp(2.2rem,6.2vw,6.6rem)] lg:col-span-8 lg:-ml-[3.5vw]">
            {t.contact.title.map((l, i) => (
              <span key={l} className={i === t.contact.titleAccent ? "block text-paper/45" : "block"}>
                {l}
              </span>
            ))}
          </h2>

          <div className="flex flex-col justify-end gap-10 lg:col-span-4">
            <dl className="font-plex border-t border-dashed border-paper/25 text-sm">
              {[
                {
                  k: t.contact.emailLabel,
                  v: (
                    <a
                      href={`mailto:${EMAIL}`}
                      className="break-all underline decoration-paper/30 underline-offset-4 transition-colors hover:text-volt hover:decoration-volt"
                    >
                      {EMAIL}
                    </a>
                  ),
                },
                {
                  k: t.contact.phoneLabel,
                  v: (
                    <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      <a
                        href={`tel:+${PHONE_DIGITS}`}
                        className="whitespace-nowrap underline decoration-paper/30 underline-offset-4 transition-colors hover:text-volt hover:decoration-volt"
                      >
                        {PHONE}
                      </a>
                      <a
                        href={`https://wa.me/${PHONE_DIGITS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ui text-volt underline decoration-volt/40 underline-offset-4 transition-colors hover:decoration-volt"
                      >
                        {t.contact.whatsapp}
                      </a>
                    </span>
                  ),
                },
                {
                  k: t.contact.availabilityLabel,
                  v: (
                    <span className="flex items-start gap-2">
                      {/* pinned to the first line when the label wraps */}
                      <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 animate-blink rounded-full bg-volt" />
                      {t.contact.availability}
                    </span>
                  ),
                },
                { k: t.contact.locationLabel, v: t.contact.location },
              ].map((row) => (
                <div
                  key={row.k}
                  className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-dashed border-paper/25 py-4"
                >
                  <dt className="ui pt-0.5 text-paper/50">{row.k}</dt>
                  <dd className="text-paper/90">{row.v}</dd>
                </div>
              ))}
            </dl>

            <SplitButton tone="volt" href={`mailto:${EMAIL}`}>
              {t.contact.cta}
            </SplitButton>
          </div>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="overflow-hidden px-3 md:px-6" aria-hidden>
        <div className="font-wide text-wordmark whitespace-nowrap text-center leading-[0.8] tracking-[-0.06em] text-paper/[0.92]">
          EREN AYDEMİR<span className="text-volt">.</span>
        </div>
      </div>

      <div className="rule-dashed mt-8 text-paper" aria-hidden />
      <div className="mx-auto flex max-w-[1680px] flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <span className="ui text-paper/55">
          © 2026 Eren Aydemir — {t.footer.tag}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="ui h-9 rounded-full border border-paper/25 px-4 text-paper/75 transition-colors hover:border-paper hover:text-paper"
          >
            {locale === "en" ? "Türkçe" : "English"}
          </button>
          <button
            type="button"
            onClick={() => scrollToId("top", 0)}
            className="ui flex h-9 items-center gap-2 rounded-full border border-paper/25 px-4 text-paper/75 transition-colors hover:border-paper hover:text-paper"
          >
            {t.footer.backToTop}
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <p className="font-plex mx-auto max-w-[1680px] px-4 pb-8 text-[11px] text-paper/35 md:px-10">
        {t.footer.colophon}
      </p>
    </footer>
  );
}
