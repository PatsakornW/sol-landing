'use client';

import { useEffect, useRef, useState } from 'react';
import { icon3d } from '../lib/content';
import { lockScroll } from './Smooth';

/** The least time the curtain stays, so a fast load does not flash it. */
const MIN_MS = 1100;

/** How long the fill takes to top up once the hero is ready. */
const FILL_MS = 450;

/**
 * The opening curtain: only the mark in 3D, bobbing over the hero's blue. A
 * pale copy sits underneath and the full-colour mark fills it from the bottom
 * up as the load goes on, so the logo itself is the progress. It holds until
 * the hero's scene has drawn its first frame, fills to the top, then fades
 * away and calls `onDone` so the hero can come in.
 * Rendered in the static HTML, so it covers the page before any script runs;
 * a CSS fallback lifts it on its own if the scripts never do.
 */
export function Loader({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const mark = useRef<HTMLDivElement>(null);
  const shown = useRef(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    shown.current = performance.now();
    lockScroll(true);
    return () => lockScroll(false);
  }, []);

  // The fill runs on the clock, not on frames, so a device busy building the
  // scene cannot stall it: it eases toward 90% while loading, then tops up in
  // FILL_MS once ready, and the curtain lifts on a timer.
  useEffect(() => {
    let frame = 0;
    const from = Number(mark.current?.style.getPropertyValue('--p') || 0);
    const t0 = performance.now();
    const at = (now: number) => {
      if (!ready) return Math.max(from, 0.9 * (1 - Math.exp(-(now - shown.current) / 1600)));
      return from + (1 - from) * Math.min(1, (now - t0) / FILL_MS);
    };
    const tick = (now: number) => {
      mark.current?.style.setProperty('--p', String(at(now)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    let lift = 0;
    if (ready) {
      const wait = Math.max(FILL_MS, MIN_MS - (performance.now() - shown.current));
      lift = window.setTimeout(() => setLeaving(true), wait + 120);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(lift);
    };
  }, [ready]);

  useEffect(() => {
    if (!leaving) return;
    lockScroll(false);
    onDone();
    const t = window.setTimeout(() => setGone(true), 900);
    return () => window.clearTimeout(t);
  }, [leaving, onDone]);

  if (gone) return null;
  return (
    <div className={`loader${leaving ? ' is-done' : ''}`} aria-hidden="true">
      <div ref={mark} className="loader__mark">
        <img className="loader__ghost" src={icon3d('sun')} alt="" />
        <img className="loader__fill" src={icon3d('sun')} alt="" />
      </div>
    </div>
  );
}
