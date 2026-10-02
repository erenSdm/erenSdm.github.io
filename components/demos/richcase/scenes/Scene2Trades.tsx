"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- ported verbatim from the original RichCase landing */

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
const RED = "#EF4444";

const SHADOW_DEFAULT = "2px 2px 0 0 rgba(0,0,0,0.6)";
const SHADOW_FOCUS = "4px 4px 0 0 #000";

const RADIUS_CARD = 3;

const FONT_BODY = 'var(--font-body), "Satoshi", system-ui, sans-serif';
const FONT_HEADING = 'var(--font-heading), "Chillax", "Satoshi", system-ui, sans-serif';
const FONT_MONO = 'var(--font-body)';
const FONT_DISPLAY = 'var(--font-heading), "Chillax", "Satoshi", system-ui, sans-serif';

const STAGE_W = 1280;
const STAGE_H = 720;
const CX = STAGE_W / 2;
const CY = STAGE_H / 2;

const PANEL_W = 460;
const PANEL_H = 360;
const PANEL_X = CX - PANEL_W / 2 + 40;
const PANEL_Y = CY - PANEL_H / 2 - 10;

const VAULT_W = 220;
const VAULT_X = PANEL_X + PANEL_W + 28;
const VAULT_Y = CY - 90;

const TRADES = [
    { pair: "BTC/USDT", side: "LONG", entry: "64,210", exit: "65,180", pnl: 124.50, openAt: 2.5, closeAt: 5.5 },
    { pair: "ETH/USDT", side: "SHORT", entry: "3,240", exit: "3,198", pnl: 87.20, openAt: 3.1, closeAt: 6.3 },
    { pair: "SOL/USDT", side: "LONG", entry: "148.20", exit: "152.40", pnl: 52.10, openAt: 3.7, closeAt: 7.1 },
    { pair: "BNB/USDT", side: "LONG", entry: "612.40", exit: "619.00", pnl: 38.80, openAt: 4.3, closeAt: 7.7 },
];

const T = { LOGOS_IN: 0, CONNECT_PULSE: 0.4, MERGE_START: 1.5, PANEL_FORMED: 2.5, END: 12.5 };

function BotLogo({ size = 64 }: { size?: number }) {
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

function ExchangeLogo({ size = 64 }: { size?: number }) {
    return (
        <div style={{ width: size, height: size, borderRadius: RADIUS_CARD, background: SURFACE, border: `1px solid ${BORDER_GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SHADOW_DEFAULT }}>
            <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 36 36" fill="none">
                <path d="M18 4L24 10L18 16L12 10L18 4Z" fill={GOLD} />
                <path d="M8 14L14 20L8 26L2 20L8 14Z" fill={GOLD} />
                <path d="M28 14L34 20L28 26L22 20L28 14Z" fill={GOLD} />
                <path d="M18 24L24 30L18 36L12 30L18 24Z" fill={GOLD} />
                <circle cx="18" cy="20" r="3" fill={SILVER} />
            </svg>
        </div>
    );
}

function ConnectionLine({ time }: { time: number }) {
    const visible = time >= T.CONNECT_PULSE && time < T.MERGE_START;
    if (!visible) return null;
    const t = clamp((time - T.CONNECT_PULSE) / 0.5, 0, 1);
    const drawT = Easing.easeOutCubic(t);
    const fadeT = clamp((time - T.MERGE_START + 0.2) / 0.2, 0, 1);
    const opacity = drawT * (1 - fadeT);
    const pulseOffset = ((time - T.CONNECT_PULSE) % 1.0) / 1.0;
    const lineW = 100;
    const lineY = CY - 30;
    const lineX = CX - lineW / 2;
    return (
        <div style={{ position: "absolute", left: lineX, top: lineY - 1, width: lineW * drawT, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity }}>
            <div style={{ position: "absolute", left: pulseOffset * lineW * drawT - 4, top: -2, width: 8, height: 6, borderRadius: "50%", background: GOLD }} />
        </div>
    );
}

function LogosToPanel({ time }: { time: number }) {
    if (time >= T.PANEL_FORMED + 0.1) return null;
    const logoSize = 84;
    const apartGap = 110;
    const fromBotX = CX - apartGap / 2 - logoSize;
    const fromExX = CX + apartGap / 2;
    const fromY = CY - 30 - logoSize / 2;
    const headerLogoSize = 28;
    const toBotX = PANEL_X + 22;
    const toExX = PANEL_X + 22 + headerLogoSize - 8;
    const toY = PANEL_Y + 20;

    if (time < T.MERGE_START) {
        const entryT = clamp(time / 0.6, 0, 1);
        const opacity = entryT;
        const scale = 0.7 + Easing.easeOutCubic(entryT) * 0.3;
        return (
            <>
                <div style={{ position: "absolute", left: fromBotX, top: fromY, opacity, transform: `scale(${scale})`, transformOrigin: "center" }}><BotLogo size={logoSize} /></div>
                <div style={{ position: "absolute", left: fromExX, top: fromY, opacity, transform: `scale(${scale})`, transformOrigin: "center" }}><ExchangeLogo size={logoSize} /></div>
            </>
        );
    }

    const mergeT = clamp((time - T.MERGE_START) / (T.PANEL_FORMED - T.MERGE_START), 0, 1);
    const eased = Easing.easeInOutCubic(mergeT);
    const botX = fromBotX + (toBotX - fromBotX) * eased;
    const exX = fromExX + (toExX - fromExX) * eased;
    const y = fromY + (toY - fromY) * eased;
    const size = logoSize + (headerLogoSize - logoSize) * eased;
    const opacity = 1 - clamp((mergeT - 0.85) / 0.15, 0, 1) * 0.6;
    return (
        <>
            <div style={{ position: "absolute", left: botX, top: y, opacity, zIndex: 10 }}><BotLogo size={size} /></div>
            <div style={{ position: "absolute", left: exX, top: y, opacity, zIndex: 9 }}><ExchangeLogo size={size} /></div>
        </>
    );
}

function TradeRow({ trade, index, time }: { trade: any; index: number; time: number }) {
    const appearT = clamp((time - trade.openAt) / 0.5, 0, 1);
    if (appearT <= 0) return null;
    const eased = Easing.easeOutCubic(appearT);
    const ty = (1 - eased) * 12;
    const opacity = eased;
    const closingT = clamp((time - (trade.closeAt - 0.4)) / 0.4, 0, 1);
    const closed = time >= trade.closeAt;
    const closingPhase = !closed && closingT > 0;
    const openProgress = clamp((time - trade.openAt) / Math.max(0.5, trade.closeAt - trade.openAt), 0, 1);
    const pnlEased = Easing.easeOutQuad(openProgress);
    let pnlValue: number;
    if (closed) pnlValue = trade.pnl;
    else pnlValue = trade.pnl * pnlEased * (0.6 + Math.sin(time * 4 + index) * 0.05);
    const sideColor = trade.side === "LONG" ? GREEN : RED;
    const sideBg = trade.side === "LONG" ? "rgba(74, 222, 128, 0.12)" : "rgba(239, 68, 68, 0.12)";
    const closeFlashT = clamp((time - trade.closeAt) / 0.6, 0, 1);
    const flash = closeFlashT > 0 && closeFlashT < 1 ? (1 - closeFlashT) * 0.3 : 0;
    const rowH = 40;
    const y = index * (rowH + 6) + ty;

    return (
        <div style={{ position: "absolute", left: 0, top: y, right: 0, height: rowH, opacity }}>
            <div style={{ width: "100%", height: "100%", background: `rgba(255,255,255,${0.02 + flash * 0.5})`, border: `1px solid ${closed ? "rgba(74,222,128,0.30)" : BORDER}`, borderRadius: RADIUS_CARD, padding: "0 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 130 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: FONT_MONO }}>{trade.pair}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: sideColor, background: sideBg, padding: "2px 7px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT_BODY }}>{trade.side}</span>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: TEXT_DIM, fontFamily: FONT_BODY, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>
                    {closed ? (
                        <>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <circle cx="5" cy="5" r="4" fill={GREEN} />
                                <path d="M3 5l1.5 1.5L7 4" stroke={INK_950} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span style={{ color: GREEN }}>Kapandı</span>
                        </>
                    ) : closingPhase ? (
                        <>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                            <span style={{ color: GOLD }}>Kapanıyor</span>
                        </>
                    ) : (
                        <>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
                            <span>Açık</span>
                        </>
                    )}
                </div>
                <div style={{ width: 80, textAlign: "right", fontSize: 13, fontWeight: 800, color: closed ? GREEN : closingPhase ? GOLD : TEXT, fontFamily: FONT_DISPLAY, fontVariantNumeric: "tabular-nums" }}>+${pnlValue.toFixed(2)}</div>
            </div>
        </div>
    );
}

function Panel({ time }: { time: number }) {
    if (time < T.MERGE_START) return null;
    const mergeT = clamp((time - T.MERGE_START) / (T.PANEL_FORMED - T.MERGE_START), 0, 1);
    const eased = Easing.easeInOutCubic(mergeT);
    const fromW = 90, fromH = 70;
    const w = fromW + (PANEL_W - fromW) * eased;
    const h = fromH + (PANEL_H - fromH) * eased;
    const fromCX = CX, fromCY = CY - 30;
    const toCX = PANEL_X + PANEL_W / 2;
    const toCY = PANEL_Y + PANEL_H / 2;
    const cx = fromCX + (toCX - fromCX) * eased;
    const cy = fromCY + (toCY - fromCY) * eased;
    const x = cx - w / 2;
    const y = cy - h / 2;
    const headerOpacity = clamp((mergeT - 0.6) / 0.4, 0, 1);
    const bodyOpacity = clamp((time - T.PANEL_FORMED) / 0.4, 0, 1);

    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 4 }}>
            <div style={{ width: "100%", height: "100%", background: SURFACE, border: `1px solid ${BORDER_GOLD}`, borderRadius: RADIUS_CARD, boxShadow: SHADOW_FOCUS, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                <div style={{ position: "absolute", top: 18, left: 22, right: 22, opacity: headerOpacity, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: -6, zIndex: 2 }}><BotLogo size={28} /></div>
                        <div><ExchangeLogo size={28} /></div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, fontFamily: FONT_HEADING, letterSpacing: -0.3 }}>Trading Bot · Binance</div>
                        <div style={{ fontSize: 9, color: GOLD, letterSpacing: "0.14em", fontWeight: 600, fontFamily: FONT_BODY, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                            Çalışıyor
                        </div>
                    </div>
                </div>
                <div style={{ position: "absolute", top: 76, left: 22, right: 22, height: 1, background: BORDER, opacity: bodyOpacity }} />
                <div style={{ position: "absolute", top: 90, left: 22, right: 22, opacity: bodyOpacity, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 9, color: TEXT_DIM, letterSpacing: "0.14em", fontWeight: 600, fontFamily: FONT_BODY, textTransform: "uppercase" }}>
                    <span>İşlem</span>
                    <span>Durum</span>
                    <span style={{ width: 70, textAlign: "right" }}>P&L</span>
                </div>
                <div style={{ position: "absolute", top: 116, left: 22, right: 22, opacity: bodyOpacity }}>
                    {TRADES.map((trade, i) => <TradeRow key={i} trade={trade} index={i} time={time} />)}
                </div>
            </div>
        </div>
    );
}

function Vault({ time }: { time: number }) {
    let total = 0;
    TRADES.forEach((trade) => {
        if (time >= trade.closeAt) {
            const addT = clamp((time - trade.closeAt) / 0.6, 0, 1);
            total += trade.pnl * Easing.easeOutCubic(addT);
        }
    });
    const vaultOpacity = clamp((time - T.PANEL_FORMED - 0.2) / 0.5, 0, 1);
    let pulse = 0;
    TRADES.forEach((trade) => {
        const dt = time - trade.closeAt;
        if (dt > 0 && dt < 0.6) pulse = Math.max(pulse, Math.sin((dt / 0.6) * Math.PI));
    });
    const totalProgress = total / TRADES.reduce((s, t) => s + t.pnl, 0);

    return (
        <div style={{ position: "absolute", left: VAULT_X, top: VAULT_Y, width: VAULT_W, opacity: vaultOpacity, zIndex: 4 }}>
            <div style={{ position: "relative", background: SURFACE, border: `1px solid ${BORDER_GOLD}`, borderRadius: RADIUS_CARD, padding: "20px 18px 22px", boxShadow: SHADOW_FOCUS, overflow: "hidden", transform: `scale(${1 + pulse * 0.02})`, transformOrigin: "center" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: RADIUS_CARD, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke={INK_950} strokeWidth="1.4" />
                            <circle cx="10" cy="8" r="1.8" stroke={INK_950} strokeWidth="1.2" />
                            <path d="M10 6V8" stroke={INK_950} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M4 11.5h2" stroke={INK_950} strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: 16, color: TEXT, letterSpacing: -0.3, fontWeight: 800, fontFamily: FONT_HEADING }}>Kasa</div>
                        <div style={{ fontSize: 9, color: TEXT_DIM, marginTop: 4, fontFamily: FONT_BODY, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Toplam kazanç</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
                    <span style={{ fontSize: 14, color: GOLD, fontWeight: 700, fontFamily: FONT_DISPLAY }}>$</span>
                    <span style={{ fontSize: 36, fontWeight: 800, color: GOLD, fontFamily: FONT_DISPLAY, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>{total.toFixed(2)}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ height: "100%", width: `${totalProgress * 100}%`, background: GOLD }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 9, color: TEXT_DIM, fontFamily: FONT_BODY, letterSpacing: "0.14em", fontWeight: 600, textTransform: "uppercase" }}>
                    <span>Kapanan</span>
                    <span style={{ color: TEXT, fontWeight: 800, fontFamily: FONT_DISPLAY, letterSpacing: 0 }}>{TRADES.filter((t) => time >= t.closeAt).length} / {TRADES.length}</span>
                </div>
            </div>
        </div>
    );
}

function ProfitParticles({ time }: { time: number }) {
    const particles: React.ReactNode[] = [];
    TRADES.forEach((trade, i) => {
        const dt = time - trade.closeAt;
        if (dt < 0 || dt > 0.7) return;
        const t = dt / 0.7;
        const eased = Easing.easeInOutCubic(t);
        const rowH = 40;
        const fromX = PANEL_X + PANEL_W - 40;
        const fromY = PANEL_Y + 116 + i * (rowH + 6) + rowH / 2;
        const toX = VAULT_X + 60;
        const toY = VAULT_Y + 108;
        const cx2 = (fromX + toX) / 2;
        const cy2 = Math.min(fromY, toY) - 60;
        const px = (1 - eased) * (1 - eased) * fromX + 2 * (1 - eased) * eased * cx2 + eased * eased * toX;
        const py = (1 - eased) * (1 - eased) * fromY + 2 * (1 - eased) * eased * cy2 + eased * eased * toY;
        const opacity = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;
        const scale = 1 - t * 0.3;
        particles.push(
            <div key={i} style={{ position: "absolute", left: px - 12, top: py - 12, width: 24, height: 24, opacity, transform: `scale(${scale})`, zIndex: 8, pointerEvents: "none" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: INK_950, fontFamily: FONT_DISPLAY }}>$</div>
            </div>,
        );
    });
    return <>{particles}</>;
}

function TradePanelScene() {
    const time = useTime();
    return (
        <>
            <LogosToPanel time={time} />
            <ConnectionLine time={time} />
            <Panel time={time} />
            <Vault time={time} />
            <ProfitParticles time={time} />
        </>
    );
}

export default function Scene2Trades() {
    return (
        <SceneStage width={STAGE_W} height={STAGE_H} duration={T.END} contentScale={1.28}>
            <TradePanelScene />
        </SceneStage>
    );
}
