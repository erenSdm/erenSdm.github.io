"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { WorkIndex, type Project } from "./WorkIndex";

/* ----------------------------------------------------------------
   VANTA — Independent Brand Studio
   Kinetic typographic maximalism · near-black / off-white / vermilion
------------------------------------------------------------------- */

const DISPLAY: CSSProperties = { fontFamily: "var(--font-archivo)" };
const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE = ["WE MAKE", "BRANDS", "IMPOSSIBLE", "TO IGNORE"];

const MARQUEE = [
  "Brand Strategy",
  "Identity Systems",
  "Motion & Film",
  "Art Direction",
  "Editorial Design",
  "Naming",
  "Packaging",
  "Digital Product",
  "Sound Design",
  "Type Design",
];

const PROJECTS: Project[] = [
  {
    client: "Sólen",
    title: "Rebranding a solar utility into a household name",
    year: "2024",
    disciplines: "Identity / Motion",
    seed: "vanta-solen-orange",
  },
  {
    client: "Marrow",
    title: "A butcher's manifesto for a chef-led restaurant group",
    year: "2023",
    disciplines: "Brand / Art Direction",
    seed: "vanta-marrow-red",
  },
  {
    client: "Kinetik",
    title: "A performance brand that moves the way athletes do",
    year: "2024",
    disciplines: "Product / Motion",
    seed: "vanta-kinetik-blue",
  },
  {
    client: "Orbital Freight",
    title: "Naming and identity for orbital-grade logistics",
    year: "2025",
    disciplines: "Brand / Web",
    seed: "vanta-orbital-dark",
  },
  {
    client: "Heartwood & Co.",
    title: "Blackletter, aged sixteen years, bottled for the shelf",
    year: "2023",
    disciplines: "Packaging / Naming",
    seed: "vanta-heartwood-amber",
  },
  {
    client: "Fête Maison",
    title: "The art of the pour for a fifth-generation champagne house",
    year: "2022",
    disciplines: "Editorial / Packaging",
    seed: "vanta-fete-cream",
  },
];

const CAPABILITIES: { label: string; title: string; body: string }[] = [
  {
    label: "STR",
    title: "Brand Strategy",
    body: "Positioning, naming, verbal identity, and the argument for why you matter.",
  },
  {
    label: "IDN",
    title: "Identity Systems",
    body: "Logotypes, type, and color — plus the rules that keep them alive at scale.",
  },
  {
    label: "MOT",
    title: "Motion & Film",
    body: "Title sequences, brand films, and interfaces that move with real intent.",
  },
  {
    label: "PRD",
    title: "Digital Product",
    body: "Design systems and sites engineered to hold attention and convert it.",
  },
  {
    label: "EDT",
    title: "Editorial & Print",
    body: "Books, packaging, and objects that earn their place on the shelf.",
  },
  {
    label: "TYP",
    title: "Sound & Type",
    body: "Custom typefaces and sonic signatures, drawn and mixed in-house.",
  },
];

/* ---------- shared reveal ---------- */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE, delay },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- hero word (per-word mask reveal) ---------- */

function HeroWord({
  word,
  index,
  variant = "solid",
}: {
  word: string;
  index: number;
  variant?: "solid" | "outline" | "accent";
}) {
  const reduce = useReducedMotion();
  const style: CSSProperties = { ...DISPLAY };
  if (variant === "outline") {
    style.WebkitTextStroke = "clamp(1px, 0.35vw, 3px) #F4F4EF";
    style.color = "transparent";
  } else if (variant === "accent") {
    style.color = "#FF4D2E";
  }

  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        style={style}
        initial={{ y: reduce ? 0 : "115%" }}
        animate={{ y: 0 }}
        transition={{
          duration: 1,
          ease: EASE,
          delay: reduce ? 0 : 0.15 + index * 0.11,
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

/* ---------- marquee row ---------- */

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="flex overflow-hidden py-4">
      <div
        className="flex shrink-0 animate-marquee items-center whitespace-nowrap"
        style={
          {
            "--marquee-duration": "46s",
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span
              style={DISPLAY}
              className="px-6 text-[clamp(1.75rem,4.5vw,3.75rem)] uppercase leading-none tracking-[-0.01em] text-[#F4F4EF]"
            >
              {item}
            </span>
            <span
              aria-hidden
              className="h-2.5 w-2.5 rotate-45 bg-[#FF4D2E]"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export function Vanta() {
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0A0A0A] text-[#F4F4EF] antialiased [font-feature-settings:'ss01']">
      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-5 py-5 md:px-10">
        <a
          href="#top"
          style={DISPLAY}
          className="text-xl uppercase leading-none tracking-[-0.02em] outline-none focus-visible:text-[#FF4D2E]"
        >
          Vanta
          <span className="text-[#FF4D2E]">.</span>
        </a>
        <p className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#7f7f78] sm:block">
          Independent Brand Studio — Est. 2016
        </p>
        <a
          href="#contact"
          className="group flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#F4F4EF] outline-none transition-colors hover:text-[#FF4D2E] focus-visible:text-[#FF4D2E]"
        >
          Start a project
          <ArrowUpRight
            aria-hidden
            strokeWidth={1.5}
            className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative flex min-h-[88vh] flex-col justify-between px-5 pb-8 pt-[8vh] md:px-10"
      >
        <div className="pointer-events-none absolute right-5 top-0 hidden max-w-[26ch] pt-2 text-right md:right-10 md:block">
          <motion.p
            className="font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-[#7f7f78]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: reduce ? 0 : 0.9 }}
          >
            [ Manifesto ] — A brand that whispers gets ignored. We build the
            other kind.
          </motion.p>
        </div>

        <div className="flex flex-1 items-center">
          <h1 className="text-[clamp(3rem,13.5vw,13rem)] uppercase leading-[0.82] tracking-[-0.03em]">
            <HeroWord word={HEADLINE[0]} index={0} />
            <HeroWord word={HEADLINE[1]} index={1} variant="outline" />
            <HeroWord word={HEADLINE[2]} index={2} variant="accent" />
            <HeroWord word={HEADLINE[3]} index={3} />
          </h1>
        </div>

        <div className="flex items-end justify-between gap-6">
          <motion.a
            href="#work"
            className="group flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#7f7f78] outline-none focus-visible:text-[#F4F4EF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: reduce ? 0 : 1.1 }}
          >
            <span
              className={
                reduce
                  ? "flex h-9 w-9 items-center justify-center rounded-full border border-[#26261f]"
                  : "flex h-9 w-9 animate-floaty items-center justify-center rounded-full border border-[#26261f]"
              }
            >
              <ArrowDown
                aria-hidden
                strokeWidth={1.5}
                className="h-4 w-4 text-[#F4F4EF] transition-colors group-hover:text-[#FF4D2E]"
              />
            </span>
            Scroll to selected work
          </motion.a>

          <motion.p
            className="max-w-[30ch] font-grotesk text-sm leading-relaxed text-[#cbcbc2] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: reduce ? 0 : 0.9 }}
          >
            A brand that whispers gets ignored. We build the other kind.
          </motion.p>
        </div>
      </section>

      {/* Marquee band */}
      <section
        aria-label="Disciplines"
        className="border-y border-[#26261f] py-6"
      >
        <MarqueeRow />
        <div className="h-px bg-[#26261f]" />
        <MarqueeRow reverse />
      </section>

      {/* Selected Work */}
      <section id="work" className="px-5 py-24 md:px-10 md:py-36">
        <Reveal className="mb-12 flex items-end justify-between md:mb-16">
          <h2
            style={DISPLAY}
            className="text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-[-0.02em]"
          >
            Selected
            <br />
            Work
          </h2>
          <p className="hidden max-w-[24ch] font-grotesk text-sm text-[#7f7f78] md:block">
            Six of the identities we have built since founding. Hover any line
            to see it.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <WorkIndex projects={PROJECTS} />
        </Reveal>
      </section>

      {/* Statement / pull-quote */}
      <section className="border-t border-[#26261f] px-5 py-24 md:px-10 md:py-40">
        <Reveal>
          <p className="mb-10 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#FF4D2E]">
            [ On principle ]
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <blockquote
            style={DISPLAY}
            className="max-w-[16ch] text-[clamp(2.25rem,8vw,7rem)] uppercase leading-[0.9] tracking-[-0.02em]"
          >
            We don&rsquo;t do{" "}
            <span
              style={{
                WebkitTextStroke: "clamp(1px, 0.3vw, 2px) #F4F4EF",
                color: "transparent",
              }}
            >
              quiet
            </span>
            . Loud enough to remember, sharp enough to{" "}
            <span className="text-[#FF4D2E]">trust</span>.
          </blockquote>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-12 max-w-[46ch] font-grotesk text-base leading-relaxed text-[#cbcbc2] md:text-lg">
            VANTA is an independent studio of eleven — strategists, designers,
            and type engineers working out of one room in Lisbon. We take on
            eight brands a year, and we finish what we start.
          </p>
        </Reveal>
      </section>

      {/* Capabilities */}
      <section
        id="capabilities"
        className="border-t border-[#26261f] px-5 py-24 md:px-10 md:py-36"
      >
        <Reveal className="mb-14">
          <h2
            style={DISPLAY}
            className="text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-[-0.02em]"
          >
            What we do
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-px border border-[#26261f] bg-[#26261f] md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.label} delay={(i % 3) * 0.06}>
              <div className="group flex h-full flex-col justify-between gap-16 bg-[#0A0A0A] p-7 transition-colors duration-500 hover:bg-[#121212] md:p-9">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#7f7f78] transition-colors group-hover:text-[#FF4D2E]">
                    {c.label}
                  </span>
                  <span
                    aria-hidden
                    className="h-2 w-2 rotate-45 bg-[#26261f] transition-colors duration-500 group-hover:bg-[#FF4D2E]"
                  />
                </div>
                <div>
                  <h3
                    style={DISPLAY}
                    className="mb-3 text-[clamp(1.5rem,3vw,2.25rem)] uppercase leading-[0.95] tracking-[-0.01em]"
                  >
                    {c.title}
                  </h3>
                  <p className="max-w-[34ch] font-grotesk text-sm leading-relaxed text-[#7f7f78]">
                    {c.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-[#26261f] px-5 pb-16 pt-24 md:px-10 md:pb-12 md:pt-36"
      >
        <Reveal>
          <p className="mb-8 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#7f7f78]">
            [ Start something ] — Currently booking Q3 2026
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <a
            href="mailto:hello@vanta.studio"
            className="group block outline-none"
            aria-label="Email VANTA at hello@vanta.studio"
          >
            <span
              style={DISPLAY}
              className="block text-[clamp(3.5rem,18vw,17rem)] uppercase leading-[0.82] tracking-[-0.03em] transition-colors duration-500 group-hover:text-[#FF4D2E] group-focus-visible:text-[#FF4D2E]"
            >
              Let&rsquo;s
              <br />
              Talk
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-8 border-t border-[#26261f] pt-8 md:flex-row md:items-end md:justify-between">
            <a
              href="mailto:hello@vanta.studio"
              className="group flex items-center gap-3 font-grotesk text-xl outline-none md:text-2xl"
            >
              <span className="border-b border-transparent transition-colors group-hover:border-[#FF4D2E] group-focus-visible:border-[#FF4D2E]">
                hello@vanta.studio
              </span>
              <ArrowUpRight
                aria-hidden
                strokeWidth={1.25}
                className="h-5 w-5 text-[#FF4D2E] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <nav
              aria-label="Social"
              className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#7f7f78]"
            >
              {["Instagram", "LinkedIn", "Are.na", "Dribbble"].map((s) => (
                <a
                  key={s}
                  href="#contact"
                  className="outline-none transition-colors hover:text-[#F4F4EF] focus-visible:text-[#F4F4EF]"
                >
                  {s}
                </a>
              ))}
            </nav>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[#4a4a45] md:flex-row md:items-center md:justify-between">
          <span>© 2026 VANTA Studio Lda. — Lisbon</span>
          <span>Rua do Século 84 — 38.7139° N, 9.1459° W</span>
          <span>Built to be impossible to ignore</span>
        </div>
      </section>
    </div>
  );
}
