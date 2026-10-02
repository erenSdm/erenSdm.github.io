"use client";

import { ChevronLeft, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { GLASS, PRESS } from "./glass";
import type { ChatContact } from "./data";

export function ChatHeader({ contact }: { contact: ChatContact }) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20">
      {/* scroll-edge fade so messages dissolve under the glass controls */}
      <div className="absolute inset-x-0 top-0 h-[calc(var(--safe-top)+88px)] bg-gradient-to-b from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent" />
      <div className="relative flex items-start justify-between px-4 pt-[calc(var(--safe-top)+4px)]">
        <button
          type="button"
          aria-label="Back to conversations"
          className={cn(
            "pointer-events-auto relative grid h-11 w-11 place-items-center rounded-full text-white",
            GLASS,
            PRESS,
          )}
        >
          <ChevronLeft className="h-[22px] w-[22px] -translate-x-px" strokeWidth={2.2} />
          <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#3E7BFA] px-1 text-[11px] font-semibold text-white">
            4
          </span>
        </button>

        <div className="pointer-events-auto flex flex-col items-center gap-1">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={contact.avatar}
              alt=""
              width={120}
              height={120}
              className="h-[52px] w-[52px] rounded-full object-cover shadow-[0_6px_20px_-6px_rgba(0,0,0,0.8)]"
            />
            {contact.online && (
              <span
                className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-[#34C759] ring-[2.5px] ring-[#0B0B0D]"
                aria-hidden="true"
              />
            )}
          </div>
          <div className={cn("flex items-center gap-1 rounded-full px-3 py-1", GLASS)}>
            <p className="max-w-[160px] truncate text-[13px] font-semibold tracking-[-0.01em] text-white">
              {contact.name}
            </p>
            <ChevronLeft className="h-3 w-3 rotate-180 text-white/50" strokeWidth={2.5} />
          </div>
          <p className="sr-only">{contact.presence}</p>
        </div>

        <div
          className={cn(
            "pointer-events-auto flex h-11 items-center rounded-full text-white",
            GLASS,
          )}
        >
          <button
            type="button"
            aria-label={`Video call ${contact.name}`}
            className={cn("grid h-11 w-11 place-items-center rounded-full", PRESS)}
          >
            <Video className="h-[20px] w-[20px]" strokeWidth={1.9} />
          </button>
          <span className="h-5 w-px bg-white/10" aria-hidden />
          <button
            type="button"
            aria-label={`Call ${contact.name}`}
            className={cn("grid h-11 w-11 place-items-center rounded-full", PRESS)}
          >
            <Phone className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </button>
        </div>
      </div>
    </header>
  );
}
