'use client';

import { useEffect } from 'react';

// A scroll counts as finished after this long without a scroll event.
const SETTLE_MS = 160;
// Corrections stop after this long; by then the page has its full height.
const WATCH_MS = 2500;
// Off by more than this (px), the landing is corrected.
const TOLERANCE = 12;
const TAKE_OVER = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/**
 * Lands an in-page link (`/#faq`) on its target. On a direct load the browser
 * jumps to the fragment as soon as the HTML is parsed, before the motion
 * sections take their full height after hydration, so it lands short. Once the
 * page is still, this checks the target sits where `scroll-padding-top` and its
 * own `scroll-margin-top` put it, and jumps there if not. An arrival through a
 * client-side link (Next scrolls itself) already lands true and is left alone.
 * Any wheel, touch, key or press hands control back at once.
 */
export function useHashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let timer = 0;

    const check = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      if (Math.abs(el.getBoundingClientRect().top - (pad + margin)) > TOLERANCE) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(check, SETTLE_MS);
    };
    const stop = () => {
      window.clearTimeout(timer);
      window.clearTimeout(end);
      window.removeEventListener('scroll', onScroll);
      for (const type of TAKE_OVER) window.removeEventListener(type, stop);
    };

    for (const type of TAKE_OVER) window.addEventListener(type, stop, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    timer = window.setTimeout(check, SETTLE_MS);
    const end = window.setTimeout(stop, WATCH_MS);
    return stop;
  }, []);
}
