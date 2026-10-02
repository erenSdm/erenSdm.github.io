"use client";
/* eslint-disable react-hooks/set-state-in-effect -- ported verbatim from the original RichCase landing */

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ColumnModel } from "./ColumnModel";
import { RcCoinModel } from "./RcCoinModel";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

type ColumnConfig = { x: number; scaleY: number };
const baseScale = 0.45;
const columnsConfig: ColumnConfig[] = [
    { x: -2.4, scaleY: 0.85 },
    { x: -1.2, scaleY: 1 },
    { x: 0, scaleY: 1.15 },
    { x: 1.2, scaleY: 1.3 },
    { x: 2.4, scaleY: 1.45 },
];

const ENTRANCE_DURATION = 1.4;
const ENTRANCE_STAGGER = 0.2;
const ENTRANCE_BELOW = -22;

function easeOutBack(t: number): number {
    const c1 = 0.45;
    return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function AnimatedColumns({ activeColumnIndex, onColumnTopMeasured, onEntranceComplete }: {
    activeColumnIndex: number | null;
    onColumnTopMeasured?: (index: number, topY: number) => void;
    onEntranceComplete?: () => void;
}) {
    const columnRefs = useRef<THREE.Group[]>([]);
    const bounceStateRef = useRef(columnsConfig.map(() => ({ t: 0, active: false })));
    const entranceTimeRef = useRef(0);
    const entranceDoneRef = useRef(false);
    const completeFiredRef = useRef(false);

    useEffect(() => {
        if (activeColumnIndex === null) return;
        const s = bounceStateRef.current[activeColumnIndex];
        s.t = 0;
        s.active = true;
    }, [activeColumnIndex]);

    useFrame((_, delta) => {
        if (!entranceDoneRef.current) {
            entranceTimeRef.current += delta;
            const totalDuration = ENTRANCE_DURATION + ENTRANCE_STAGGER * (columnsConfig.length - 1);
            if (entranceTimeRef.current >= totalDuration && !completeFiredRef.current) {
                entranceDoneRef.current = true;
                completeFiredRef.current = true;
                onEntranceComplete?.();
            }
        }

        columnRefs.current.forEach((col, index) => {
            if (!col) return;

            const state = bounceStateRef.current[index];
            const idleOffset = Math.sin((performance.now() / 1000) * 0.4 + index * 0.5) * 0.05;
            let bounceOffset = 0;
            if (state.active) {
                state.t += delta * 2.2;
                const t = Math.min(state.t, 1);
                if (t <= 0.5) bounceOffset = -0.25 * (t / 0.5);
                else bounceOffset = -0.25 * (1 - (t - 0.5) / 0.5);
                if (t >= 1) { state.active = false; state.t = 0; bounceOffset = 0; }
            }

            let entranceOffset = 0;
            if (!entranceDoneRef.current) {
                const colT = Math.max(0, entranceTimeRef.current - index * ENTRANCE_STAGGER);
                const progress = Math.min(colT / ENTRANCE_DURATION, 1);
                entranceOffset = (1 - easeOutBack(progress)) * ENTRANCE_BELOW;
            }

            col.position.y = idleOffset + bounceOffset + entranceOffset;
        });
    });

    return (
        <>
            {columnsConfig.map((col, i) => (
                <ColumnModel
                    key={i}
                    ref={(el) => {
                        if (el) {
                            columnRefs.current[i] = el;
                            if (onColumnTopMeasured) {
                                const box = new THREE.Box3().setFromObject(el);
                                onColumnTopMeasured(i, box.max.y);
                            }
                        }
                    }}
                    position={[col.x, 0, 0]}
                    rotation={[0, Math.PI / 4, 0]}
                    scale={[baseScale, baseScale * col.scaleY, baseScale]}
                />
            ))}
        </>
    );
}

type Phase = "jumping" | "final";
const COIN_HEIGHT_OFFSET = 0.7;
const COIN_Z = 0;

function AnimatedCoin({ columnTops, onColumnLand, canStart }: {
    columnTops: number[];
    onColumnLand?: (index: number) => void;
    canStart: boolean;
}) {
    const coinRef = useRef<THREE.Group>(null);
    const phaseRef = useRef<Phase>("jumping");
    const currentIndexRef = useRef(0);
    const animTRef = useRef(0);
    const canStartRef = useRef(false);
    const entranceTimeRef = useRef(0);

    useEffect(() => {
        canStartRef.current = canStart;
        if (canStart) {
            phaseRef.current = "jumping";
            currentIndexRef.current = 0;
            animTRef.current = 0;
        }
    }, [canStart]);

    const getColumnTopY = (index: number) => (columnTops[index] ?? 7) + COIN_HEIGHT_OFFSET;
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    useFrame((_, delta) => {
        const coin = coinRef.current;
        if (!coin) return;

        if (!canStartRef.current) {
            entranceTimeRef.current += delta;
            const colT = Math.max(0, entranceTimeRef.current - 0 * ENTRANCE_STAGGER);
            const progress = Math.min(colT / ENTRANCE_DURATION, 1);
            const entranceOffset = progress < 1
                ? (1 - easeOutBack(progress)) * ENTRANCE_BELOW
                : 0;
            const bob = progress >= 1
                ? Math.sin((performance.now() / 1000) * 2) * 0.05
                : 0;
            coin.position.set(columnsConfig[0].x, getColumnTopY(0) + entranceOffset + bob, COIN_Z);
            coin.rotation.y += delta * 1.2;
            return;
        }

        if (phaseRef.current === "jumping") {
            animTRef.current += delta * 0.9;
            const clamped = Math.min(animTRef.current, 1);
            animTRef.current = clamped;
            const fromIndex = currentIndexRef.current;
            const toIndex = Math.min(fromIndex + 1, columnsConfig.length - 1);
            const eased = easeInOutQuad(clamped);
            const x = columnsConfig[fromIndex].x + (columnsConfig[toIndex].x - columnsConfig[fromIndex].x) * eased;
            const baseY = getColumnTopY(fromIndex) + (getColumnTopY(toIndex) - getColumnTopY(fromIndex)) * eased;
            const y = baseY + Math.sin(clamped * Math.PI) * 1.0;
            coin.position.set(x, y, COIN_Z);
            coin.rotation.y += delta * 1.0;
            if (clamped >= 1) {
                coin.position.set(columnsConfig[toIndex].x, getColumnTopY(toIndex), COIN_Z);
                if (toIndex >= columnsConfig.length - 1) {
                    phaseRef.current = "final"; animTRef.current = 0; currentIndexRef.current = toIndex; onColumnLand?.(toIndex);
                } else {
                    currentIndexRef.current = toIndex; animTRef.current = 0; onColumnLand?.(toIndex);
                }
            }
        } else if (phaseRef.current === "final") {
            const fi = columnsConfig.length - 1;
            const bob = Math.sin((performance.now() / 1000) * 2) * 0.05;
            coin.position.set(columnsConfig[fi].x, getColumnTopY(fi) + bob, COIN_Z);
            coin.rotation.y += delta * 1.4;
        }
    });

    return (
        <RcCoinModel ref={coinRef} position={[columnsConfig[0].x, -30, COIN_Z]} rotation={[0, 0, 0]} scale={0.35} />
    );
}

function MobileHero() {
    return (
        <div style={{ background: "#0d0d0d", width: "100%" }}>
            <div style={{ padding: "1.75rem 1.25rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                    <h1 style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2.25rem, 10vw, 3rem)", fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1, letterSpacing: "-0.04em" }}>
                        RichCase
                    </h1>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.25rem, 10vw, 3rem)", fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-0.04em" }}>
                        <span style={{ background: "linear-gradient(to right, #5A5A5A, #C0C0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            Leave it to{" "}
                        </span>
                        <span style={{ background: "linear-gradient(to right, #E6C75A, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            me!
                        </span>
                    </h2>
                </div>
                <p style={{ color: "#a0a0a0", fontSize: "0.9rem", lineHeight: 1.65, margin: 0, fontFamily: "var(--font-body)" }}>
                    Binance hesabına bağla, kaldıraçlı kripto ticaret botunu aktifleştir ve kazanmaya başla.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                    <a
                        href="#"
                        style={{ background: "#D4AF37", border: "none", padding: "12px 24px", fontWeight: 800, color: "#0a0a0a", cursor: "pointer", fontFamily: "var(--font-body)", letterSpacing: "0.04em", fontSize: "0.9rem", textDecoration: "none", display: "inline-block" }}
                    >
                        Hemen Başla
                    </a>
                    <a
                        href="#features"
                        style={{ background: "transparent", border: "1px solid rgba(192, 192, 192, 0.35)", padding: "12px 20px", fontWeight: 500, color: "#C0C0C0", cursor: "pointer", fontFamily: "var(--font-body)", letterSpacing: "0.02em", fontSize: "0.9rem", textDecoration: "none", display: "inline-block" }}
                    >
                        Nasıl Çalışır
                    </a>
                </div>
            </div>
            <video
                autoPlay loop muted playsInline
                style={{ width: "100%", display: "block", aspectRatio: "16/9" }}
            >
                <source src="/demos/richcase/vid/hero-animation.webm" type="video/webm" />
            </video>
        </div>
    );
}

export default function HeroScene() {
    const [activeColumnIndex, setActiveColumnIndex] = useState<number | null>(null);
    const [columnTops, setColumnTops] = useState<number[]>(() => new Array(columnsConfig.length).fill(7));
    const [isVisible, setIsVisible] = useState(true);
    const [coinCanStart, setCoinCanStart] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    if (isMobile) return <MobileHero />;

    return (
        <div ref={containerRef} style={{ position: "absolute", inset: 0, background: "#0d0d0d", zIndex: 0 }}>

            {/* ====== HERO TEXT ====== */}
            <div
                className="absolute z-50 pointer-events-auto flex flex-col gap-5 md:gap-7
                           top-[8%] left-4 right-4
                           sm:top-[12%] sm:left-[6%] sm:right-[6%]
                           md:top-[18%] md:left-[8%] md:right-auto md:max-w-[640px]"
            >
                <div className="flex flex-col" style={{ gap: "0.1rem" }}>
                    <h1 style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2rem, 6.5vw, 5rem)", fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1, letterSpacing: "-0.04em" }}>
                        RichCase
                    </h1>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 6.5vw, 5rem)", fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-0.04em" }}>
                        <span style={{ background: "linear-gradient(to right, #5A5A5A, #C0C0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            Leave it to{" "}
                        </span>
                        <span style={{ background: "linear-gradient(to right, #E6C75A, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            me!
                        </span>
                    </h2>
                </div>

                <p className="max-w-full md:max-w-[460px]" style={{ color: "#a0a0a0", fontSize: "clamp(0.875rem, 2.5vw, 1rem)", lineHeight: 1.65, margin: 0, fontFamily: "var(--font-body)" }}>
                    Binance hesabına bağla, kaldıraçlı kripto ticaret botunu aktifleştir ve kazanmaya başla.
                </p>

                <div className="flex flex-wrap gap-3 items-center mt-1">
                    <a
                        href="#"
                        style={{ background: "#D4AF37", border: "none", padding: "13px 28px", fontWeight: 800, color: "#0a0a0a", cursor: "pointer", fontFamily: "var(--font-body)", letterSpacing: "0.04em", fontSize: "0.9rem", transition: "all 0.2s ease", textDecoration: "none", display: "inline-block" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#E6C75A"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#D4AF37"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        Hemen Başla
                    </a>
                    <a
                        href="#features"
                        style={{ background: "transparent", border: "1px solid rgba(192, 192, 192, 0.35)", padding: "13px 22px", fontWeight: 500, color: "#C0C0C0", cursor: "pointer", fontFamily: "var(--font-body)", letterSpacing: "0.02em", fontSize: "0.9rem", transition: "all 0.2s ease", textDecoration: "none", display: "inline-block" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.6)"; e.currentTarget.style.color = "#E6C75A"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(192, 192, 192, 0.35)"; e.currentTarget.style.color = "#C0C0C0"; }}
                    >
                        Nasıl Çalışır
                    </a>
                </div>
            </div>

            {/* ====== 3D CANVAS ====== */}
            <Canvas style={{ width: "100%", height: "100%" }} camera={{ position: [1, 9, 9], fov: 30 }} dpr={[1, 2]} performance={{ min: 0.5 }} frameloop={isVisible ? "always" : "demand"}>
                <color attach="background" args={["#0d0d0d"]} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[-3, 15, -10]} intensity={2} color="white" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
                <directionalLight position={[40, -10, -5]} intensity={0.4} color="white" />
                <directionalLight position={[-45, -20, 1]} intensity={0.4} color="white" />
                <directionalLight position={[15, 20, -15]} intensity={0.4} color="white" />
                <AnimatedColumns
                    activeColumnIndex={activeColumnIndex}
                    onColumnTopMeasured={(index, topY) => { setColumnTops((prev) => { const next = [...prev]; next[index] = topY; return next; }); }}
                    onEntranceComplete={() => setCoinCanStart(true)}
                />
                <AnimatedCoin
                    columnTops={columnTops}
                    onColumnLand={(index) => setActiveColumnIndex(index)}
                    canStart={coinCanStart}
                />
                <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} target={[-0.4, 6, 0]} />
            </Canvas>

        </div>
    );
}
