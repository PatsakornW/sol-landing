import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** The width from which the page pins and scrubs; below it every block stacks. */
export const DESKTOP = '(min-width: 1024px)';

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A mouse or trackpad: the only case where things follow the pointer. */
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Two digits, the way the page counts: 1 → "01". */
export function pad(n: number): string {
  return String(n).padStart(2, '0');
}
