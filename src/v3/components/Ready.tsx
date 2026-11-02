'use client';

import { createContext, use, useEffect, useState, type ReactNode } from 'react';

const ReadyContext = createContext(false);

/**
 * The page's opening cue.
 *
 * The hero title rises line by line, then the bar, the rail and the lead fade
 * in behind it, and every one of those entrances is timed from the same
 * moment: when the faces have arrived, or after a short wait if they have
 * not. One provider counts that moment so the components agree on it.
 */
export function ReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const wait = new Promise<void>((resolve) => setTimeout(resolve, 900));
    Promise.race([fonts, wait]).then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  return <ReadyContext value={ready}>{children}</ReadyContext>;
}

/** True once the opening sequence may start. */
export function useReady(): boolean {
  return use(ReadyContext);
}
