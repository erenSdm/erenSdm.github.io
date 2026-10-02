"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

export const Easing = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => --t * t * t + 1,
    easeInOutCubic: (t: number) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t: number) => t * t * t * t,
    easeOutQuart: (t: number) => 1 - --t * t * t * t,
    easeInOutQuart: (t: number) =>
        t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    easeInOutExpo: (t: number) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
        return 1 - 0.5 * Math.pow(2, -20 * t + 10);
    },
    easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
    easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
    easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
    easeOutBack: (t: number) => {
        const c1 = 1.70158,
            c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    easeInBack: (t: number) => {
        const c1 = 1.70158,
            c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    },
    easeInOutBack: (t: number) => {
        const c1 = 1.70158,
            c2 = c1 * 1.525;
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
    easeOutElastic: (t: number) => {
        const c4 = (2 * Math.PI) / 3;
        if (t === 0) return 0;
        if (t === 1) return 1;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
};

export const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type TimelineCtx = { time: number; duration: number; playing: boolean };
const TimelineContext = createContext<TimelineCtx>({
    time: 0,
    duration: 10,
    playing: false,
});

export const useTime = () => useContext(TimelineContext).time;

export function SceneStage({
    width = 1280,
    height = 720,
    duration = 10,
    background = "transparent",
    children,
    aspect,
    contentScale = 1,
}: {
    width?: number;
    height?: number;
    duration?: number;
    background?: string;
    children: React.ReactNode;
    aspect?: number;
    contentScale?: number;
}) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [time, setTime] = useState(0);
    const [started, setStarted] = useState(false);
    const [scale, setScale] = useState(1);

    const ratio = aspect ?? width / height;

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
                    setStarted(true);
                    io.disconnect();
                }
            },
            {
                threshold: [0, 0.25, 0.45, 0.55, 0.7, 1],
                rootMargin: "0px 0px -22% 0px",
            },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const measure = () => {
            const w = el.clientWidth;
            const h = el.clientHeight;
            if (w <= 0 || h <= 0) return;
            const s = Math.min(w / width, h / height);
            setScale(Math.max(0.05, s));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [width, height]);

    useEffect(() => {
        if (!started) return;
        let raf = 0;
        let last: number | null = null;
        let stopped = false;
        const step = (ts: number) => {
            if (stopped) return;
            if (last == null) last = ts;
            const dt = (ts - last) / 1000;
            last = ts;
            setTime((t) => {
                const next = t + dt;
                if (next >= duration) {
                    stopped = true;
                    return duration;
                }
                return next;
            });
            if (!stopped) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => {
            stopped = true;
            cancelAnimationFrame(raf);
        };
    }, [started, duration]);

    const ctxValue = useMemo(
        () => ({ time, duration, playing: started && time < duration }),
        [time, duration, started],
    );

    return (
        <div
            ref={wrapRef}
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: `${ratio}`,
                background,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width,
                    height,
                    transform: `translate(-50%, -50%) scale(${scale * contentScale})`,
                    transformOrigin: "center center",
                }}
            >
                <TimelineContext.Provider value={ctxValue}>
                    {children}
                </TimelineContext.Provider>
            </div>
        </div>
    );
}
