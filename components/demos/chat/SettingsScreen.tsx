"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  CornerDownLeft,
  Eye,
  HardDrive,
  Lock,
  MessageSquareText,
  QrCode,
  Sparkles,
  Type,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { ME } from "./data";
import { ICON, PRESS, SPRING, type Prefs, type TextSize } from "./ui";

const LAST_SEEN = ["Everyone", "My contacts", "Nobody"] as const;
const SOUNDS = ["Chime", "Pebble", "Off"] as const;
const SIZES: TextSize[] = ["Small", "Default", "Large"];

const STORAGE = [
  { label: "Photos", gb: 2.14, color: "#2F62E6" },
  { label: "Voice", gb: 0.61, color: "#16A06F" },
  { label: "Files", gb: 0.27, color: "#B7791F" },
  { label: "Other", gb: 0.4, color: "#9AA3B2" },
];
const STORAGE_TOTAL = 8;

function cycle<T>(list: readonly T[], value: T): T {
  return list[(list.indexOf(value) + 1) % list.length];
}

export function SettingsScreen({ prefs, onChange }: { prefs: Prefs; onChange: (p: Prefs) => void }) {
  const [lastSeen, setLastSeen] = useState<(typeof LAST_SEEN)[number]>("My contacts");
  const [sound, setSound] = useState<(typeof SOUNDS)[number]>("Chime");
  const [notify, setNotify] = useState(true);
  const [qr, setQr] = useState(false);
  const reduce = useReducedMotion();
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => onChange({ ...prefs, [k]: v });
  const used = STORAGE.reduce((s, x) => s + x.gb, 0);

  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <header className="px-5 pb-2" style={{ paddingTop: "calc(var(--safe-top) + 6px)" }}>
        <p className="text-[12.5px] font-medium text-(--ink-2)">RELAY</p>
        <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.035em]">Settings</h1>
      </header>

      <div className="space-y-6 px-4 pb-8 pt-3">
        <section className="flex items-center gap-4 rounded-[22px] bg-(--surface) p-4 shadow-[0_1px_2px_rgba(28,44,82,0.05)] ring-1 ring-(--line)">
          <Avatar name={ME.name} tint={ME.tint} size={60} online />
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-bold tracking-[-0.025em]">{ME.name}</p>
            <p className="text-[13.5px] text-(--ink-2)">{ME.handle}</p>
            <p className="text-[13.5px] tabular-nums text-(--ink-2)">{ME.phone}</p>
          </div>
          <button
            type="button"
            aria-label={qr ? "Hide my QR code" : "Show my QR code"}
            aria-expanded={qr}
            onClick={() => setQr((v) => !v)}
            className={cn(
              PRESS,
              "grid size-10 place-items-center rounded-full",
              qr ? "bg-(--accent) text-white" : "bg-(--accent-soft) text-(--accent)",
            )}
          >
            <QrCode className="size-5" {...ICON} />
          </button>
        </section>

        <AnimatePresence initial={false}>
          {qr && (
            <motion.section
              key="qr"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduce ? { duration: 0 } : SPRING}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 rounded-[22px] bg-(--surface) p-4 ring-1 ring-(--line)">
                <QrMark />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold">Scan to add {ME.name.split(" ")[0]}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-(--ink-2)">relay.me/deniz.aral opens a chat with you on any phone.</p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <Group title="Privacy">
          <ToggleRow
            icon={CheckCheck}
            label="Read receipts"
            hint="Turning this off also hides receipts from others"
            on={prefs.readReceipts}
            onToggle={(v) => set("readReceipts", v)}
          />
          <ValueRow icon={Eye} label="Last seen and online" value={lastSeen} onClick={() => setLastSeen(cycle(LAST_SEEN, lastSeen))} />
          <ValueRow icon={Lock} label="Encryption" value="On for all chats" />
        </Group>

        <Group title="Chats">
          <ToggleRow
            icon={Sparkles}
            label="Quick replies"
            hint="Suggested answers above the keyboard"
            on={prefs.quickReplies}
            onToggle={(v) => set("quickReplies", v)}
          />
          <ToggleRow
            icon={CornerDownLeft}
            label="Enter to send"
            hint="Shift and Enter adds a new line"
            on={prefs.enterToSend}
            onToggle={(v) => set("enterToSend", v)}
          />
          <ValueRow icon={Type} label="Message text size" value={prefs.textSize} onClick={() => set("textSize", cycle(SIZES, prefs.textSize))} />
        </Group>

        <Group title="Notifications">
          <ToggleRow icon={Bell} label="Message alerts" on={notify} onToggle={setNotify} />
          <ToggleRow
            icon={MessageSquareText}
            label="Show previews"
            hint="Hide message text for unread chats"
            on={prefs.previews}
            onToggle={(v) => set("previews", v)}
          />
          <ValueRow icon={Volume2} label="Sound" value={sound} onClick={() => setSound(cycle(SOUNDS, sound))} />
        </Group>

        <Group title="Storage">
          <div className="px-4 py-3.5">
            <div className="flex items-baseline justify-between">
              <span className="flex items-center gap-2 text-[15px] font-medium">
                <HardDrive className="size-[18px] text-(--ink-2)" {...ICON} />
                {used.toFixed(2)} GB used
              </span>
              <span className="text-[13px] tabular-nums text-(--ink-2)">of {STORAGE_TOTAL} GB</span>
            </div>
            <div className="mt-3 flex h-2.5 gap-[3px] overflow-hidden rounded-full bg-(--sunk)">
              {STORAGE.map((s) => (
                <span key={s.label} style={{ width: `${(s.gb / STORAGE_TOTAL) * 100}%`, background: s.color }} />
              ))}
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {STORAGE.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-[13px]">
                  <span className="size-2 rounded-full" style={{ background: s.color }} />
                  <span className="flex-1">{s.label}</span>
                  <span className="tabular-nums text-(--ink-2)">{s.gb.toFixed(2)} GB</span>
                </li>
              ))}
            </ul>
          </div>
        </Group>

        <p className="flex items-center justify-center gap-1.5 text-[12px] text-(--ink-2)">
          <Lock className="size-3" {...ICON} />
          RELAY 4.2.1, end-to-end encrypted
        </p>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="px-2 pb-2 text-[12.5px] font-semibold text-(--ink-2)">{title}</h2>
      <div className="divide-y divide-(--line) overflow-hidden rounded-[18px] bg-(--surface) shadow-[0_1px_2px_rgba(28,44,82,0.05)] ring-1 ring-(--line)">
        {children}
      </div>
    </section>
  );
}

function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-(--sunk) text-(--ink)">
      <Icon className="size-[17px]" {...ICON} />
    </span>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  on,
  onToggle,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  on: boolean;
  onToggle: (v: boolean) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onToggle(!on)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-(--sunk)"
    >
      <RowIcon icon={icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium">{label}</span>
        {hint && <span className="block text-[12.5px] leading-snug text-(--ink-2)">{hint}</span>}
      </span>
      <span
        className={cn(
          "flex h-[30px] w-[50px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200",
          on ? "justify-end bg-(--accent)" : "justify-start bg-[#D3D8E0]",
        )}
      >
        <motion.span
          layout
          transition={reduce ? { duration: 0 } : SPRING}
          className="size-6 rounded-full bg-white shadow-[0_2px_4px_rgba(16,20,31,0.2)]"
        />
      </span>
    </button>
  );
}

function ValueRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <RowIcon icon={icon} />
      <span className="min-w-0 flex-1 text-[15px] font-medium">{label}</span>
      <motion.span
        key={value}
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn("shrink-0 text-[14px]", onClick ? "font-medium text-(--accent)" : "text-(--ink-2)")}
      >
        {value}
      </motion.span>
    </>
  );
  if (!onClick) return <div className="flex items-center gap-3 px-4 py-3">{content}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}. Tap to change`}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-(--sunk)"
    >
      {content}
    </button>
  );
}

/** deterministic QR-style mark with the three finder squares */
function QrMark() {
  const n = 21;
  const cells: { x: number; y: number }[] = [];
  let seed = 7919;
  const finder = (x: number, y: number) =>
    [0, n - 7].some((ox) => [0, n - 7].some((oy) => !(ox === n - 7 && oy === n - 7) && x >= ox && x < ox + 7 && y >= oy && y < oy + 7));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      seed = (seed * 16807) % 2147483647;
      if (!finder(x, y) && seed % 100 < 46) cells.push({ x, y });
    }
  }
  const corners = [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ];
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="size-[92px] shrink-0 rounded-xl bg-white p-1 ring-1 ring-(--line)" role="img" aria-label="QR code for relay.me/deniz.aral">
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={1} height={1} fill="#10141F" />
      ))}
      {corners.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.4} fill="none" stroke="#10141F" strokeWidth={1} />
          <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.7} fill="#2F62E6" />
        </g>
      ))}
    </svg>
  );
}
