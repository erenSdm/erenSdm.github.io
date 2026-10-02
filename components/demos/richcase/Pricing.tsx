"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Info } from "lucide-react";

const plans = [
    { name: "Lite",     limit: "500",   price: "75",  features: ["Tam otomatik trading", "Sadece Binance", "Kaldıraçlı işlemler", "Anlık bildirimler", "7/24 Destek"], highlight: false },
    { name: "Pro",      limit: "1.000", price: "110", features: ["Tam otomatik trading", "Sadece Binance", "Kaldıraçlı işlemler", "Anlık bildirimler", "7/24 Destek"], highlight: false },
    { name: "Max",      limit: "1.500", price: "150", features: ["Tam otomatik trading", "Sadece Binance", "Kaldıraçlı işlemler", "Anlık bildirimler", "7/24 Destek"], highlight: true },
    { name: "Elite",    limit: "2.000", price: "250", features: ["Tam otomatik trading", "Sadece Binance", "Kaldıraçlı işlemler", "Anlık bildirimler", "7/24 Destek"], highlight: false },
    { name: "Ultimate", limit: "5.000", price: "550", features: ["Tam otomatik trading", "Sadece Binance", "Kaldıraçlı işlemler", "Anlık bildirimler", "7/24 Destek"], highlight: false },
];

const INITIAL_ACTIVE = 2; // Max paketi (index 2)

function PlanCardInner({ plan, isHovered }: { plan: typeof plans[0]; isHovered: boolean }) {
    const isPro = plan.highlight;
    return (
        <>
            <div className="mb-6">
                {isPro && (
                    <div className="flex items-baseline justify-end mb-2">
                        <span className="font-body text-mono-sm text-gold-400 uppercase tracking-[0.1em]">
                            Tavsiye
                        </span>
                    </div>
                )}
                <h3 className={`font-heading font-extrabold text-2xl lg:text-3xl uppercase tracking-tight mb-3 ${isPro ? "text-gold-400" : "text-ink-100"}`}>
                    {plan.name}
                </h3>
            </div>

            <div className="mb-7 pb-6 border-b border-ink-600">
                <div className="mb-4">
                    <div className="font-body text-mono-sm tracking-[0.14em] text-ink-400 mb-1">
                        Yönetilen Bakiye
                    </div>
                    <span className={`font-heading font-extrabold text-3xl lg:text-4xl leading-none tracking-tight transition-colors duration-200 ${isPro || isHovered ? "text-gold-400" : "text-ink-200"}`}>
                        {plan.limit}
                    </span>
                    <span className="font-body text-mono-sm text-ink-400 ml-1.5">USDT</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="font-heading font-bold text-xl text-ink-300">$</span>
                    <span className={`font-heading font-extrabold text-4xl lg:text-5xl leading-none tracking-tight ${isPro ? "text-ink-100" : "text-ink-200"}`}>
                        {plan.price}
                    </span>
                </div>
                <div className="font-body text-mono-sm uppercase tracking-[0.16em] text-ink-400 mt-2">
                    / hafta
                </div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 font-body text-sm text-ink-200">
                        <span
                            aria-hidden="true"
                            className="mt-1.5 inline-block w-2 h-2 flex-shrink-0 border"
                            style={{
                                borderColor: isPro || isHovered ? "var(--color-gold-500)" : "var(--color-gold-700)",
                                background: isPro || isHovered ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.1)",
                            }}
                        />
                        {feature}
                    </li>
                ))}
            </ul>

            <a
                href="#"
                className={`
                    block text-center w-full py-3.5 font-body font-bold text-sm uppercase tracking-[0.06em] transition-all duration-200
                    ${isPro
                        ? "bg-gold-500 text-ink-950 hover:bg-gold-400"
                        : "bg-transparent border border-gold-700/50 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500"
                    }
                `}
            >
                Başla
            </a>
        </>
    );
}

export default function Pricing() {
    const [hovered, setHovered] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(INITIAL_ACTIVE);
    const scrollRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
            if (!card) return;
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(containerCenter - cardCenter);
            if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        setActiveIndex(closest);
    }, []);

    // Başlangıçta Max (3. paket) kartını ortaya getir
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const timer = setTimeout(() => {
            const card = cardRefs.current[INITIAL_ACTIVE];
            if (!card) return;
            const scrollTo = card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
            container.scrollLeft = Math.max(0, scrollTo);
        }, 60);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="pricing" className="relative py-16 md:py-24 lg:py-36 bg-ink-900 overflow-hidden">

            {/* Başlık */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
                <div className="max-w-3xl mb-10 md:mb-16 lg:mb-24">
                    <h2 className="font-heading font-extrabold text-display-2 text-ink-100 leading-none mb-6">
                        Paketini <span className="text-gradient-gold">seç</span>
                    </h2>
                    <p className="font-body text-body-lg text-ink-300 max-w-xl">
                        Sadece kazandıkça büyüt. Tüm paketlerde haftalık ödeme, uzun vadeli taahhüt yok.
                    </p>
                </div>
            </div>

            {/* ===== Mobil Carousel (lg altı) ===== */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="lg:hidden relative z-10 flex overflow-x-auto pb-6"
                style={{
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    gap: "1rem",
                    paddingLeft: "calc(50% - 36vw)",
                    paddingRight: "calc(50% - 36vw)",
                }}
            >
                {plans.map((plan, idx) => {
                    const isPro = plan.highlight;
                    const isActive = activeIndex === idx;
                    const isHovered = hovered === idx;
                    return (
                        <div
                            key={plan.name}
                            ref={(el) => { cardRefs.current[idx] = el; }}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            className={`relative flex flex-col p-5 bg-ink-850 ${
                                isPro
                                    ? "border-2 border-gold-500 shadow-brutal"
                                    : "border border-ink-600"
                            }`}
                            style={{
                                scrollSnapAlign: "center",
                                flexShrink: 0,
                                width: "72vw",
                                maxWidth: "320px",
                                transform: isActive ? "scale(1)" : "scale(0.88)",
                                opacity: isActive ? 1 : 0.58,
                                transition: "transform 380ms cubic-bezier(0.22,1,0.36,1), opacity 380ms",
                                willChange: "transform",
                            }}
                        >
                            <PlanCardInner plan={plan} isHovered={isHovered} />
                        </div>
                    );
                })}
            </div>

            {/* ===== Desktop Grid (lg ve üstü) ===== */}
            <div className="hidden lg:block container mx-auto px-10 relative z-10">
                <div className="grid grid-cols-5 gap-4">
                    {plans.map((plan, idx) => {
                        const isPro = plan.highlight;
                        const isHovered = hovered === idx;
                        return (
                            <div
                                key={plan.name}
                                onMouseEnter={() => setHovered(idx)}
                                onMouseLeave={() => setHovered(null)}
                                className={`
                                    relative flex flex-col p-7 transition-all duration-300
                                    bg-ink-850
                                    ${isPro
                                        ? "border-2 border-gold-500 shadow-brutal scale-[1.02] z-10 hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:2px_2px_0_0_rgba(0,0,0,1)]"
                                        : "border border-ink-600 hover:border-gold-700/60"
                                    }
                                `}
                            >
                                <PlanCardInner plan={plan} isHovered={isHovered} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Alt not */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10 mt-10 md:mt-14">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 font-body text-sm text-ink-400">
                    <Info className="w-4 h-4 text-gold-600" />
                    <p className="text-center">Tüm paketlerde Binance API bağlantısı gereklidir. Ödemeler USDT (BEP-20) olarak alınır.</p>
                </div>
            </div>
        </section>
    );
}
