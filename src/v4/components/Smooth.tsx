'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion';

let current: Lenis | null = null;

/** Stop or restart the page's scrolling while a dialog is open. */
export function lockScroll(on: boolean) {
  if (current) {
    if (on) current.stop();
    else current.start();
  }
  document.documentElement.classList.toggle('is-locked', on);
}

/** Scroll to an element or a y offset, through Lenis when it runs; `onComplete` fires on arrival. */
export function scrollToTarget(target: string | HTMLElement | number, onComplete?: () => void) {
  if (current) {
    current.start();
    current.scrollTo(target, { duration: 1.4, force: true, onComplete });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  else target.scrollIntoView({ behavior: 'smooth' });
  if (onComplete) window.setTimeout(onComplete, 900);
}

/**
 * Smooth scrolling for the whole document, on GSAP's ticker so ScrollTrigger
 * and Lenis agree on every frame. Off under reduced motion and on touch
 * screens. Anchor links are taken over so a jump glides.
 */
export function Smooth() {
  useEffect(() => {
    // On a touch screen the browser's own scrolling is smooth already, and Lenis
    // would stand between a swipe and the sliders that take it.
    if (reducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });
    current = instance;
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', href);
      scrollToTarget(el);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      instance.destroy();
      current = null;
    };
  }, []);
  return null;
}
