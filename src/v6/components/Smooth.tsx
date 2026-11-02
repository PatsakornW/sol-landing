'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion';

let current: Lenis | null = null;

/** The running Lenis, for the drawer to stop and the anchors to use. */
export function lenis(): Lenis | null {
  return current;
}

/** Scroll to an element, through Lenis when it runs, natively otherwise. */
export function scrollToTarget(target: string | HTMLElement, offset = -72) {
  if (current) {
    current.start();
    current.scrollTo(target, { offset, duration: 1.4, force: true });
  }
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  else target.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Smooth scrolling for the whole document, on GSAP's ticker so ScrollTrigger
 * and Lenis agree on every frame. Off under reduced motion. Anchor links are
 * taken over so a jump glides.
 */
export function Smooth() {
  useEffect(() => {
    if (reducedMotion()) return;
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      touchMultiplier: 1.5,
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
