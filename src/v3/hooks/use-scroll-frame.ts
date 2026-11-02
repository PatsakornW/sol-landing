'use client';

import { useEffect } from 'react';

export const clamp01 = (value: number, low = 0, high = 1) =>
  Math.min(high, Math.max(low, value));

/**
 * Where `el` is on its way through the viewport, as 0 → 1.
 *
 * Both ends are given in viewport heights measured from the top: the value is
 * 0 while the element's top edge is still below `start` screens and 1 once it
 * has risen above `end` screens.
 */
export function progress(el: Element, start: number, end: number): number {
  const top = el.getBoundingClientRect().top;
  const height = window.innerHeight;
  return clamp01((start * height - top) / ((start - end) * height));
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs `update` once per frame the page has scrolled or resized, and once on
 * mount.
 *
 * The scroll listener only books a frame; the measuring happens inside it, so
 * a fast wheel never queues more than one layout read. `update` receives the
 * reader's motion preference so each scene can hold still for a reader who
 * asked it to.
 */
export function useScrollFrame(update: (reduce: boolean) => void) {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let frame = 0;
    const run = () => {
      frame = 0;
      update(reduce);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    run();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [update]);
}
