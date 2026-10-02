"use client";

import React from "react";
import { Easing, clamp, useTime, SceneStage } from "./_runtime";

// ===== Tokens — site (Pricing) ile birebir =====
const GOLD = "#D4AF37";
const SILVER = "#C0C0C0";
const SURFACE = "#0d0d0d";
const BORDER = "#242424";
const BORDER_GOLD = "#D4AF37";
const TEXT = "#E8E8E8";
const TEXT_DIM = "#8A8A8A";
const INK_950 = "#0a0a0a";
const GREEN = "#4ADE80";

const SHADOW_DEFAULT = "2px 2px 0 0 rgba(0,0,0,0.6)";
const SHADOW_FOCUS = "4px 4px 0 0 #000";

const RADIUS_CARD = 3;
const RADIUS_PANEL_INTRO = 6;

const FONT_BODY = 'var(--font-body), "Satoshi", system-ui, sans-serif';
const FONT_HEADING = 'var(--font-heading), "Chillax", "Satoshi", system-ui, sans-serif';
const FONT_MONO = 'var(--font-body)';
const FONT_DISPLAY = 'var(--font-heading), "Chillax", "Satoshi", system-ui, sans-serif';

const STAGE_W = 1280;
const STAGE_H = 720;
const CX = STAGE_W / 2;
const CY = STAGE_H / 2;

const PANEL_W = 360;
const PANEL_H = 320;
const GAP = 140;
const ACC_X = CX - GAP / 2 - PANEL_W;
const BOT_X = CX + GAP / 2;
const PANEL_Y = CY - PANEL_H / 2 + 20;

const T = {
    ICONS_IN: 0,
    SHIELD_CLOSE: 0.4,
    CONNECT: 0.7,
    PANELS_OPEN: 1.0,
    PANELS_DONE: 2.5,
    SIGNALS_START: 2.8,
    DISCONNECT: 9.0,
    ISOLATED: 10.5,
    END: 12.0,
};

const TRADES = [
    { pair: "BTC", pnl: 124.50, t: 3.2 },
    { pair: "ETH", pnl: 87.20, t: 4.2 },
    { pair: "SOL", pnl: 52.10, t: 5.2 },
    { pair: "BNB", pnl: 38.80, t: 6.2 },
    { pair: "AVAX", pnl: 64.30, t: 7.2 },
    { pair: "LINK", pnl: 41.10, t: 8.0 },
];
const START_BALANCE = 44928.52;

function AccountIcon({ size = 64 }: { size?: number }) {
    return (
        <div style={{ width: size, height: size, borderRadius: RADIUS_CARD, background: SURFACE, border: `1px solid ${BORDER_GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW_DEFAULT }}>
            <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 36 36" fill="none">
                <rect x="6" y="10" width="24" height="18" rx="3" stroke={GOLD} strokeWidth="2" />
                <rect x="6" y="10" width="24" height="5" fill={GOLD} />
                <circle cx="24" cy="20" r="2" fill={SILVER} />
                <path d="M10 20h6" stroke={SILVER} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function BotIcon({ size = 64 }: { size?: number }) {
    return (
        <img
            src="/demos/richcase/rc-700x700.png"
            alt="RC"
            width={size}
            height={size}
            style={{
                width: size,
                height: size,
                objectFit: "contain",
                display: "block",
                filter: `drop-shadow(0 4px 10px rgba(0,0,0,0.45))`,
            }}
        />
    );
}

function PanelShield({ x, y, w, h, time, intensity }: { x: number; y: number; w: number; h: number; time: number; intensity: number }) {
    if (intensity <= 0.001) return null;
    const dashOffset = -(time * 22) % 40;
    const inset = 8;
    const sx = x - inset, sy = y - inset;
    const sw = w + inset * 2, sh = h + inset * 2;
    return (
        <div style={{ position: "absolute", left: sx, top: sy, width: sw, height: sh, pointerEvents: "none", opacity: intensity, zIndex: 5 }}>
            <svg width={sw} height={sh} style={{ position: "absolute", inset: 0 }}>
                <rect x="2" y="2" width={sw - 4} height={sh - 4} rx={RADIUS_PANEL_INTRO} ry={RADIUS_PANEL_INTRO} stroke={GOLD} strokeWidth="1.4" fill="none" strokeDasharray="8 6" strokeDashoffset={dashOffset} opacity={0.85} />
            </svg>
        </div>
    );
}

function StartingShield({ time, cx, cy, iconSize }: { time: number; cx: number; cy: number; iconSize: number }) {
    if (time >= T.PANELS_OPEN) return null;
    const closeT = clamp((time - T.SHIELD_CLOSE) / 0.6, 0, 1);
    if (closeT <= 0) return null;
    const finalSize = iconSize + 28;
    const fromSize = iconSize + 80;
    const size = fromSize + (finalSize - fromSize) * Easing.easeOutCubic(closeT);
    const rot = (time * 22) % 360;
    return (
        <div style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, pointerEvents: "none", transform: `rotate(${rot}deg)`, opacity: closeT }}>
            <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
                <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} stroke={GOLD} strokeWidth="1.5" fill="none" strokeDasharray="6 5" opacity={0.85} />
            </svg>
        </div>
    );
}

function Connection({ time, fromX, toX, midY, intensity }: { time: number; fromX: number; toX: number; midY: number; intensity: number }) {
    if (intensity <= 0.001) return null;
    const lineW = toX - fromX;
    const pulseOffset = (time % 1.2) / 1.2;
    return (
        <div style={{ position: "absolute", left: fromX, top: midY - 1, width: lineW, height: 2, opacity: intensity, pointerEvents: "none", zIndex: 3 }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${GOLD}55 0%, ${GOLD}cc 50%, ${GOLD}55 100%)` }} />
            <div style={{ position: "absolute", left: -5, top: -3, width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            <div style={{ position: "absolute", right: -5, top: -3, width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            <div style={{ position: "absolute", left: pulseOffset * lineW - 5, top: -3, width: 10, height: 8, borderRadius: "50%", background: GOLD }} />
        </div>
    );
}

function BrokenConnection({ time, fromX, toX, midY }: { time: number; fromX: number; toX: number; midY: number }) {
    const breakT = clamp((time - T.DISCONNECT) / 0.6, 0, 1);
    if (breakT <= 0) return null;
    const fadeT = clamp((time - T.ISOLATED) / 0.4, 0, 1);
    const visible = breakT * (1 - fadeT);
    if (visible <= 0.001) return null;
    const lineW = toX - fromX;
    const pull = breakT * 30;
    const stubLen = lineW / 2 - pull - 10;
    if (stubLen <= 0) return null;
    return (
        <>
            <div style={{ position: "absolute", left: fromX, top: midY - 1, width: stubLen, height: 2, opacity: visible * 0.6, background: `linear-gradient(90deg, ${GOLD}55, ${GOLD}88)`, zIndex: 3 }} />
            <div style={{ position: "absolute", left: toX - stubLen, top: midY - 1, width: stubLen, height: 2, opacity: visible * 0.4, background: `linear-gradient(90deg, ${GOLD}66, ${GOLD}33)`, zIndex: 3 }} />
            <div style={{ position: "absolute", left: fromX + stubLen - 6, top: midY - 6, width: 12, height: 12, borderRadius: "50%", background: GOLD, opacity: visible * (1 - breakT * 0.7), zIndex: 4 }} />
        </>
    );
}

function StartingPhase({ time }: { time: number }) {
    if (time >= T.PANELS_OPEN + 0.05) return null;
    const iconSize = 72;
    const accCX = CX - 110;
    const accCY = CY;
    const botCX = CX + 110;
    const botCY = CY;
    const entryT = clamp(time / 0.4, 0, 1);
    const opacity = entryT;
    const scale = 0.7 + Easing.easeOutCubic(entryT) * 0.3;
    let connEl: React.ReactNode = null;
    if (time >= T.CONNECT) {
        const t = clamp((time - T.CONNECT) / 0.3, 0, 1);
        const intensity = Easing.easeOutCubic(t);
        const halfRev = ((botCX - accCX) / 2) * intensity;
        connEl = <Connection time={time} fromX={CX - halfRev} toX={CX + halfRev} midY={CY} intensity={intensity} />;
    }
    return (
        <>
            <StartingShield time={time} cx={accCX} cy={accCY} iconSize={iconSize} />
            <div style={{ position: "absolute", left: accCX - iconSize / 2, top: accCY - iconSize / 2, opacity, transform: `scale(${scale})`, transformOrigin: "center", zIndex: 10 }}>
                <AccountIcon size={iconSize} />
            </div>
            <div style={{ position: "absolute", left: botCX - iconSize / 2, top: botCY - iconSize / 2, opacity, transform: `scale(${scale})`, transformOrigin: "center", zIndex: 10 }}>
                <BotIcon size={iconSize} />
            </div>
            {connEl}
        </>
    );
}

function vaultTotal(time: number) {
    let total = 0;
    TRADES.forEach((tr) => {
        if (time >= tr.t) {
            const addT = clamp((time - tr.t) / 0.5, 0, 1);
            total += tr.pnl * Easing.easeOutCubic(addT);
        }
    });
    return total;
}

function AccountPanel({ time }: { time: number }) {
    if (time < T.PANELS_OPEN) return null;
    const openT = clamp((time - T.PANELS_OPEN) / (T.PANELS_DONE - T.PANELS_OPEN), 0, 1);
    const eased = Easing.easeInOutCubic(openT);
    const iconSize = 72;
    const fromCX = CX - 110;
    const fromCY = CY;
    const fromW = iconSize, fromH = iconSize;
    const w = fromW + (PANEL_W - fromW) * eased;
    const h = fromH + (PANEL_H - fromH) * eased;
    const toCX = ACC_X + PANEL_W / 2;
    const toCY = PANEL_Y + PANEL_H / 2;
    const cx = fromCX + (toCX - fromCX) * eased;
    const cy = fromCY + (toCY - fromCY) * eased;
    const x = cx - w / 2;
    const y = cy - h / 2;
    const headerOpacity = clamp((openT - 0.6) / 0.4, 0, 1);
    const bodyOpacity = clamp((time - T.PANELS_DONE) / 0.4, 0, 1);
    const balance = START_BALANCE + vaultTotal(time);
    const balStr = balance.toFixed(2);
    const [intPart, decPart] = balStr.split(".");
    const intStr = parseInt(intPart, 10).toLocaleString("en-US");
    let pulse = 0;
    TRADES.forEach((tr) => {
        const dt = time - tr.t;
        if (dt > 0 && dt < 0.5) pulse = Math.max(pulse, Math.sin((dt / 0.5) * Math.PI));
    });
    return (
        <>
            <PanelShield x={x} y={y} w={w} h={h} time={time} intensity={Math.min(1, openT * 1.3)} />
            <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 4, transform: `scale(${1 + pulse * 0.006})` }}>
                <div style={{ width: "100%", height: "100%", background: SURFACE, border: `1px solid ${BORDER_GOLD}`, borderRadius: RADIUS_CARD, boxShadow: SHADOW_FOCUS, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                    <div style={{ position: "absolute", top: 22, left: 24, right: 24, opacity: headerOpacity, display: "flex", alignItems: "center", gap: 12 }}>
                        <AccountIcon size={32} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, fontFamily: FONT_HEADING, letterSpacing: -0.3 }}>Hesabın</div>
                            <div style={{ fontSize: 9, color: GOLD, letterSpacing: "0.14em", fontWeight: 600, fontFamily: FONT_BODY, marginTop: 4, textTransform: "uppercase" }}>Korumalı</div>
                        </div>
                    </div>
                    <div style={{ position: "absolute", top: 110, left: 24, right: 24, opacity: bodyOpacity, fontFamily: FONT_BODY }}>
                        <div style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: "0.14em", fontWeight: 600, fontFamily: FONT_BODY, marginBottom: 8, textTransform: "uppercase" }}>Bakiye</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                            <span style={{ fontSize: 18, color: GOLD, fontWeight: 800, fontFamily: FONT_DISPLAY }}>$</span>
                            <span style={{ fontSize: 38, fontWeight: 800, color: GOLD, fontFamily: FONT_DISPLAY, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5, lineHeight: 1 }}>{intStr}</span>
                            <span style={{ fontSize: 22, fontWeight: 600, color: GOLD, opacity: 0.7, fontFamily: FONT_DISPLAY, fontVariantNumeric: "tabular-nums" }}>.{decPart}</span>
                        </div>
                        {time >= T.SIGNALS_START && (
                            <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: GREEN, fontFamily: FONT_DISPLAY, fontVariantNumeric: "tabular-nums" }}>+${vaultTotal(time).toFixed(2)}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function BotPanel({ time }: { time: number }) {
    if (time < T.PANELS_OPEN) return null;
    const openT = clamp((time - T.PANELS_OPEN) / (T.PANELS_DONE - T.PANELS_OPEN), 0, 1);
    const eased = Easing.easeInOutCubic(openT);
    const disconnectT = clamp((time - T.DISCONNECT) / 0.8, 0, 1);
    const baseOpacity = 1 - disconnectT;
    const iconSize = 72;
    const fromCX = CX + 110;
    const fromCY = CY;
    const fromW = iconSize, fromH = iconSize;
    const w = fromW + (PANEL_W - fromW) * eased;
    const h = fromH + (PANEL_H - fromH) * eased;
    const toCX = BOT_X + PANEL_W / 2;
    const toCY = PANEL_Y + PANEL_H / 2;
    const cx = fromCX + (toCX - fromCX) * eased;
    const cy = fromCY + (toCY - fromCY) * eased;
    const x = cx - w / 2;
    const y = cy - h / 2 + disconnectT * 8;
    const headerOpacity = clamp((openT - 0.6) / 0.4, 0, 1);
    const bodyOpacity = clamp((time - T.PANELS_DONE) / 0.4, 0, 1);
    const recent = TRADES.filter((tr) => time >= tr.t - 0.2 && time < T.DISCONNECT + 0.3).slice(-4);
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: baseOpacity, zIndex: 4, filter: disconnectT > 0 ? `blur(${disconnectT * 2}px)` : "none" }}>
            <div style={{ width: "100%", height: "100%", background: SURFACE, border: `1px solid ${BORDER_GOLD}`, borderRadius: RADIUS_CARD, boxShadow: SHADOW_FOCUS, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                <div style={{ position: "absolute", top: 22, left: 24, right: 24, opacity: headerOpacity, display: "flex", alignItems: "center", gap: 12 }}>
                    <BotIcon size={36} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, fontFamily: FONT_HEADING, letterSpacing: -0.3 }}>RichCase Bot</div>
                        <div style={{ fontSize: 9, color: GOLD, letterSpacing: "0.14em", fontWeight: 600, fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 5, marginTop: 4, textTransform: "uppercase" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                            7 Gün · Bağlı
                        </div>
                    </div>
                </div>
                <div style={{ position: "absolute", top: 100, left: 24, right: 24, opacity: bodyOpacity, display: "flex", flexDirection: "column", gap: 8, fontFamily: FONT_BODY }}>
                    {recent.map((tr) => {
                        const age = time - tr.t;
                        const appear = clamp((age + 0.3) / 0.4, 0, 1);
                        return (
                            <div key={tr.t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.025)", border: `1px solid ${BORDER}`, borderRadius: RADIUS_CARD, opacity: appear, transform: `translateX(${(1 - appear) * -10}px)` }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: FONT_MONO, flex: 1 }}>{tr.pair}</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: GREEN, fontFamily: FONT_DISPLAY, fontVariantNumeric: "tabular-nums" }}>+${tr.pnl.toFixed(2)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function ActiveConnection({ time }: { time: number }) {
    if (time < T.PANELS_DONE - 0.4 || time >= T.DISCONNECT) return null;
    const fadeIn = clamp((time - (T.PANELS_DONE - 0.4)) / 0.4, 0, 1);
    const intensity = fadeIn;
    const fromX = ACC_X + PANEL_W;
    const toX = BOT_X;
    const midY = PANEL_Y + 38;
    return <Connection time={time} fromX={fromX} toX={toX} midY={midY} intensity={intensity} />;
}

function SignalArrows({ time }: { time: number }) {
    if (time < T.SIGNALS_START || time >= T.DISCONNECT) return null;
    const arrows: React.ReactNode[] = [];
    const fromX = BOT_X + 8;
    const toX = ACC_X + PANEL_W - 8;
    const midY = PANEL_Y + 38;
    TRADES.forEach((trade, i) => {
        const dt = time - (trade.t - 0.5);
        if (dt < 0 || dt > 0.6) return;
        const t = dt / 0.6;
        const eased = Easing.easeInOutCubic(t);
        const x = fromX + (toX - fromX) * eased;
        const opacity = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
        arrows.push(
            <div key={i} style={{ position: "absolute", left: x - 14, top: midY - 8, opacity, zIndex: 6, pointerEvents: "none" }}>
                <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                    <path d="M26 8h-18M12 4l-6 4 6 4" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
            </div>,
        );
    });
    return <>{arrows}</>;
}

function VaultIsolationScene() {
    const time = useTime();
    return (
        <>
            <StartingPhase time={time} />
            <AccountPanel time={time} />
            <BotPanel time={time} />
            <ActiveConnection time={time} />
            <SignalArrows time={time} />
            <BrokenConnection time={time} fromX={ACC_X + PANEL_W} toX={BOT_X} midY={PANEL_Y + 38} />
        </>
    );
}

export default function Scene4Vault() {
    return (
        <SceneStage width={STAGE_W} height={STAGE_H} duration={T.END} contentScale={1.2}>
            <VaultIsolationScene />
        </SceneStage>
    );
}
