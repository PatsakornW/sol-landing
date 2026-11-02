'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False on the server and through hydration, true from then on.
 *
 * The motion sections render a still version until this turns true, so the
 * server HTML and the first client render agree and anything that depends on
 * the browser (a reduced-motion preference, scroll position) only applies once
 * React owns the page. A component mounted later, after a client-side
 * navigation, gets true on its first render and skips the still version.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
