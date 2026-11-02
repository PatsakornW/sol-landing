'use client';

import { useEffect, useRef, useState } from 'react';
import { impactItems, t7 } from '../i18n/messages';
import { gsap, pad } from '../lib/motion';
import { ArrowDown } from './Icons';
import { scrollToTarget } from './Smooth';

/* The backdrop walks from the mark's blue to its pink, one step per figure. */
const STEPS = ['#1E69F6', '#4C5CF0', '#8250E4', '#B447D2'];

/**
 * How it works, in four figures. The block pins for four screens; each one
 * rolls the number in the white pill to the next figure, moves the line on
 * the right up, and shifts the colour behind.
 */
export function Impact() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const items = impactItems();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stage = el.querySelector<HTMLElement>('.impact__stage')!;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (st) => setActive(Math.min(items.length - 1, Math.floor(st.progress * items.length))),
      },
    });
    STEPS.slice(1).forEach((c) => tl.to(stage, { backgroundColor: c, duration: 1 }));
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [items.length]);

  const next = () => {
    const el = root.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const to = active + 1 < items.length ? el.offsetTop + (span * (active + 1.02)) / items.length : el.offsetTop + el.offsetHeight;
    scrollToTarget(to);
  };

  return (
    <section ref={root} className="impact" id="how" data-nav="dark">
      <div className="impact__stage">
        <p className="impact__label">
          {t7('how.eyebrow')}
          <br />
          {pad(active + 1)} • {pad(items.length)}
        </p>
        <div className="impact__pill" aria-hidden="true">
          <div className="impact__roll" style={{ '--n': active } as React.CSSProperties}>
            {items.map((it) => (
              <span key={it.value}>{it.value}</span>
            ))}
          </div>
        </div>
        <button type="button" className="impact__next" onClick={next} aria-label={t7('impact.next')}>
          <ArrowDown />
        </button>
        <ol className="impact__list" style={{ '--n': active } as React.CSSProperties}>
          {items.map((it, i) => (
            <li key={it.value} className={i === active ? 'is-on' : i < active ? 'is-past' : undefined} aria-current={i === active || undefined}>
              {it.text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
