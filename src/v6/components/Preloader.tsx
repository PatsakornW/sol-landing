'use client';

import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { icon } from '../lib/assets';
import { BOUNCE, gsap, intro, preloaderPlan, reducedMotion } from '../lib/motion';
import { bp, C } from '../styles/candy.stylex';

const styles = stylex.create({
  curtain: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    backgroundColor: C.plate,
    overflow: 'hidden',
    display: { default: 'block', [bp.noScript]: 'none', [bp.reduce]: 'none' },
  },
  room: {
    position: 'relative',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
  },
  count: {
    fontFamily: font.display,
    fontSize: { default: 'clamp(96px, 18vw, 260px)', [bp.max760]: '24vw' },
    lineHeight: 1,
    color: C.type,
    fontVariantNumeric: 'tabular-nums',
  },
  coin: {
    position: 'absolute',
    top: '50%',
    width: { default: 'clamp(120px, 18vw, 260px)', [bp.max760]: '26vw' },
    height: 'auto',
    translate: '0 -50%',
    visibility: 'hidden',
  },
  left: { left: { default: '12%', [bp.max760]: '4%' }, top: { default: '50%', [bp.max760]: '30%' } },
  right: { right: { default: '12%', [bp.max760]: '4%' }, top: { default: '50%', [bp.max760]: '70%' } },
});

/**
 * The curtain: a cream sheet with a counter, and the Yes and No coins sliding
 * in from either side to meet it. It shrinks to a bar and fades. Every
 * entrance on the page waits for it, through `intro.delay`.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (reducedMotion()) {
      intro.delay = 0;
      root.remove();
      return;
    }
    const plan = preloaderPlan();
    const hold = plan.hold;
    intro.delay = hold + 0.3;
    const counter = root.querySelector<HTMLElement>('[data-counter]');
    const left = root.querySelector<HTMLElement>('[data-coin=left]');
    const right = root.querySelector<HTMLElement>('[data-coin=right]');
    const room = root.querySelector<HTMLElement>('[data-room]');
    const offset = window.matchMedia('(max-width: 991px)').matches ? '50vw' : '25vw';

    const ctx = gsap.context(() => {
      gsap.set([left, right], { visibility: 'visible' });
      gsap.from(left, { x: `-${offset}`, rotate: -120, duration: 1, ease: BOUNCE });
      gsap.from(right, { x: offset, rotate: 120, duration: 1, ease: BOUNCE });
      gsap.to(left, { x: `-${offset}`, rotate: -120, duration: 0.8, ease: BOUNCE, delay: hold - 0.8 });
      gsap.to(right, { x: offset, rotate: 120, duration: 0.8, ease: BOUNCE, delay: hold - 0.8 });

      // The count runs in a few uneven steps with short pauses, like a real load.
      const steps = 4;
      const run = (hold - 0.5) * 0.8;
      const pause = ((hold - 0.5) * 0.2) / (steps - 1);
      const weights = Array.from({ length: steps }, () => 0.6 + Math.random() * 0.8);
      const sum = weights.reduce((a, b) => a + b, 0);
      const state = { value: plan.from };
      let acc = plan.from;
      const tl = gsap.timeline();
      weights.forEach((w, i) => {
        acc = i === steps - 1 ? 100 : acc + (100 - plan.from) * (w / sum);
        tl.to(state, {
          value: acc,
          duration: run * (w / sum),
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counter) counter.textContent = `${Math.round(state.value)}%`;
          },
        });
        if (i < steps - 1) tl.to({}, { duration: pause });
      });
      gsap.to(counter, { scale: 0, duration: 0.5, ease: BOUNCE, delay: hold - 0.5 });

      gsap
        .timeline()
        .to(room, { height: 65, duration: 0.8, ease: 'power3.out' }, hold)
        .to(root, { height: 0, duration: 0.8, ease: 'sine.in' }, hold)
        .to(root, { opacity: 0, duration: 0.3, ease: 'sine.in' }, hold + 0.8)
        .set(root, { display: 'none' }, hold + 1.1);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} {...stylex.props(styles.curtain)} aria-hidden="true">
      <div data-room="" {...stylex.props(styles.room)}>
        <img data-coin="left" src={icon('yes')} alt="" {...stylex.props(styles.coin, styles.left)} />
        <b data-counter="" {...stylex.props(styles.count)}>
          0%
        </b>
        <img data-coin="right" src={icon('no')} alt="" {...stylex.props(styles.coin, styles.right)} />
      </div>
    </div>
  );
}
