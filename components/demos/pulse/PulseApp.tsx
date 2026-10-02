"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Activity, ChartColumn, CircleCheck, Dumbbell, Plus, UserRound, type LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { numerals, ui } from "./fonts";
import { PulseProvider, usePulse, type Tab } from "./store";
import { C, SPRING } from "./tokens";
import { STROKE } from "./ui";
import { WorkoutFlow } from "./WorkoutFlow";
import { TodayScreen } from "./screens/Today";
import { WorkoutsScreen } from "./screens/Workouts";
import { ProgressScreen } from "./screens/Progress";
import { ProfileScreen } from "./screens/Profile";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "today", label: "Today", icon: Activity },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "progress", label: "Progress", icon: ChartColumn },
  { id: "profile", label: "Profile", icon: UserRound },
];

const MONTHS: Record<string, string> = { Sep: "September", Oct: "October" };

function Header() {
  const { state, dispatch, days } = usePulse();
  const day = days[state.day];
  const eyebrow =
    state.tab === "today" ? `${day.weekday}, ${day.date} ${MONTHS[day.month]}` : state.tab === "profile" ? "Account" : "Friday, 2 October";
  const title =
    state.tab === "today" ? (day.isToday ? "Today" : day.weekday) : TABS.find((t) => t.id === state.tab)?.label ?? "";
  return (
    <header className="flex items-end justify-between px-5 pt-2 pb-3">
      <div>
        <p className="text-[13px] font-medium text-[#545C67]">{eyebrow}</p>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING}
            className="text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#14171C]"
          >
            {title}
          </motion.h1>
        </AnimatePresence>
      </div>
      {state.tab === "today" ? (
        <button
          onClick={() => dispatch({ type: "tab", tab: "profile" })}
          aria-label="Open profile"
          className="mb-1 grid size-10 place-items-center rounded-full bg-[#FDECE7] text-[14px] font-semibold text-[#CC3D22]"
        >
          DA
        </button>
      ) : state.tab === "workouts" ? (
        <button
          onClick={() => dispatch({ type: "flow", open: true })}
          aria-label="Start a workout"
          className="mb-1 grid size-10 place-items-center rounded-full bg-[#CC3D22] text-white transition active:scale-[0.94]"
        >
          <Plus size={20} strokeWidth={STROKE} />
        </button>
      ) : null}
    </header>
  );
}

function TabBar() {
  const { state, dispatch } = usePulse();
  return (
    <nav
      aria-label="Sections"
      className="relative z-20 shrink-0 border-t border-[#E4E7EB] bg-white/90 backdrop-blur-xl"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <ul className="grid grid-cols-4 px-2 pt-1.5">
        {TABS.map((t) => {
          const active = state.tab === t.id;
          return (
            <li key={t.id}>
              <button
                onClick={() => dispatch({ type: "tab", tab: t.id })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex w-full flex-col items-center gap-1 py-1.5 text-[11px] font-medium transition-colors",
                  active ? "text-[#CC3D22]" : "text-[#545C67]",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="pulse-tab"
                    transition={SPRING}
                    className="absolute top-0 h-[34px] w-14 rounded-full bg-[#FDECE7]"
                  />
                ) : null}
                <span className="relative grid h-[34px] place-items-center">
                  <t.icon size={22} strokeWidth={STROKE} />
                </span>
                <span className="relative -mt-1">{t.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Toast() {
  const { state, dispatch } = usePulse();
  const toast = state.toast;
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => dispatch({ type: "toast", text: null }), 2800);
    return () => window.clearTimeout(t);
  }, [toast, dispatch]);
  return (
    <div className="pointer-events-none absolute inset-x-0 z-50 flex justify-center px-4" style={{ top: "calc(var(--safe-top) + 6px)" }}>
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={SPRING}
            className="flex items-center gap-2 rounded-full bg-[#14171C] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(20,23,28,0.5)]"
          >
            <CircleCheck size={16} strokeWidth={STROKE} className="text-[#7FD8B6]" />
            {toast.text}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Screen() {
  const { state } = usePulse();
  return (
    <div className="relative min-h-0 flex-1">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={state.tab}
          className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none]"
          style={{ paddingTop: "var(--safe-top)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ ...SPRING, opacity: { duration: 0.18 } }}
        >
          <Header />
          {state.tab === "today" ? (
            <TodayScreen />
          ) : state.tab === "workouts" ? (
            <WorkoutsScreen />
          ) : state.tab === "progress" ? (
            <ProgressScreen />
          ) : (
            <ProfileScreen />
          )}
        </motion.div>
      </AnimatePresence>
      {/* keeps scrolled content out from under the status bar and island */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{ height: "var(--safe-top)", background: `linear-gradient(${C.canvas} 70%, ${C.canvas}00)` }}
      />
    </div>
  );
}

function Shell() {
  const { state } = usePulse();
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden" style={{ background: C.canvas }}>
      <Screen />
      <TabBar />
      <AnimatePresence>{state.flowOpen ? <WorkoutFlow key="flow" /> : null}</AnimatePresence>
      <Toast />
    </div>
  );
}

export function PulseApp() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn(numerals.variable, ui.variable, "h-full min-h-0 flex-1")}
        style={{ fontFamily: "var(--pulse-ui), system-ui, sans-serif", letterSpacing: "-0.005em", color: C.ink }}
      >
        <PulseProvider>
          <Shell />
        </PulseProvider>
      </div>
    </MotionConfig>
  );
}
