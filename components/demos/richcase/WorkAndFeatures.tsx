"use client";

import React, { useEffect, useRef, useState } from "react";
import Scene1Purchase from "./scenes/Scene1Purchase";
import Scene2Trades from "./scenes/Scene2Trades";
import Scene3Telegram from "./scenes/Scene3Telegram";
import Scene4Vault from "./scenes/Scene4Vault";

function useInView<T extends HTMLElement>(threshold = 0.18) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold, rootMargin: "0px 0px -6% 0px" },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView] as const;
}

type Block = {
    title: string;
    accent: string;
    body: string;
    Scene: React.ComponentType;
};

const BLOCKS: Block[] = [
    {
        title: "Paketini seç,",
        accent: "botunu çalıştır.",
        body: "Aboneliği seç, satın al, anında bağlan. Bot işini yapmaya başlar — kod yazmana, ayar kurmana gerek yok.",
        Scene: Scene1Purchase,
    },
    {
        title: "Bot çalışır,",
        accent: "kasan büyür.",
        body: "Bot Binance hesabına bağlanır, işlemler canlı panele düşer. Kapanan her işlemin kârı kasaya yazılır.",
        Scene: Scene2Trades,
    },
    {
        title: "Her hareket,",
        accent: "cebinde.",
        body: "Bot her açılan ve kapanan işlemi anında Telegram'dan bildirir. Sorularına da yine oradan cevap alırsın.",
        Scene: Scene3Telegram,
    },
    {
        title: "Hesabın hep",
        accent: "kalkan altında.",
        body: "Para senin Binance hesabında kalır. Bot yalnızca emir gönderir — fonlarına asla dokunamaz, çekemez.",
        Scene: Scene4Vault,
    },
];

function FeatureRow({ block, index }: { block: Block; index: number }) {
    const [ref, inView] = useInView<HTMLDivElement>(0.15);
    const [runId, setRunId] = useState(0);
    const Scene = block.Scene;
    return (
        <div
            ref={ref}
            className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 lg:gap-x-16 gap-y-10 items-center"
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${index * 60}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${index * 60}ms`,
            }}
        >
            <div className="lg:col-span-4 lg:order-1">
                <h3 className="font-heading font-semibold text-heading-1 text-ink-100 leading-[1.06] tracking-tight">
                    {block.title}
                    <br />
                    <span className="text-gradient-gold">{block.accent}</span>
                </h3>
                <span
                    aria-hidden="true"
                    className="block h-px bg-gold-500/55 mt-7 mb-7"
                    style={{
                        width: inView ? "72px" : "0px",
                        transition: `width 900ms cubic-bezier(0.22,1,0.36,1) ${index * 60 + 200}ms`,
                    }}
                />
                <p className="font-body text-body-lg text-ink-300 leading-relaxed max-w-[44ch]">
                    {block.body}
                </p>
            </div>

            <div className="lg:col-span-8 lg:order-2 -mx-4 sm:-mx-6 lg:mx-0">
                <div className="relative w-full">
                    <Scene key={runId} />
                    <button
                        type="button"
                        onClick={() => setRunId((n) => n + 1)}
                        aria-label="Animasyonu tekrar oynat"
                        title="Tekrar oynat"
                        className="absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/40 bg-ink-900/70 text-ink-200 backdrop-blur-sm transition-colors hover:border-gold-500/80 hover:text-gold-400"
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M13.5 8a5.5 5.5 0 1 1-1.61-3.89"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <path
                                d="M13.5 2.5v3h-3"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function WorkAndFeatures() {
    return (
        <section
            id="features"
            className="relative py-16 md:py-24 lg:py-32 bg-ink-900 overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(800px 600px at 75% 8%, rgba(212,175,55,0.05), transparent 60%), radial-gradient(700px 500px at 15% 92%, rgba(212,175,55,0.04), transparent 60%)",
                }}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
                <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
                    {BLOCKS.map((block, i) => (
                        <FeatureRow key={i} block={block} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
