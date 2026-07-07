"use client";

import { ChevronLeft, Phone, Video } from "lucide-react";
import type { ChatContact } from "./data";

export function ChatHeader({ contact }: { contact: ChatContact }) {
  return (
    <header className="relative z-10 shrink-0 border-b border-white/[0.06] bg-[#0A0A0A]/85 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-3 py-3">
        <button
          type="button"
          aria-label="Back to conversations"
          className="grid h-9 w-9 place-items-center rounded-full text-bone transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] hover:text-paper active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={contact.avatar}
            alt=""
            width={120}
            height={120}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
          />
          {contact.online && (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#35C88A] ring-2 ring-[#0A0A0A]"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-paper">
            {contact.name}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-ash">
            {contact.online && (
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#35C88A]"
                aria-hidden="true"
              />
            )}
            <span className="truncate">{contact.presence}</span>
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Call ${contact.name}`}
            className="grid h-9 w-9 place-items-center rounded-full text-bone transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] hover:text-paper active:scale-95"
          >
            <Phone className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`Video call ${contact.name}`}
            className="grid h-9 w-9 place-items-center rounded-full text-bone transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] hover:text-paper active:scale-95"
          >
            <Video className="h-[19px] w-[19px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
