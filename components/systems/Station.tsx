"use client";

import { memo, type ReactNode } from "react";
import {
  Bell,
  ChartNoAxesColumn,
  Cpu,
  Database,
  Globe,
  Inbox,
  Layers,
  MessageCircle,
  MessageSquareQuote,
  Plug,
  Route,
  Scissors,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { BRANDS, type BrandKey } from "./brands";
import { STATION_H, STATION_W } from "./lanes";
import { VB, tx, type IconKey, type StationDef } from "./types";

const ICONS: Record<IconKey, typeof Cpu> = {
  plug: Plug,
  cpu: Cpu,
  shield: ShieldCheck,
  zap: Zap,
  db: Database,
  bell: Bell,
  globe: Globe,
  scissors: Scissors,
  sparkles: Sparkles,
  route: Route,
  chat: MessageCircle,
  quote: MessageSquareQuote,
  users: Users,
  inbox: Inbox,
  layers: Layers,
  chart: ChartNoAxesColumn,
};

export type StationState = "idle" | "active" | "done" | "warn" | "err";

/** A brand's logo on its own colour, the way people recognise it in their dock. */
export function BrandMark({ k, className }: { k: BrandKey; className?: string }) {
  const b = BRANDS[k];
  return (
    <span
      aria-hidden
      className={cn("flex shrink-0 items-center justify-center", className)}
      style={{ background: b.bg, color: b.fg }}
    >
      {"path" in b && b.path ? (
        <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="currentColor">
          <path d={b.path} />
        </svg>
      ) : (
        <span className="font-wide text-[0.95em] font-semibold lowercase leading-none tracking-tight">
          {"wordmark" in b ? b.wordmark : ""}
        </span>
      )}
    </span>
  );
}

const pct = (s: StationDef, w: number, h: number) => ({
  left: `${((s.x - w / 2) / VB.w) * 100}%`,
  top: `${((s.y - h / 2) / VB.h) * 100}%`,
  width: `${(w / VB.w) * 100}%`,
  height: `${(h / VB.h) * 100}%`,
});

const ring = (state: StationState) =>
  state === "err" || state === "warn"
    ? "#ff3b1f"
    : state === "active"
      ? "#ccff00"
      : state === "done"
        ? "rgba(244,244,239,0.4)"
        : "transparent";

/** Our own service: dark tile, outlined, hatched when it's an AI step. */
function OwnTile({ s }: { s: StationDef }) {
  const Icon = ICONS[s.icon ?? "cpu"];
  const ai = s.kind === "ai";
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center border bg-[#121310]",
        ai ? "border-volt/60 text-volt" : "border-paper/30 text-paper/85"
      )}
      style={{
        ...(ai ? { backgroundImage: "repeating-linear-gradient(-45deg, rgba(204,255,0,0.12) 0 1px, transparent 1px 5px)" } : null),
        ...(s.kind === "gate" ? { borderLeftWidth: 3, borderRightWidth: 3 } : null),
        ...(s.kind === "store" ? { borderBottomStyle: "double" as const, borderBottomWidth: 4 } : null),
      }}
    >
      <Icon className="h-[46%] w-[46%]" strokeWidth={1.5} />
    </span>
  );
}

export const Station = memo(function Station({
  s,
  state,
  children,
}: {
  s: StationDef;
  state: StationState;
  children?: ReactNode;
}) {
  const { locale } = useLanguage();
  const card = !!children || s.w !== undefined;
  const w = s.w ?? STATION_W;
  const h = s.h ?? STATION_H;
  const on = state === "active";
  const bad = state === "err" || state === "warn";
  const done = state === "done";

  /* tile: the logo is the station; name and load hang underneath, metro-map style */
  if (!card) {
    return (
      <>
        <div
          className={cn("absolute transition-transform duration-500", on && "-translate-y-[2px]")}
          style={{ ...pct(s, w, h), outline: `2px solid ${ring(state)}`, outlineOffset: 3, transition: "outline-color .4s, transform .5s" }}
        >
          {s.brand ? <BrandMark k={s.brand} className="h-full w-full text-[1.4em]" /> : <OwnTile s={s} />}
          {bad && <span aria-hidden className="absolute -right-[5px] -top-[5px] h-[8px] w-[8px] bg-hazard" />}
        </div>
        <div
          className="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center text-center"
          style={{ left: `${(s.x / VB.w) * 100}%`, top: `calc(${((s.y + h / 2) / VB.h) * 100}% + 0.7em)`, width: `${(170 / VB.w) * 100}%` }}
        >
          <span
            lang="en"
            className={cn(
              "font-plex bg-carbon px-[0.3em] text-[1em] font-medium uppercase leading-tight transition-colors duration-300",
              bad ? "text-hazard" : on ? "text-volt" : "text-paper"
            )}
          >
            {s.label}
          </span>
          {s.sub && <span className="font-plex bg-carbon px-[0.3em] text-[0.86em] leading-tight text-paper/50">{tx(s.sub, locale)}</span>}
          {s.load && <span className="font-plex mt-[0.15em] bg-carbon px-[0.3em] text-[0.84em] tabular text-volt/80">{tx(s.load, locale)}</span>}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "absolute flex flex-col gap-[0.5em] border p-[0.55em] text-paper transition-[border-color,background-color,transform] duration-500",
          bad
            ? "border-hazard bg-[#1d1210]"
            : on
              ? "-translate-y-[2px] border-volt bg-[#181a10]"
              : done
                ? "border-paper/35 bg-[#141512]"
                : "border-paper/15 bg-[#111210]"
        )}
        style={{
          ...pct(s, w, h),
          ...(s.kind === "store" ? { borderBottomStyle: "double" as const, borderBottomWidth: 4 } : null),
        }}
      >
        <div className="flex min-w-0 shrink-0 items-center gap-[0.6em]">
          <MarkSmall s={s} />
          <div className="min-w-0 flex-1">
            <div lang="en" className="font-plex truncate text-[1em] font-medium uppercase leading-tight">
              {s.label}
            </div>
            {s.sub && <div className="font-plex truncate text-[0.88em] leading-tight text-paper/50">{tx(s.sub, locale)}</div>}
          </div>
          <span
            aria-hidden
            className={cn(
              "h-[6px] w-[6px] shrink-0 self-start transition-colors duration-300",
              bad ? "bg-hazard" : on ? "animate-blink bg-volt" : done ? "bg-volt/50" : "bg-paper/15"
            )}
          />
        </div>
        {children && <div className="relative min-h-0 flex-1">{children}</div>}
      </div>

      {s.load && (
        <div
          className="font-plex pointer-events-none absolute -translate-x-1/2 whitespace-nowrap bg-carbon px-[0.3em] text-[0.84em] tabular text-volt/80"
          style={{ left: `${(s.x / VB.w) * 100}%`, top: `calc(${((s.y + h / 2) / VB.h) * 100}% + 0.45em)` }}
        >
          {tx(s.load, locale)}
        </div>
      )}
    </>
  );
});


function MarkSmall({ s }: { s: StationDef }) {
  if (s.brand) return <BrandMark k={s.brand} className="h-[2.1em] w-[2.1em]" />;
  const Icon = ICONS[s.icon ?? "cpu"];
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-[2.1em] w-[2.1em] shrink-0 items-center justify-center border",
        s.kind === "ai" ? "border-volt/60 text-volt" : "border-paper/30 text-paper/80"
      )}
    >
      <Icon className="h-[56%] w-[56%]" strokeWidth={1.5} />
    </span>
  );
}
