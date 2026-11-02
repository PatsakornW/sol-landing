'use client';

import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { icon } from '../lib/assets';
import { gsap, reducedMotion } from '../lib/motion';
import { C } from '../styles/candy.stylex';

const styles = stylex.create({
  band: { position: 'relative', zIndex: 1, backgroundColor: C.base, height: 'clamp(220px, 30vw, 440px)', overflow: 'hidden' },
  svg: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  peek: { position: 'absolute', bottom: '-12%', width: 'clamp(120px, 16vw, 240px)', height: 'auto', filter: 'drop-shadow(0 18px 24px rgba(28, 24, 48, 0.25))' },
  left: { left: '-3%' },
  right: { right: '-3%' },
});

const REPEAT = 8;

/**
 * A yellow banner curving across the page with the headline running along
 * it. Scrolling or wheeling pushes the words along the curve, and they coast
 * to a stop; the Yes and No coins peek up from the corners and tip as the
 * band passes.
 */
export function Ribbon({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const line = `${text.toUpperCase()}  •  `;

  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion()) return;
    const tp = root.querySelector<SVGTextPathElement>('textPath')!;
    const textEl = tp.closest('text')!;
    let repeatLen = 800;
    const recalc = () => {
      try {
        repeatLen = textEl.getComputedTextLength() / REPEAT;
      } catch {
        /* keep the last value */
      }
    };
    document.fonts.ready.then(recalc).catch(() => {});
    recalc();

    let px = 0;
    let velocity = 0;
    let raf = 0;
    let lastY = window.scrollY;
    const tick = () => {
      velocity *= 0.95;
      px = (((px + velocity) % repeatLen) + repeatLen) % repeatLen;
      tp.setAttribute('startOffset', `${-px}px`);
      if (Math.abs(velocity) > 0.02) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const push = (delta: number) => {
      velocity = Math.max(-300, Math.min(300, velocity + delta * 0.012));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onWheel = (e: WheelEvent) => push(e.deltaY);
    const onScroll = () => {
      const y = window.scrollY;
      push((y - lastY) * 1.2);
      lastY = y;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalc);

    const ctx = gsap.context(() => {
      gsap.fromTo('[data-peek=left]', { rotate: -28, yPercent: 30 }, { rotate: 10, yPercent: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('[data-peek=right]', { rotate: 28, yPercent: 30 }, { rotate: -10, yPercent: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalc);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} {...stylex.props(styles.band)} aria-hidden="true">
      <svg {...stylex.props(styles.svg)} viewBox="0 0 1440 440" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id="v6-curve" d="M -200 360 Q 720 40 1640 360" />
        </defs>
        <use href="#v6-curve" fill="none" stroke="#DC74EC" strokeWidth="150" />
        <text fontFamily="var(--font-anton), Anton, Impact, sans-serif" fontSize="118" fill="#14151D" dominantBaseline="middle" letterSpacing="4">
          <textPath href="#v6-curve" startOffset="0">
            {line.repeat(REPEAT)}
          </textPath>
        </text>
      </svg>
      <img data-peek="left" src={icon('yes')} alt="" {...stylex.props(styles.peek, styles.left)} />
      <img data-peek="right" src={icon('no')} alt="" {...stylex.props(styles.peek, styles.right)} />
    </section>
  );
}
