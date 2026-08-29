'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks a media query, live.
 *
 * Starts `false` so the server render and the first client render agree — the
 * effect corrects it before the subscribing section can be interacted with.
 * Callers that need "true unless proven otherwise" must invert the query.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);

  return matches;
}
