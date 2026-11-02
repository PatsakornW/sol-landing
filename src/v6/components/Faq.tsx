'use client';

import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { gsap, ScrollTrigger } from '../lib/motion';
import { bp, C } from '../styles/candy.stylex';
import { Btn } from './Buttons';
import { Sticker } from './Sticker';

const styles = stylex.create({
  section: { position: 'relative', zIndex: 1, backgroundColor: C.plate, color: C.type, paddingTop: { default: 110, [bp.max991]: 'clamp(80px, 12vh, 140px)' }, paddingBottom: 'clamp(40px, 6vh, 80px)', overflow: 'hidden', minHeight: { default: '100vh', [bp.max991]: 0 }, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gridTemplateRows: { default: 'auto 1fr', [bp.max991]: 'auto auto' }, alignContent: 'start' },
  head: { textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 16, paddingInline: C.gutter },
  h2: { margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: 'clamp(44px, 7vw, 110px)', lineHeight: 0.95, textTransform: 'uppercase' },
  lead: { margin: 0, maxWidth: '50ch', fontFamily: font.sans, fontWeight: 500, fontSize: 'clamp(16px, 1.3vw, 19px)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.02em' },
  row: {
    display: 'flex',
    flexDirection: { default: 'row', [bp.max991]: 'column' },
    gap: 18,
    width: { default: 'max-content', [bp.max991]: 'auto' },
    marginTop: 'clamp(28px, 5vh, 56px)',
    paddingInline: C.gutter,
    alignSelf: 'center',
    justifySelf: 'start',
    willChange: 'transform',
  },
  card: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: { default: 'clamp(320px, 30vw, 440px)', [bp.max991]: 'auto' },
    minHeight: { default: 360, [bp.max991]: 0 },
    padding: 'clamp(22px, 2.4vw, 32px)',
    borderRadius: 22,
    color: C.type,
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr',
    gap: 12,
  },
  bg: (c: string) => ({ backgroundColor: c }),
  inkText: { color: C.base },
  num: { fontFamily: font.display, fontSize: 40, lineHeight: 1, opacity: 0.55 },
  q: { margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: 'clamp(24px, 2.2vw, 32px)', lineHeight: 1.02, textTransform: 'uppercase' },
  a: { margin: 0, fontFamily: font.sans, fontWeight: 500, fontSize: 'clamp(15px, 1.15vw, 17px)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.02em', alignSelf: 'end', opacity: 0.95 },
});

const COLOURS: { c: string; ink?: boolean }[] = [
  { c: '#1E69F6' },
  { c: '#DC74EC', ink: true },
  { c: '#1B1F4A' },
  { c: '#8DB8FF', ink: true },
  { c: '#8A2FA6' },
  { c: '#143F9E' },
];

export type FaqLabels = { eyebrow: string; title: string; lead: string; cta: string; ctaHref: string; items: { id: string; q: string; a: string }[] };

/**
 * The questions as a shelf of cards that slides across as the page goes by,
 * every answer in the open. On phones the shelf is a column.
 */
export function Faq({ labels }: { labels: FaqLabels }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
      const row = root.querySelector<HTMLElement>('[data-row]')!;
      const distance = () => Math.max(0, row.scrollWidth - root.clientWidth);
      gsap.to(row, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: root, pin: true, start: 'top top', end: () => `+=${distance() + 200}`, scrub: 0.6, invalidateOnRefresh: true },
      });
    });
    ScrollTrigger.sort();
    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={ref} id="faq" {...stylex.props(styles.section)} aria-labelledby="faq-title">
      <div {...stylex.props(styles.head)}>
        <Sticker>{labels.eyebrow}</Sticker>
        <h2 id="faq-title" {...stylex.props(styles.h2)} data-reveal="chars">
          {labels.title}
        </h2>
        <p {...stylex.props(styles.lead)} data-reveal="words">
          {labels.lead}
        </p>
        <Btn href={labels.ctaHref}>{labels.cta}</Btn>
      </div>
      <dl data-row="" {...stylex.props(styles.row)}>
        {labels.items.map((item, i) => {
          const tone = COLOURS[i % COLOURS.length] ?? { c: '#1E69F6' };
          return (
            <div key={item.id} {...stylex.props(styles.card, styles.bg(tone.c), tone.ink && styles.inkText)} data-reveal="up" data-group="faq" data-move="30%" data-rotate="0" data-stagger="0.5">
              <span {...stylex.props(styles.num)} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <dt {...stylex.props(styles.q)}>{item.q}</dt>
              <dd {...stylex.props(styles.a)}>{item.a}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
