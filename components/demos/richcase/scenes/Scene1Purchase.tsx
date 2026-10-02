"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- ported verbatim from the original RichCase landing */

import React from "react";
import { Easing, clamp, useTime, SceneStage } from "./_runtime";

// ===== Tokens — site (Pricing) ile birebir =====
const GOLD = "#D4AF37";
const SILVER = "#C0C0C0";
const SURFACE = "#0d0d0d";       // ink-850 (Pricing kart bg)
const BORDER = "#242424";        // ink-600 opak
const BORDER_GOLD = "#D4AF37";   // opak (focused)
const TEXT = "#E8E8E8";
const TEXT_DIM = "#8A8A8A";
const INK_950 = "#0a0a0a";

const SHADOW_DEFAULT = "2px 2px 0 0 rgba(0,0,0,0.6)";
const SHADOW_FOCUS = "4px 4px 0 0 #000";

const RADIUS_CARD = 3;
const RADIUS_PANEL_INTRO = 6;

const FONT_BODY = 'var(--font-body), "Satoshi", system-ui, sans-serif';
const FONT_HEADING = 'var(--font-heading), "Chillax", "Satoshi", system-ui, sans-serif';
const FONT_DISPLAY = 'var(--font-heading), "Chillax", "Satoshi", system-ui, sans-serif';

const STAGE_W = 1280;
const STAGE_H = 720;
const CX = STAGE_W / 2;
const CY = STAGE_H / 2;

// Paketler — accent focused state'den türer (Pricing kuralı: tek altın)
const PACKAGES = [
    { name: "Lite", price: "75" },
    { name: "Pro", price: "110" },
    { name: "Max", price: "150" },
    { name: "Elite", price: "250" },
    { name: "Ultimate", price: "550" },
];

const T = {
    ICON_IN: 0.0,
    ICON_HOLD: 0.6,
    ICON_TO_CARD: 0.8,
    CARD_FORMED: 1.5,
    SIDES_OPEN: 1.5,
    SIDES_DONE: 2.5,
    SCROLL_START: 2.7,
    SCROLL_END: 4.0,
    CURSOR_IN: 3.8,
    CURSOR_CLICK: 4.6,
    CURSOR_OUT: 4.9,
    RIPPLE: 4.6,
    SIDES_DISMISS_START: 5.0,
    SIDES_DISMISS_END: 5.8,
    MAX_TO_CENTER: 5.6,
    MAX_CENTERED: 6.2,
    BOT_MORPH_START: 6.2,
    BOT_FORMED: 7.0,
    BOT_ACTIVE: 7.2,
    END: 10.0,
};

const CARD_W = 240;
const CARD_H = 290;
const CARD_GAP = 22;
const CARD_Y = CY - CARD_H / 2;

function PackageCardInner({ pkg, focused }: { pkg: any; focused: boolean }) {
    const accent = focused ? GOLD : SILVER;
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                padding: "22px 18px",
                display: "flex",
                flexDirection: "column",
                fontFamily: FONT_BODY,
                color: TEXT,
                position: "relative",
            }}
        >
            <div
                style={{
                    fontSize: 10,
                    fontFamily: FONT_BODY,
                    color: accent,
                    fontWeight: 600,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                }}
            >
                Paket
            </div>
            <div
                style={{
                    fontSize: 30,
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    letterSpacing: -0.5,
                    color: focused ? TEXT : "rgba(232,232,232,0.7)",
                    lineHeight: 1,
                }}
            >
                {pkg.name}
            </div>
            <div
                style={{
                    fontSize: 10,
                    color: TEXT_DIM,
                    marginTop: 8,
                    fontFamily: FONT_BODY,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontWeight: 500,
                }}
            >
                Aylık abonelik
            </div>
            <div style={{ flex: 1 }} />
            <div
                style={{
                    height: 1,
                    background: focused ? accent : BORDER,
                    marginBottom: 16,
                }}
            />
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                    style={{
                        fontSize: 14,
                        color: TEXT_DIM,
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 700,
                    }}
                >
                    $
                </span>
                <span
                    style={{
                        fontSize: 36,
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 800,
                        color: focused ? accent : TEXT,
                        letterSpacing: -0.5,
                        lineHeight: 1,
                    }}
                >
                    {pkg.price}
                </span>
                <span
                    style={{
                        fontSize: 10,
                        color: TEXT_DIM,
                        marginLeft: 4,
                        fontFamily: FONT_BODY,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        fontWeight: 500,
                    }}
                >
                    / Ay
                </span>
            </div>
            {focused && (
                <div
                    style={{
                        marginTop: 16,
                        height: 34,
                        background: accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: INK_950,
                        fontWeight: 700,
                        fontFamily: FONT_BODY,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                    }}
                >
                    Satın Al
                </div>
            )}
        </div>
    );
}

function SideCard({
    pkg,
    idx,
    scrollOffset,
    openT,
    dismissT,
}: {
    pkg: any;
    idx: number;
    focusedIdx: number;
    scrollOffset: number;
    openT: number;
    dismissT: number;
}) {
    const slot = idx - scrollOffset;
    const x = CX + slot * (CARD_W + CARD_GAP) - CARD_W / 2;
    const startX = CX - CARD_W / 2;
    const openEased = Easing.easeOutCubic(openT);
    const renderX = startX + (x - startX) * openEased;
    const dir = slot > 0 ? 1 : slot < 0 ? -1 : 0;
    const dismissEased = Easing.easeInCubic(dismissT);
    const dismissDx = dir * 200 * dismissEased;
    const dismissDy = (dir === 0 ? -120 : 0) * dismissEased;
    const finalX = renderX + dismissDx;
    const finalY = CARD_Y + dismissDy;
    const opacity = openT * (1 - dismissT) * 0.92;
    return (
        <div
            style={{
                position: "absolute",
                left: finalX,
                top: finalY,
                width: CARD_W,
                height: CARD_H,
                opacity,
                transform: `scale(0.92)`,
                transformOrigin: "center",
                zIndex: 3,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: RADIUS_CARD,
                    boxShadow: SHADOW_DEFAULT,
                    overflow: "hidden",
                }}
            >
                <PackageCardInner pkg={pkg} focused={false} />
            </div>
        </div>
    );
}

function Cursor({
    time,
    fromX,
    fromY,
    toX,
    toY,
}: {
    time: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}) {
    if (time < T.CURSOR_IN || time > T.CURSOR_OUT) return null;
    const total = T.CURSOR_OUT - T.CURSOR_IN;
    const t = (time - T.CURSOR_IN) / total;
    const approach = clamp(t / 0.55, 0, 1);
    const eased = Easing.easeOutCubic(approach);
    const x = fromX + (toX - fromX) * eased;
    const y = fromY + (toY - fromY) * eased;
    const clickT = clamp((time - T.CURSOR_CLICK) / 0.25, 0, 1);
    const press = clickT > 0 && clickT < 1 ? 1 - Math.sin(clickT * Math.PI) * 0.25 : 1;
    const fadeOut = t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-2px, -2px) scale(${press})`,
                opacity: fadeOut,
                zIndex: 50,
                pointerEvents: "none",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
            }}
        >
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                <path
                    d="M2 2L2 20L7 16L10 23L13 22L10 14L18 14L2 2Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="1"
                />
            </svg>
        </div>
    );
}

function Ripple({
    time,
    start,
    dur,
    x,
    y,
    maxSize = 280,
    color = GOLD,
}: {
    time: number;
    start: number;
    dur: number;
    x: number;
    y: number;
    maxSize?: number;
    color?: string;
}) {
    if (time < start || time > start + dur) return null;
    const t = (time - start) / dur;
    const size = 40 + (maxSize - 40) * Easing.easeOutCubic(t);
    const opacity = (1 - t) * 0.6;
    return (
        <div
            style={{
                position: "absolute",
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1.5px solid ${color}`,
                opacity,
                zIndex: 4,
                pointerEvents: "none",
            }}
        />
    );
}

function BotCardInner({ time }: { time: number }) {
    const active = time >= T.BOT_ACTIVE;
    const activeT = active ? clamp((time - T.BOT_ACTIVE) / 0.6, 0, 1) : 0;
    const pulseT = active ? (Math.sin((time - T.BOT_ACTIVE) * 2.4) + 1) / 2 : 0;
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                padding: "22px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontFamily: FONT_BODY,
                color: TEXT,
                position: "relative",
            }}
        >
            <div style={{ position: "relative", width: 110, height: 110, marginTop: 14 }}>
                <img
                    src="/demos/richcase/rc-700x700.png"
                    alt="RC"
                    width={110}
                    height={110}
                    style={{
                        position: "relative",
                        width: 110,
                        height: 110,
                        objectFit: "contain",
                        filter: active
                            ? `drop-shadow(0 0 ${6 + pulseT * 4}px rgba(212,175,55,0.4))`
                            : "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
                    }}
                />
            </div>
            <div
                style={{
                    fontSize: 10,
                    fontFamily: FONT_BODY,
                    color: TEXT_DIM,
                    marginTop: 22,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontWeight: 600,
                }}
            >
                Trading Bot
            </div>
            <div style={{ flex: 1 }} />
            <div
                style={{
                    marginBottom: 4,
                    height: 34,
                    paddingLeft: 16,
                    paddingRight: 16,
                    background: GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontSize: 11,
                    color: INK_950,
                    fontWeight: 700,
                    fontFamily: FONT_BODY,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    opacity: activeT,
                }}
            >
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: INK_950,
                        opacity: 0.55 + pulseT * 0.45,
                    }}
                />
                Bot aktif
            </div>
        </div>
    );
}

function ScrollDots({ time, focusedIdx }: { time: number; focusedIdx: number }) {
    if (time < T.SIDES_DONE - 0.2 || time >= T.SIDES_DISMISS_START) return null;
    const fadeIn = clamp((time - (T.SIDES_DONE - 0.2)) / 0.4, 0, 1);
    const fadeOut =
        time > T.SIDES_DISMISS_START - 0.4
            ? 1 - clamp((time - (T.SIDES_DISMISS_START - 0.4)) / 0.4, 0, 1)
            : 1;
    return (
        <div
            style={{
                position: "absolute",
                left: CX - 60,
                top: CARD_Y + CARD_H + 28,
                width: 120,
                display: "flex",
                justifyContent: "center",
                gap: 8,
                opacity: fadeIn * fadeOut,
                zIndex: 4,
            }}
        >
            {PACKAGES.map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: i === focusedIdx ? 16 : 5,
                        height: 5,
                        borderRadius: 0,
                        background: i === focusedIdx ? GOLD : "rgba(255,255,255,0.22)",
                        transition: "width 0.3s",
                    }}
                />
            ))}
        </div>
    );
}

function MorphCard({ time }: { time: number }) {
    let scrollOffset = 1,
        focusedIdx = 1;
    if (time >= T.SCROLL_START && time < T.SCROLL_END) {
        const sT = (time - T.SCROLL_START) / (T.SCROLL_END - T.SCROLL_START);
        const eased = Easing.easeInOutCubic(sT);
        scrollOffset = 1 + eased * 1;
        if (sT > 0.5) focusedIdx = 2;
    } else if (time >= T.SCROLL_END) {
        scrollOffset = 2;
        focusedIdx = 2;
    }

    if (time < T.ICON_TO_CARD) {
        const entryT = clamp(time / 0.5, 0, 1);
        const opacity = entryT;
        const scale = 0.75 + Easing.easeOutCubic(entryT) * 0.25;
        const breathe = 1 + Math.sin(time * 1.8) * 0.02;
        const finalScale = scale * breathe;
        const size = 120;
        return (
            <div
                style={{
                    position: "absolute",
                    left: CX - size / 2,
                    top: CY - size / 2,
                    width: size,
                    height: size,
                    opacity,
                    transform: `scale(${finalScale})`,
                    transformOrigin: "center",
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: SURFACE,
                        border: `1px solid ${BORDER_GOLD}`,
                        borderRadius: RADIUS_PANEL_INTRO,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: SHADOW_FOCUS,
                    }}
                >
                    <svg width="50" height="50" viewBox="0 0 44 44" fill="none">
                        <path
                            d="M22 6L36 12V32L22 38L8 32V12L22 6Z"
                            stroke={GOLD}
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8 12L22 18L36 12"
                            stroke={GOLD}
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                        />
                        <path d="M22 18V38" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        );
    }

    if (time < T.CARD_FORMED) {
        const morphT = clamp(
            (time - T.ICON_TO_CARD) / (T.CARD_FORMED - T.ICON_TO_CARD),
            0,
            1,
        );
        const eased = Easing.easeInOutCubic(morphT);
        const fromW = 120,
            fromH = 120;
        const w = fromW + (CARD_W - fromW) * eased;
        const h = fromH + (CARD_H - fromH) * eased;
        const radius = RADIUS_PANEL_INTRO + (RADIUS_CARD - RADIUS_PANEL_INTRO) * eased;
        const iconOpacity = 1 - clamp(morphT * 1.6, 0, 1);
        const cardOpacity = clamp((morphT - 0.45) * 1.8, 0, 1);
        return (
            <div
                style={{
                    position: "absolute",
                    left: CX - w / 2,
                    top: CY - h / 2,
                    width: w,
                    height: h,
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: SURFACE,
                        border: `1px solid ${BORDER_GOLD}`,
                        borderRadius: radius,
                        boxShadow: SHADOW_FOCUS,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: iconOpacity,
                            pointerEvents: "none",
                        }}
                    >
                        <svg width="50" height="50" viewBox="0 0 44 44" fill="none">
                            <path
                                d="M22 6L36 12V32L22 38L8 32V12L22 6Z"
                                stroke={GOLD}
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8 12L22 18L36 12"
                                stroke={GOLD}
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22 18V38"
                                stroke={GOLD}
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div style={{ position: "absolute", inset: 0, opacity: cardOpacity }}>
                        <PackageCardInner pkg={PACKAGES[1]} focused={true} />
                    </div>
                </div>
            </div>
        );
    }

    if (time < T.MAX_TO_CENTER) {
        const slot = focusedIdx - scrollOffset;
        const x = CX + slot * (CARD_W + CARD_GAP) - CARD_W / 2;
        const clickT = clamp((time - T.CURSOR_CLICK) / 0.3, 0, 1);
        const press = clickT > 0 && clickT < 1 ? 1 - Math.sin(clickT * Math.PI) * 0.06 : 1;
        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: CARD_Y,
                    width: CARD_W,
                    height: CARD_H,
                    transform: `scale(${press})`,
                    transformOrigin: "center",
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: SURFACE,
                        border: `1px solid ${BORDER_GOLD}`,
                        borderRadius: RADIUS_CARD,
                        boxShadow: SHADOW_FOCUS,
                        overflow: "hidden",
                    }}
                >
                    <PackageCardInner pkg={PACKAGES[focusedIdx]} focused={true} />
                </div>
            </div>
        );
    }

    if (time < T.BOT_FORMED) {
        const slideT = clamp((time - T.MAX_TO_CENTER) / (T.MAX_CENTERED - T.MAX_TO_CENTER), 0, 1);
        const slideEased = Easing.easeInOutCubic(slideT);
        const slot = focusedIdx - scrollOffset;
        const fromX = CX + slot * (CARD_W + CARD_GAP) - CARD_W / 2;
        const toX = CX - CARD_W / 2;
        const x = fromX + (toX - fromX) * slideEased;
        const morphT = clamp(
            (time - T.BOT_MORPH_START) / (T.BOT_FORMED - T.BOT_MORPH_START),
            0,
            1,
        );
        const cardOpacity = 1 - morphT;
        const botOpacity = morphT;
        return (
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: CARD_Y,
                    width: CARD_W,
                    height: CARD_H,
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: SURFACE,
                        border: `1px solid ${BORDER_GOLD}`,
                        borderRadius: RADIUS_CARD,
                        boxShadow: SHADOW_FOCUS,
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <div style={{ position: "absolute", inset: 0, opacity: cardOpacity }}>
                        <PackageCardInner pkg={PACKAGES[2]} focused={true} />
                    </div>
                    <div style={{ position: "absolute", inset: 0, opacity: botOpacity }}>
                        <BotCardInner time={time} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                position: "absolute",
                left: CX - CARD_W / 2,
                top: CARD_Y,
                width: CARD_W,
                height: CARD_H,
                zIndex: 5,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: SURFACE,
                    border: `1px solid ${BORDER_GOLD}`,
                    borderRadius: RADIUS_CARD,
                    boxShadow: SHADOW_FOCUS,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <BotCardInner time={time} />
            </div>
        </div>
    );
}

function PurchaseScene() {
    const time = useTime();

    let scrollOffset = 1,
        focusedIdx = 1;
    if (time >= T.SCROLL_START && time < T.SCROLL_END) {
        const sT = (time - T.SCROLL_START) / (T.SCROLL_END - T.SCROLL_START);
        const eased = Easing.easeInOutCubic(sT);
        scrollOffset = 1 + eased * 1;
        if (sT > 0.5) focusedIdx = 2;
    } else if (time >= T.SCROLL_END) {
        scrollOffset = 2;
        focusedIdx = 2;
    }

    const sideCards: React.ReactNode[] = [];
    if (time >= T.SIDES_OPEN && time < T.SIDES_DISMISS_END + 0.2) {
        PACKAGES.forEach((pkg, idx) => {
            if (idx === focusedIdx) return;
            const distFromCenter = Math.abs(idx - 1);
            const stagger = (distFromCenter - 1) * 0.1;
            const openStart = T.SIDES_OPEN + stagger;
            const openT = clamp((time - openStart) / 0.6, 0, 1);
            const dismissT =
                time >= T.SIDES_DISMISS_START
                    ? clamp(
                          (time - T.SIDES_DISMISS_START - distFromCenter * 0.05) /
                              (T.SIDES_DISMISS_END - T.SIDES_DISMISS_START),
                          0,
                          1,
                      )
                    : 0;
            sideCards.push(
                <SideCard
                    key={pkg.name}
                    pkg={pkg}
                    idx={idx}
                    focusedIdx={focusedIdx}
                    scrollOffset={scrollOffset}
                    openT={openT}
                    dismissT={dismissT}
                />,
            );
        });
    }

    const focusedSlot = focusedIdx - scrollOffset;
    const focusedX = CX + focusedSlot * (CARD_W + CARD_GAP);
    const focusedClickX = focusedX + 20;
    const focusedClickY = CARD_Y + CARD_H - 30;

    return (
        <>
            {sideCards}
            <ScrollDots time={time} focusedIdx={Math.round(focusedIdx)} />
            <MorphCard time={time} />
            <Cursor
                time={time}
                fromX={CX + 280}
                fromY={CY + 220}
                toX={focusedClickX}
                toY={focusedClickY}
            />
            <Ripple time={time} start={T.RIPPLE} dur={0.9} x={focusedX} y={focusedClickY} maxSize={300} />
            <Ripple time={time} start={T.BOT_ACTIVE} dur={1.2} x={CX} y={CY} maxSize={380} color={GOLD} />
        </>
    );
}

export default function Scene1Purchase() {
    return (
        <SceneStage width={STAGE_W} height={STAGE_H} duration={T.END} contentScale={1.0}>
            <PurchaseScene />
        </SceneStage>
    );
}
