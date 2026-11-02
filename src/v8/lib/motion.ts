import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * When the page runs as one pinned stage scrubbed by the scroll: a wide screen
 * that allows motion. Anything else reads the blocks stacked. The layout's
 * inline script sets `html.is-stage` from the same test before first paint.
 */
export const STAGE_QUERY = '(min-width: 1024px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)';

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

