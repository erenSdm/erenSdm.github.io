"use client";

import { useState } from "react";
import { CreditCard, Home, PieChart, User, type LucideIcon } from "lucide-react";

const TABS: { label: string; icon: LucideIcon }[] = [
  { label: "Home", icon: Home },
  { label: "Cards", icon: CreditCard },
  { label: "Insights", icon: PieChart },
  { label: "Profile", icon: User },
];

export function BottomTabBar() {
  const [active, setActive] = useState("Home");

  return (
    <nav
      aria-label="Primary"
      className="relative z-20 border-t border-white/[0.06] bg-[#0A0C0B]/85 px-3 pb-2 pt-2.5 backdrop-blur-xl"
    >
      <ul className="flex items-center justify-between">
        {TABS.map(({ label, icon: Icon }) => {
          const on = active === label;
          return (
            <li key={label} className="flex-1">
              <button
                type="button"
                onClick={() => setActive(label)}
                aria-current={on ? "page" : undefined}
                className="flex w-full flex-col items-center gap-1 py-1 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95"
              >
                <Icon
                  className="h-[21px] w-[21px] transition-colors duration-300"
                  strokeWidth={on ? 2.2 : 1.7}
                  style={{ color: on ? "#2FBF8C" : "rgba(255,255,255,0.4)" }}
                />
                <span
                  className="text-[10px] font-medium tracking-tight transition-colors duration-300"
                  style={{ color: on ? "#2FBF8C" : "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
