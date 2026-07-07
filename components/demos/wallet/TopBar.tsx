"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { OWNER } from "./data";

export function TopBar() {
  const hour = 19; // fixed "good evening" demo state
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="relative z-20 flex items-center justify-between px-5 pt-5 pb-4">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
          {greeting}
        </p>
        <h1 className="mt-1 truncate text-[19px] font-semibold leading-none tracking-tight text-white">
          {OWNER.firstName}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/70 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.6} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#2FBF8C] ring-2 ring-[#0A0C0B]" />
        </button>

        <button
          type="button"
          aria-label="Your profile"
          className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95"
        >
          <Image
            src={OWNER.avatar}
            alt="Eren Aydemir"
            width={40}
            height={40}
            className="h-full w-full object-cover"
            unoptimized
          />
        </button>
      </div>
    </header>
  );
}
