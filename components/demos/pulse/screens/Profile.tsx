"use client";

import { Bluetooth, Watch } from "lucide-react";
import { HR_ZONES, MAX_HR } from "../data";
import { usePulse, type Prefs } from "../store";
import { NUM_STYLE, ZONE_COLORS } from "../tokens";
import { Card, CardHead, STROKE, Toggle } from "../ui";

const BODY = [
  { k: "Age", v: "32" },
  { k: "Height", v: "168", u: "cm" },
  { k: "Weight", v: "61.4", u: "kg" },
  { k: "Max HR", v: String(MAX_HR), u: "bpm" },
];

const DEVICES = [
  { icon: Watch, name: "Wrist sensor", detail: "Battery 64% · synced 14:48" },
  { icon: Bluetooth, name: "Chest strap HRM", detail: "Last used Wednesday" },
];

const PREFS: { key: keyof Prefs; label: string; detail: string }[] = [
  { key: "reminders", label: "Stand reminders", detail: "At 10 minutes to the hour" },
  { key: "weeklyDigest", label: "Monday summary", detail: "Your week in one notification" },
  { key: "autoPause", label: "Auto-pause runs", detail: "Pauses the timer when you stop" },
];


export function ProfileScreen() {
  const { state, dispatch, streak } = usePulse();
  return (
    <div className="flex flex-col gap-3 px-4 pb-6">
      <div className="flex items-center gap-4 px-1 py-2">
        <span
          className="grid size-[68px] shrink-0 place-items-center rounded-full bg-[#FDECE7] text-[26px] font-semibold text-[#CC3D22]"
          style={NUM_STYLE}
          aria-hidden
        >
          DA
        </span>
        <div className="min-w-0">
          <p className="text-[20px] font-semibold tracking-[-0.02em] text-[#14171C]">Defne Arslan</p>
          <p className="text-[13px] text-[#545C67]">Kadıköy, İstanbul · since March 2023</p>
          <p className="mt-1 text-[13px] font-semibold text-[#C23A1F]">{streak}-day move streak</p>
        </div>
      </div>

      <Card>
        <dl className="grid grid-cols-4 gap-2">
          {BODY.map((b) => (
            <div key={b.k}>
              <dt className="text-[11px] font-medium text-[#545C67]">{b.k}</dt>
              <dd className="text-[26px] font-semibold leading-tight text-[#14171C]" style={NUM_STYLE}>
                {b.v}
                {b.u ? <span className="ml-0.5 text-[11px] font-medium text-[#545C67]">{b.u}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <CardHead title="Heart rate zones" right={<span className="text-[12px] text-[#545C67]">From max {MAX_HR} bpm</span>} />
        <ul className="flex flex-col gap-2">
          {HR_ZONES.map((z, i) => (
            <li key={z.name} className="flex items-center gap-3 text-[13px]">
              <span className="h-5 w-1.5 rounded-full" style={{ background: ZONE_COLORS[i] }} />
              <span className="flex-1 text-[#14171C]">
                Zone {i + 1} · {z.name}
              </span>
              <span className="text-[#545C67]" style={{ fontVariantNumeric: "tabular-nums" }}>
                {i === 0 ? `under ${z.max + 1}` : i === 4 ? `${z.min}+` : `${z.min}–${z.max}`} bpm
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="py-1">
        <ul className="divide-y divide-[#E4E7EB]">
          {DEVICES.map((d) => (
            <li key={d.name}>
              <div className="flex w-full items-center gap-3 py-3">
                <span className="grid size-10 place-items-center rounded-[12px] bg-[#F1F2F4] text-[#14171C]">
                  <d.icon size={18} strokeWidth={STROKE} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold text-[#14171C]">{d.name}</span>
                  <span className="block text-[12px] text-[#545C67]">{d.detail}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="py-1">
        <ul className="divide-y divide-[#E4E7EB]">
          {PREFS.map((p) => (
            <li key={p.key} className="flex items-center gap-3 py-3">
              <span className="flex-1">
                <span className="block text-[14px] font-semibold text-[#14171C]">{p.label}</span>
                <span className="block text-[12px] text-[#545C67]">{p.detail}</span>
              </span>
              <Toggle label={p.label} on={state.prefs[p.key]} onChange={() => dispatch({ type: "pref", key: p.key })} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
