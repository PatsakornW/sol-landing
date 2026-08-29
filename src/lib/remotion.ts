'use client';

/**
 * Remotion playback hooks for the mechanism cards.
 *
 * Same contract as the app's (`apps/web/src/lib/remotion.ts`): frames run 0→end
 * once and then hold the settled frame — no loop, no idle pulse. The landing
 * app is a separate build with no shared package between them, so this is a
 * deliberate copy rather than an import across app boundaries.
 */
import { useEffect, useState } from 'react';

import { useMediaQuery } from '@/lib/hooks/use-media-query';

/** Tracks the `prefers-reduced-motion` media query, live. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Below this the plates keep playing, but the showcase needs its own crop: the
 * 1180px composition fitted whole to a phone lands the app's 12px type under
 * 4px. `ShowcasePlate` answers with a zoomed, portrait crop.
 *
 * Paired with `media.maxMd` in `styles/breakpoints.stylex.ts`, which is the same
 * 899: components that know the regime take it from this hook and pass it as a
 * prop, and the media query covers the one render that cannot be told (the
 * props-less `loading` closure). The mechanism plates size from their own column
 * — `max-width` = composition width, crop scale `max(floor, type-floor)` — so
 * they need no compact regime at all.
 */
export const PLATE_COMPACT_MAX_WIDTH = 899;

/**
 * True once the client has hydrated, on every stage width.
 *
 * Still false on the server render and the first client render — that is what
 * keeps the Remotion chunk out of the critical path and lets the static
 * stand-ins carry the first paint and the no-JS case. It simply no longer
 * stays false on phones.
 */
export function usePlate(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return ready;
}

/** True on stages that need the showcase's zoomed portrait crop. */
export function useCompactPlate(): boolean {
  return useMediaQuery(`(max-width: ${PLATE_COMPACT_MAX_WIDTH}px)`);
}

interface PlayOnceOptions {
  /** Playback starts the first time this is true — not on mount. */
  start: boolean;
  /** False under reduced motion: the settled frame shows immediately. */
  animate: boolean;
}

/**
 * Plays frames 0→end once `start` turns true, then holds the last frame.
 *
 * One clock per section, not per clip: callers that run several clips as a
 * sequence subtract their own offset from this frame (see `MechanismSection`),
 * which keeps the whole row on one rAF loop and one React commit per tick.
 *
 * Unlike the app's copy this does not start on mount: these clips live behind a
 * scroll-driven panel that is invisible until the hero frame has expanded, and
 * an animation that finished while its own card was at `opacity: 0` is the same
 * as no animation at all.
 */
export function usePlayOnceFrame(
  durationInFrames: number,
  fps: number,
  { start, animate }: PlayOnceOptions,
): number {
  const last = durationInFrames - 1;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!start || !animate) return;

    let raf = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const elapsed = ((now - started) / 1000) * fps;
      const next = Math.max(0, Math.min(last, Math.floor(elapsed)));
      setFrame((prev) => (prev === next ? prev : next));
      if (next < last) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, durationInFrames, fps, last, start]);

  // Derived, not stored: reduced motion is "show the end state", which is a
  // property of the read, not something the effect should have to write.
  return animate ? frame : last;
}
