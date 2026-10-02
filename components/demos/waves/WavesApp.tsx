"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { House, LibraryBig, Search } from "lucide-react";
import { ArtistScreen } from "./ArtistScreen";
import { CollectionScreen } from "./CollectionScreen";
import { getAlbum } from "./data";
import { body, display } from "./fonts";
import { HomeScreen } from "./HomeScreen";
import { LibraryScreen } from "./LibraryScreen";
import { MiniPlayer } from "./MiniPlayer";
import { NowPlaying } from "./NowPlaying";
import { PlayerProvider, usePlayer } from "./player";
import { SearchScreen } from "./SearchScreen";
import { C, NavContext, SPRING, STROKE, type Route } from "./ui";

type Tab = "home" | "search" | "library";
const TABS: { id: Tab; label: string; Icon: typeof House }[] = [
  { id: "home", label: "Home", Icon: House },
  { id: "search", label: "Search", Icon: Search },
  { id: "library", label: "Library", Icon: LibraryBig },
];

/**
 * Palette custom properties are registered so the browser can interpolate
 * them: every gradient, control and tint that reads var(--pal-*) crossfades
 * when the playing album changes, without React animating anything.
 */
const CSS = `
@property --pal-deep { syntax: '<color>'; inherits: true; initial-value: #0B2E35; }
@property --pal-mid { syntax: '<color>'; inherits: true; initial-value: #1D6B70; }
@property --pal-accent { syntax: '<color>'; inherits: true; initial-value: #9EE6D2; }
@property --pal-ink { syntax: '<color>'; inherits: true; initial-value: #062226; }
.wv-root { font-family: var(--wv-body), system-ui, sans-serif; transition: --pal-deep 1.1s ease, --pal-mid 1.1s ease, --pal-accent .9s ease, --pal-ink .9s ease; }
.wv-display { font-family: var(--wv-display), var(--wv-body), sans-serif; font-optical-sizing: auto; }
.wv-root ::selection { background: var(--pal-accent); color: var(--pal-ink); }
.wv-tint { background:
  radial-gradient(120% 50% at 0% 0%, color-mix(in oklab, var(--pal-mid) 34%, transparent) 0%, transparent 70%),
  radial-gradient(90% 40% at 100% 4%, color-mix(in oklab, var(--pal-deep) 60%, transparent) 0%, transparent 70%),
  ${C.bg}; }
.wv-np-bg { background: linear-gradient(180deg,
  color-mix(in oklab, var(--pal-mid) 82%, #0d0c0b) 0%,
  color-mix(in oklab, var(--pal-deep) 90%, #0d0c0b) 58%,
  color-mix(in oklab, var(--pal-deep) 55%, #0d0c0b) 100%); }
.wv-pal-bg { background: var(--pal-accent); }
.wv-noscroll { scrollbar-width: none; }
.wv-noscroll::-webkit-scrollbar { display: none; }
.wv-eq > span { height: 100%; transform-origin: bottom; transform: scaleY(.35); animation: wv-eq .85s ease-in-out infinite alternate; animation-play-state: paused; }
.wv-eq > span:nth-child(2) { transform: scaleY(.7); animation-duration: .7s; }
.wv-eq > span:nth-child(3) { transform: scaleY(.5); animation-duration: 1s; }
.wv-eq[data-playing="true"] > span { animation-play-state: running; }
@keyframes wv-eq { 0% { transform: scaleY(.25); } 50% { transform: scaleY(1); } 100% { transform: scaleY(.45); } }
.wv-bar { animation: wv-grow .55s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 6ms); }
@keyframes wv-grow { from { transform: scaleY(.12); opacity: .3; } }
@media (prefers-reduced-motion: reduce) {
  .wv-root { transition: none; }
  .wv-eq > span, .wv-bar { animation: none; }
}
`;

export function WavesApp() {
  return (
    <PlayerProvider>
      <Shell />
    </PlayerProvider>
  );
}

function Shell() {
  const { current } = usePlayer();
  const reduce = useReducedMotion();
  const pal = getAlbum(current.albumId).palette;

  const [tab, setTab] = useState<Tab>("home");
  const [stacks, setStacks] = useState<Record<Tab, Route[]>>({ home: [], search: [], library: [] });
  const [playerOpen, setPlayerOpen] = useState(false);

  const push = useCallback((route: Route) => setStacks((s) => ({ ...s, [tab]: [...s[tab], route] })), [tab]);
  const pop = useCallback(() => setStacks((s) => ({ ...s, [tab]: s[tab].slice(0, -1) })), [tab]);
  const openPlayer = useCallback(() => setPlayerOpen(true), []);
  const nav = useMemo(() => ({ push, pop, openPlayer }), [push, pop, openPlayer]);

  const selectTab = (id: Tab) => {
    if (id === tab) setStacks((s) => ({ ...s, [id]: [] }));
    else setTab(id);
  };

  return (
    <NavContext.Provider value={nav}>
      <style>{CSS}</style>
      <div
        className={`wv-root wv-tint ${display.variable} ${body.variable} relative h-full w-full overflow-hidden`}
        style={
          {
            "--pal-deep": pal.deep,
            "--pal-mid": pal.mid,
            "--pal-accent": pal.accent,
            "--pal-ink": pal.ink,
            color: C.text,
          } as React.CSSProperties
        }
      >
        {TABS.map(({ id }) => (
          <div key={id} className="absolute inset-0" hidden={tab !== id}>
            <div className="wv-noscroll h-full overflow-y-auto overscroll-contain">
              {id === "home" ? <HomeScreen /> : id === "search" ? <SearchScreen /> : <LibraryScreen />}
            </div>
            <AnimatePresence initial={false}>
              {stacks[id].map((route, i) => (
                <motion.div
                  key={`${i}-${route.kind}-${route.id}`}
                  className="absolute inset-0 z-10 shadow-[-24px_0_40px_-20px_rgba(0,0,0,0.6)]"
                  style={{ background: C.bg }}
                  initial={reduce ? { opacity: 0 } : { x: "100%" }}
                  animate={reduce ? { opacity: 1 } : { x: 0 }}
                  exit={reduce ? { opacity: 0 } : { x: "100%" }}
                  transition={SPRING}
                >
                  {route.kind === "artist" ? <ArtistScreen id={route.id} /> : <CollectionScreen kind={route.kind} id={route.id} />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}

        {/* bottom chrome */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
          <div className="pointer-events-auto px-2 pb-1.5">
            <MiniPlayer onOpen={openPlayer} />
          </div>
          <nav
            aria-label="Main"
            className="pointer-events-auto grid grid-cols-3 border-t border-white/[0.06] backdrop-blur-xl"
            style={{ background: "rgba(19,18,17,0.88)", paddingBottom: "var(--safe-bottom)" }}
          >
            {TABS.map(({ id, label, Icon }) => {
              const on = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectTab(id)}
                  aria-current={on ? "page" : undefined}
                  className="relative flex h-[52px] flex-col items-center justify-center gap-1 transition-colors"
                  style={{ color: on ? C.text : C.faint }}
                >
                  {on && (
                    <motion.span
                      layoutId="wv-tab"
                      transition={SPRING}
                      className="absolute top-0 h-[2px] w-7 rounded-full"
                      style={{ background: "var(--pal-accent)" }}
                    />
                  )}
                  <Icon className="h-[22px] w-[22px]" strokeWidth={STROKE} />
                  <span className="text-[10.5px] font-semibold tracking-[0.01em]">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <AnimatePresence>{playerOpen && <NowPlaying onClose={() => setPlayerOpen(false)} />}</AnimatePresence>
      </div>
    </NavContext.Provider>
  );
}
