"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- ported verbatim from the original RichCase landing */

import React from "react";
import { Easing, clamp, lerp, useTime, SceneStage } from "./_runtime";

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
const CENTER_X = CX;
const CENTER_Y = CY;

const ICON_SIZE = 88;
const NOTIF_W = 380;
const NOTIF_H = 92;
const CHAT_W = 440;
const CHAT_H = 480;

const T4 = {
    ICON: 0,
    MORPH_TO_NOTIF: 1.0,
    NOTIF_FORMED: 2.0,
    CLICK: 3.2,
    MORPH_TO_CHAT: 3.7,
    CHAT_FORMED: 4.9,
    MSG1: 5.1,
    MSG2: 6.6,
    MSG3: 8.1,
    USER_Q: 9.6,
    BOT_A: 11.1,
    END: 14.4,
};

function PlaneGlyph({ size, color = GOLD }: { size: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <path d="M6 15.5L26 7L22 24L15.5 19.5L12 23V18L23 10L11 17L6 15.5Z" fill={color} />
        </svg>
    );
}

function RCAvatar({ size, rounded = "50%" }: { size: number; rounded?: number | string }) {
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
                borderRadius: rounded,
                filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.4))`,
            }}
        />
    );
}

function TypingIndicator({ time, startTime }: { time: number; startTime: number }) {
    const t = (time - startTime) * 1.4;
    return (
        <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: "14px 14px 14px 4px", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
            {[0, 1, 2].map((i) => {
                const phase = (t * Math.PI * 2 - i * 0.5) % (Math.PI * 2);
                const y = Math.max(0, Math.sin(phase)) * -3;
                const op = 0.4 + Math.max(0, Math.sin(phase)) * 0.6;
                return <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, opacity: op, transform: `translateY(${y}px)` }} />;
            })}
        </div>
    );
}

function MessageBubble({ msg }: { msg: any }) {
    if (msg.type === "text") {
        return (
            <div style={{ background: GOLD, color: INK_950, padding: "10px 14px", borderRadius: "14px 14px 4px 14px", fontSize: 13, fontWeight: 600, lineHeight: 1.4, fontFamily: FONT_BODY }}>
                {msg.data.text}
                <div style={{ fontSize: 9, color: "rgba(10,10,10,0.6)", textAlign: "right", marginTop: 3, fontFamily: FONT_MONO, fontWeight: 600 }}>09:42</div>
            </div>
        );
    }

    if (msg.type === "trade-open") {
        return (
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: "14px 14px 14px 4px", padding: "10px 14px", minWidth: 220, color: TEXT, fontSize: 13, fontFamily: FONT_BODY }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: GREEN, fontWeight: 700, marginBottom: 8, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: FONT_BODY }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
                    Yeni işlem
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT_MONO, color: TEXT }}>{msg.data.pair}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: msg.data.side === "LONG" ? GREEN : RED, background: msg.data.side === "LONG" ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)", padding: "3px 8px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT_BODY }}>{msg.data.side}</div>
                </div>
                <div style={{ fontSize: 11, color: TEXT_DIM, fontFamily: FONT_MONO, display: "flex", justifyContent: "space-between" }}>
                    <span>Giriş: ${msg.data.entry}</span>
                    <span style={{ color: GOLD }}>Boyut: {msg.data.size}</span>
                </div>
                <div style={{ fontSize: 9, color: TEXT_DIM, textAlign: "right", marginTop: 4, fontFamily: FONT_MONO }}>09:41</div>
            </div>
        );
    }

    if (msg.type === "trade-close") {
        return (
            <div style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.40)", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", minWidth: 220, color: TEXT, fontFamily: FONT_BODY }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: GREEN, fontWeight: 700, marginBottom: 8, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: FONT_BODY }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="5" cy="5" r="4" fill={GREEN} />
                        <path d="M3 5l1.5 1.5L7 4" stroke={INK_950} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    İşlem kapandı
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: FONT_MONO }}>{msg.data.pair}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: GREEN, fontFamily: FONT_DISPLAY, letterSpacing: -0.3 }}>+${msg.data.pnl.toFixed(2)}</div>
                </div>
                <div style={{ fontSize: 11, color: GREEN, marginTop: 4, fontWeight: 700, fontFamily: FONT_DISPLAY, textAlign: "right" }}>▲ +%{msg.data.pct.toFixed(1)}</div>
                <div style={{ fontSize: 9, color: TEXT_DIM, textAlign: "right", marginTop: 4, fontFamily: FONT_MONO }}>09:41</div>
            </div>
        );
    }

    if (msg.type === "vault-answer") {
        return (
            <div style={{ background: "rgba(212,175,55,0.10)", border: `1px solid ${BORDER_GOLD}`, borderRadius: "14px 14px 14px 4px", padding: "12px 14px", minWidth: 240, color: TEXT, fontFamily: FONT_BODY }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: GOLD, fontWeight: 700, marginBottom: 8, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: FONT_BODY }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="3" width="12" height="10" rx="1.5" stroke={GOLD} strokeWidth="1.4" />
                        <circle cx="10" cy="8" r="1.8" stroke={GOLD} strokeWidth="1.2" />
                    </svg>
                    Kasa durumu
                </div>
                <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 6 }}>Bu haftaki toplam kazancın:</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: GOLD, fontFamily: FONT_DISPLAY, letterSpacing: -0.5, lineHeight: 1.1 }}>${msg.data.total.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 6 }}>Bot çalışmaya devam ediyor.</div>
                <div style={{ fontSize: 9, color: TEXT_DIM, textAlign: "right", marginTop: 4, fontFamily: FONT_MONO }}>09:42</div>
            </div>
        );
    }

    return null;
}

function ChatMessage({ msg, time }: { msg: any; time: number }) {
    const typingDuration = msg.hasTyping ? 0.5 : 0;
    const typingStart = msg.time;
    const bubbleStart = msg.time + typingDuration;
    const showTyping = msg.hasTyping && time >= typingStart && time < bubbleStart;
    const showBubble = time >= bubbleStart;
    if (!showTyping && !showBubble) return null;
    const isBot = msg.side === "bot";
    if (showTyping) {
        return (
            <div style={{ alignSelf: isBot ? "flex-start" : "flex-end" }}>
                <TypingIndicator time={time} startTime={typingStart} />
            </div>
        );
    }
    const bubbleT = clamp((time - bubbleStart) / 0.3, 0, 1);
    const eased = Easing.easeOutCubic(bubbleT);
    const opacity = eased;
    const scale = 0.88 + eased * 0.12;
    return (
        <div style={{ alignSelf: isBot ? "flex-start" : "flex-end", maxWidth: "85%", opacity, transform: `scale(${scale})`, transformOrigin: isBot ? "left bottom" : "right bottom" }}>
            <MessageBubble msg={msg} />
        </div>
    );
}

function ChatHeader({ opacity }: { opacity: number }) {
    return (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 12, opacity, background: SURFACE, fontFamily: FONT_BODY }}>
            <RCAvatar size={36} rounded="50%" />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, fontFamily: FONT_HEADING, letterSpacing: -0.3 }}>RichCase Bot</div>
                <div style={{ fontSize: 9, color: GREEN, marginTop: 4, display: "flex", alignItems: "center", gap: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: FONT_BODY }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: GREEN }} />
                    Çevrimiçi
                </div>
            </div>
        </div>
    );
}

function ChatBody({ time, opacity }: { time: number; opacity: number }) {
    const messages = [
        { side: "bot", time: T4.MSG1, type: "trade-open", data: { pair: "BTC/USDT", side: "LONG", entry: "64,210", size: "$30" }, hasTyping: false },
        { side: "bot", time: T4.MSG2, type: "trade-close", data: { pair: "BTC/USDT", pnl: 124.50, pct: 2.4 }, hasTyping: true },
        { side: "bot", time: T4.MSG3, type: "trade-open", data: { pair: "ETH/USDT", side: "SHORT", entry: "3,240", size: "$30" }, hasTyping: true },
        { side: "user", time: T4.USER_Q, type: "text", data: { text: "Kasam ne kadar?" } },
        { side: "bot", time: T4.BOT_A, type: "vault-answer", data: { total: 263.80 }, hasTyping: true },
    ];
    return (
        <>
            <div style={{ position: "absolute", top: 60, left: 0, right: 0, bottom: 56, opacity, overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 8, left: 14, right: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {messages.map((msg, i) => <ChatMessage key={i} msg={msg} time={time} />)}
                </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, background: SURFACE, opacity, fontFamily: FONT_BODY }}>
                <div style={{ flex: 1, height: 36, borderRadius: RADIUS_CARD, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 12, color: TEXT_DIM }}>Mesaj yaz…</div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PlaneGlyph size={16} color={INK_950} />
                </div>
            </div>
        </>
    );
}

function MorphElement({ time }: { time: number }) {
    const iconRect = { w: ICON_SIZE, h: ICON_SIZE, cx: CENTER_X, cy: CENTER_Y, radius: RADIUS_PANEL_INTRO };
    const notifRect = { w: NOTIF_W, h: NOTIF_H, cx: CENTER_X, cy: CENTER_Y, radius: RADIUS_CARD };
    const chatRect = { w: CHAT_W, h: CHAT_H, cx: CENTER_X, cy: CENTER_Y, radius: RADIUS_CARD };

    let rect = iconRect;
    let phase: "icon" | "icon-to-notif" | "notif" | "notif-to-chat" | "chat" = "icon";

    if (time < T4.MORPH_TO_NOTIF) {
        rect = iconRect; phase = "icon";
    } else if (time < T4.NOTIF_FORMED) {
        const t = clamp((time - T4.MORPH_TO_NOTIF) / (T4.NOTIF_FORMED - T4.MORPH_TO_NOTIF), 0, 1);
        const e = Easing.easeInOutCubic(t);
        rect = { w: lerp(iconRect.w, notifRect.w, e), h: lerp(iconRect.h, notifRect.h, e), cx: lerp(iconRect.cx, notifRect.cx, e), cy: lerp(iconRect.cy, notifRect.cy, e), radius: lerp(iconRect.radius, notifRect.radius, e) };
        phase = "icon-to-notif";
    } else if (time < T4.MORPH_TO_CHAT) {
        rect = notifRect; phase = "notif";
    } else if (time < T4.CHAT_FORMED) {
        const t = clamp((time - T4.MORPH_TO_CHAT) / (T4.CHAT_FORMED - T4.MORPH_TO_CHAT), 0, 1);
        const e = Easing.easeInOutCubic(t);
        rect = { w: lerp(notifRect.w, chatRect.w, e), h: lerp(notifRect.h, chatRect.h, e), cx: lerp(notifRect.cx, chatRect.cx, e), cy: lerp(notifRect.cy, chatRect.cy, e), radius: lerp(notifRect.radius, chatRect.radius, e) };
        phase = "notif-to-chat";
    } else {
        rect = chatRect; phase = "chat";
    }

    let scale = 1;
    if (phase === "icon") scale = 1 + Math.sin(time * 1.5) * 0.02;
    const clickT = clamp((time - T4.CLICK) / 0.25, 0, 1);
    if (clickT > 0 && clickT < 1) scale *= 1 - Math.sin(clickT * Math.PI) * 0.05;

    const x = rect.cx - rect.w / 2;
    const y = rect.cy - rect.h / 2;

    const iconOpacity = phase === "icon" ? 1 : phase === "icon-to-notif" ? clamp(1 - (time - T4.MORPH_TO_NOTIF) / 0.4, 0, 1) : 0;
    const notifOpacity =
        phase === "icon-to-notif" ? clamp((time - T4.MORPH_TO_NOTIF - 0.5) / 0.4, 0, 1)
        : phase === "notif" ? 1
        : phase === "notif-to-chat" ? clamp(1 - (time - T4.MORPH_TO_CHAT) / 0.3, 0, 1)
        : 0;
    const chatHeaderOpacity = phase === "notif-to-chat" ? clamp((time - T4.MORPH_TO_CHAT - 0.5) / 0.4, 0, 1) : phase === "chat" ? 1 : 0;
    const chatBodyOpacity = phase === "chat" ? clamp((time - T4.CHAT_FORMED) / 0.3, 0, 1) : 0;
    const isIconLook = phase === "icon" || (phase === "icon-to-notif" && iconOpacity > 0.5);

    return (
        <div style={{ position: "absolute", left: x, top: y, width: rect.w, height: rect.h, transform: `scale(${scale})`, transformOrigin: "center", zIndex: 5 }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: rect.radius, background: isIconLook ? GOLD : SURFACE, border: isIconLook ? "none" : `1px solid ${BORDER_GOLD}`, boxShadow: SHADOW_FOCUS, overflow: "hidden", transition: "background 0.3s, border 0.3s" }}>
                {phase !== "icon" && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: notifOpacity * 0.6 + chatHeaderOpacity }} />
                )}
                {iconOpacity > 0 && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: iconOpacity }}>
                        <PlaneGlyph size={ICON_SIZE * 0.68} color={INK_950} />
                    </div>
                )}
                {notifOpacity > 0 && (
                    <div style={{ position: "absolute", left: 0, top: 0, width: NOTIF_W, height: NOTIF_H, transform: `translate(${(rect.w - NOTIF_W) / 2}px, ${(rect.h - NOTIF_H) / 2}px)`, opacity: notifOpacity, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, fontFamily: FONT_BODY }}>
                        <div style={{ width: 48, height: 48, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <RCAvatar size={48} rounded={RADIUS_CARD} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: -0.3, fontFamily: FONT_HEADING }}>RichCase Bot</span>
                                <span style={{ fontSize: 9, color: TEXT_DIM, fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Şimdi</span>
                            </div>
                            <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.35, fontWeight: 500 }}>
                                <span style={{ color: GREEN, fontWeight: 700, fontFamily: FONT_MONO, fontSize: 12 }}>BTC/USDT</span>
                                <span style={{ color: TEXT_DIM }}> işlem açıldı · </span>
                                <span style={{ color: GOLD, fontWeight: 700 }}>$30 ile</span>
                            </div>
                        </div>
                    </div>
                )}
                {chatHeaderOpacity > 0 && <ChatHeader opacity={chatHeaderOpacity} />}
                {chatBodyOpacity > 0 && <ChatBody time={time} opacity={chatBodyOpacity} />}
            </div>
            {iconOpacity > 0 && (
                <div style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: RED, border: `2px solid ${SURFACE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", fontFamily: FONT_MONO, opacity: iconOpacity, zIndex: 6 }}>1</div>
            )}
        </div>
    );
}

function CursorTap({ time }: { time: number }) {
    const start = T4.NOTIF_FORMED + 0.1;
    const end = T4.MORPH_TO_CHAT + 0.2;
    if (time < start || time > end) return null;
    const targetX = CENTER_X + 60;
    const targetY = CENTER_Y + 10;
    const t = clamp((time - start) / 0.5, 0, 1);
    const eased = Easing.easeInOutCubic(t);
    const fromX = targetX + 100;
    const fromY = targetY + 80;
    const x = fromX + (targetX - fromX) * eased;
    const y = fromY + (targetY - fromY) * eased;
    const clickT = clamp((time - T4.CLICK) / 0.3, 0, 1);
    const ringScale = clickT > 0 && clickT < 1 ? 0.5 + clickT * 1.8 : 0;
    const ringOpacity = clickT > 0 && clickT < 1 ? 1 - clickT : 0;
    return (
        <>
            {clickT > 0 && clickT < 1 && (
                <div style={{ position: "absolute", left: targetX - 30, top: targetY - 30, width: 60, height: 60, borderRadius: "50%", border: `2px solid ${GOLD}`, transform: `scale(${ringScale})`, opacity: ringOpacity, pointerEvents: "none", zIndex: 200 }} />
            )}
            <div style={{ position: "absolute", left: x, top: y, zIndex: 200, pointerEvents: "none" }}>
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                    <path d="M2 2L2 18L7 14L10 20L13 18L10 12L17 12L2 2Z" fill="white" stroke="black" strokeWidth="1" strokeLinejoin="round" />
                </svg>
            </div>
        </>
    );
}

function TelegramScene() {
    const time = useTime();
    return (
        <>
            <MorphElement time={time} />
            <CursorTap time={time} />
        </>
    );
}

export default function Scene3Telegram() {
    return (
        <SceneStage width={STAGE_W} height={STAGE_H} duration={T4.END} contentScale={1.45}>
            <TelegramScene />
        </SceneStage>
    );
}
