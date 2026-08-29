'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Starts the reveal slightly before the row is fully in view. */
const ROOT_MARGIN = '0px 0px -18% 0px';

/**
 * Latches true the first time `ref` is near the fold and never unlatches — the
 * clips these sections hold are a play-once reveal, so an element that scrolls
 * back out must not rewind and replay on the way down again. Observers
 * self-disconnect on the first intersection.
 *
 * Without `IntersectionObserver` the latch opens immediately: the CSS reveal is
 * keyed off the latched attribute, so failing closed would hide the section.
 */
export function useRevealed(ref: RefObject<HTMLElement | null>): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return revealed;
}
