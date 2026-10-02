"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { getTrack, INITIAL_LIKED, INITIAL_QUEUE, type Track } from "./data";

/* ------------------------------------------------------------------ */
/* Clock: an external store so ticking never re-renders the app tree.  */
/* Only components that subscribe (time labels, scrubber, lyrics) see  */
/* updates, and most of them write to the DOM directly.               */
/* ------------------------------------------------------------------ */

export interface Clock {
  get: () => number;
  set: (sec: number) => void;
  subscribe: (fn: () => void) => () => void;
}

function createClock(initial: number): Clock {
  let value = initial;
  const subs = new Set<() => void>();
  return {
    get: () => value,
    set: (sec) => {
      value = sec;
      subs.forEach((fn) => fn());
    },
    subscribe: (fn) => {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Player state                                                        */
/* ------------------------------------------------------------------ */

export type RepeatMode = "off" | "all" | "one";

interface State {
  queue: string[];
  /** queue order before shuffle, to restore on shuffle off */
  original: string[] | null;
  index: number;
  playing: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  liked: string[];
  context: string;
}

type Action =
  | { type: "load"; queue: string[]; original: string[] | null; index: number; context: string }
  | { type: "jump"; index: number }
  | { type: "setPlaying"; playing: boolean }
  | { type: "shuffle"; on: boolean; queue: string[]; original: string[] | null; index: number }
  | { type: "repeat" }
  | { type: "remove"; index: number }
  | { type: "like"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load":
      return { ...state, queue: action.queue, original: action.original, index: action.index, context: action.context, playing: true };
    case "jump":
      return { ...state, index: action.index, playing: true };
    case "setPlaying":
      return { ...state, playing: action.playing };
    case "shuffle":
      return { ...state, shuffle: action.on, queue: action.queue, original: action.original, index: action.index };
    case "repeat":
      return { ...state, repeat: state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off" };
    case "remove": {
      if (action.index <= state.index) return state;
      const id = state.queue[action.index];
      return {
        ...state,
        queue: state.queue.filter((_, i) => i !== action.index),
        original: state.original ? state.original.filter((x) => x !== id) : null,
      };
    }
    case "like":
      return {
        ...state,
        liked: state.liked.includes(action.id)
          ? state.liked.filter((x) => x !== action.id)
          : [action.id, ...state.liked],
      };
  }
}

function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface PlayerApi {
  state: State;
  current: Track;
  clock: Clock;
  /** Replace the queue and start playing `trackIds[index]`. */
  playList: (trackIds: string[], index: number, context: string, opts?: { shuffle?: boolean }) => void;
  jumpTo: (index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  removeAt: (index: number) => void;
  toggleLike: (id: string) => void;
}

const PlayerContext = createContext<PlayerApi | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

/** Whole seconds elapsed; re-renders the caller once per second at most. */
export function useElapsedSeconds() {
  const { clock } = usePlayer();
  return useSyncExternalStore(
    clock.subscribe,
    () => Math.floor(clock.get()),
    () => Math.floor(INITIAL_QUEUE.elapsed),
  );
}

/** Subscribe to every clock tick without re-rendering (for direct DOM writes). */
export function useClockListener(fn: (sec: number) => void) {
  const { clock } = usePlayer();
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    fnRef.current(clock.get());
    return clock.subscribe(() => fnRef.current(clock.get()));
  }, [clock]);
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [clock] = useState(() => createClock(INITIAL_QUEUE.elapsed));
  const [state, dispatch] = useReducer(reducer, undefined, (): State => ({
    queue: INITIAL_QUEUE.trackIds,
    original: null,
    index: INITIAL_QUEUE.index,
    playing: true,
    shuffle: false,
    repeat: "off",
    liked: INITIAL_LIKED,
    context: INITIAL_QUEUE.context,
  }));

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const current = getTrack(state.queue[state.index]);

  const jumpTo = useCallback(
    (index: number) => {
      clock.set(0);
      dispatch({ type: "jump", index });
    },
    [clock],
  );

  const advance = useCallback(
    (auto: boolean) => {
      const s = stateRef.current;
      if (auto && s.repeat === "one") {
        clock.set(0);
        return;
      }
      if (s.index < s.queue.length - 1) jumpTo(s.index + 1);
      else if (s.repeat !== "off" || !auto) jumpTo(0);
      else {
        clock.set(0);
        dispatch({ type: "setPlaying", playing: false });
      }
    },
    [clock, jumpTo],
  );

  // Ticker: only runs while playing; writes to the clock store, not React state.
  const duration = current.duration;
  useEffect(() => {
    if (!state.playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const nextSec = clock.get() + dt;
      if (nextSec >= duration) {
        clock.set(duration);
        // A track change restarts this effect; until then keep looping so
        // "repeat one" (which changes no state) keeps playing.
        advance(true);
      } else {
        clock.set(nextSec);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state.playing, state.index, state.queue, duration, clock, advance]);

  const playList = useCallback<PlayerApi["playList"]>(
    (trackIds, index, context, opts) => {
      const s = stateRef.current;
      const wantShuffle = opts?.shuffle ?? s.shuffle;
      if (opts?.shuffle !== undefined && opts.shuffle !== s.shuffle) {
        dispatch({ type: "shuffle", on: opts.shuffle, queue: s.queue, original: s.original, index: s.index });
      }
      clock.set(0);
      if (wantShuffle) {
        const start = opts?.shuffle ? Math.floor(Math.random() * trackIds.length) : index;
        const first = trackIds[start];
        const rest = shuffled(trackIds.filter((_, i) => i !== start));
        dispatch({ type: "load", queue: [first, ...rest], original: trackIds, index: 0, context });
      } else {
        dispatch({ type: "load", queue: trackIds, original: null, index, context });
      }
    },
    [clock],
  );

  const toggle = useCallback(() => {
    dispatch({ type: "setPlaying", playing: !stateRef.current.playing });
  }, []);

  const next = useCallback(() => advance(false), [advance]);

  const prev = useCallback(() => {
    const s = stateRef.current;
    if (clock.get() > 3 || s.index === 0) {
      clock.set(0);
      return;
    }
    jumpTo(s.index - 1);
  }, [clock, jumpTo]);

  const seek = useCallback(
    (sec: number) => {
      const s = stateRef.current;
      const d = getTrack(s.queue[s.index]).duration;
      clock.set(Math.max(0, Math.min(d - 0.5, sec)));
    },
    [clock],
  );

  const toggleShuffle = useCallback(() => {
    const s = stateRef.current;
    const currentId = s.queue[s.index];
    if (!s.shuffle) {
      const upcoming = shuffled(s.queue.filter((_, i) => i !== s.index));
      dispatch({ type: "shuffle", on: true, queue: [currentId, ...upcoming], original: s.queue, index: 0 });
    } else {
      const restored = s.original ?? s.queue;
      const idx = Math.max(0, restored.indexOf(currentId));
      dispatch({ type: "shuffle", on: false, queue: restored, original: null, index: idx });
    }
  }, []);

  const cycleRepeat = useCallback(() => dispatch({ type: "repeat" }), []);
  const removeAt = useCallback((index: number) => dispatch({ type: "remove", index }), []);
  const toggleLike = useCallback((id: string) => dispatch({ type: "like", id }), []);

  const api = useMemo<PlayerApi>(
    () => ({ state, current, clock, playList, jumpTo, toggle, next, prev, seek, toggleShuffle, cycleRepeat, removeAt, toggleLike }),
    [state, current, clock, playList, jumpTo, toggle, next, prev, seek, toggleShuffle, cycleRepeat, removeAt, toggleLike],
  );

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}
