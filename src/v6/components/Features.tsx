'use client';

import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { icon, type IconName } from '../lib/assets';
import { gsap, ScrollTrigger } from '../lib/motion';
import { bp, C } from '../styles/candy.stylex';
import { RoundBtn } from './Buttons';
import { Sticker } from './Sticker';

const styles = stylex.create({
  section: { position: 'relative', zIndex: 1 },
  head: {
    backgroundColor: C.base,
    paddingTop: 'clamp(80px, 12vh, 140px)',
    paddingBottom: 'clamp(40px, 8vh, 90px)',
    paddingInline: C.gutter,
    textAlign: 'center',
    display: 'grid',
    justifyItems: 'center',
    gap: 18,
  },
  h2: {
    margin: 0,
    maxWidth: '14ch',
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 'clamp(40px, 6.5vw, 96px)',
    lineHeight: 0.95,
    textTransform: 'uppercase',
    color: C.type,
    textWrap: 'balance',
  },
  sub: { margin: 0, maxWidth: '56ch', fontSize: 'clamp(17px, 1.4vw, 21px)', lineHeight: 1.4, fontWeight: 500, color: C.type, textTransform: 'uppercase', letterSpacing: '0.02em' },
  panel: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    paddingTop: 110,
    paddingBottom: 'clamp(28px, 5vh, 56px)',
    paddingInline: C.gutter,
    color: C.type,
  },
  bg: (c: string) => ({ backgroundColor: c }),
  inkText: { color: C.base },
  word: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: 0,
    fontFamily: font.display,
    fontSize: 'clamp(140px, 34vw, 640px)',
    lineHeight: 1,
    textTransform: 'uppercase',
    color: C.type,
    opacity: 0.32,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    userSelect: 'none',
    transform: 'translate(-50%, -50%)',
  },
  top: { position: 'relative', zIndex: 1, display: 'flex', justifyContent: { default: 'flex-start', [bp.max760]: 'center' } },
  middle: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateColumns: { default: '1fr auto 1fr', [bp.max760]: '1fr' },
    alignItems: 'center',
    gap: 'clamp(16px, 3vw, 48px)',
    paddingBlock: 20,
  },
  facts: {
    margin: 0,
    display: 'grid',
    gap: 14,
    justifySelf: { default: 'end', [bp.max760]: 'center' },
    textAlign: { default: 'right', [bp.max760]: 'center' },
    maxWidth: 260,
  },
  dt: { fontFamily: font.sans, fontWeight: 600, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8 },
  dd: { margin: 0, marginTop: 2, fontFamily: font.sans, fontWeight: 700, fontSize: 'clamp(16px, 1.3vw, 20px)', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.03em' },
  icon: {
    width: 'clamp(200px, 40vh, 460px)',
    height: 'auto',
    justifySelf: 'center',
    filter: 'drop-shadow(0 30px 40px rgba(28, 24, 48, 0.35))',
    order: { default: 0, [bp.max760]: -1 },
  },
  action: { justifySelf: { default: 'start', [bp.max760]: 'center' } },
  bottom: { position: 'relative', zIndex: 1, textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 10 },
  title: { margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: 'clamp(28px, 3.6vw, 54px)', lineHeight: 1, textTransform: 'uppercase' },
  desc: { margin: 0, maxWidth: '64ch', fontFamily: font.sans, fontWeight: 500, fontSize: 'clamp(16px, 1.35vw, 20px)', lineHeight: 1.35, textTransform: 'uppercase', letterSpacing: '0.02em' },
});

export type Feature = { key: string; href: string; mark: string; label: string; title: string; desc: string; facts: { label: string; value: string }[]; icon: IconName; color: string; ink?: boolean };
export type FeaturesLabels = { eyebrow: string; title: string; sub: string; more: string; items: Feature[] };

/**
 * The four claims as four shelves: each a whole screen in its own colour,
 * the claim's short mark set huge behind it, its 3D piece in the middle with
 * its three facts beside it, and the claim and its line at the foot.
 */
export function Features({ labels }: { labels: FeaturesLabels }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
        const word = panel.querySelector('[data-word]');
        const piece = panel.querySelector('[data-piece]');
        gsap.fromTo(word, { x: 0, y: 0, xPercent: -58, yPercent: -50 }, { x: 0, y: 0, xPercent: -42, yPercent: -50, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from(piece, { y: '70vh', rotate: 26, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: panel, start: 'top 75%', once: true } });
      });
    });
    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={ref} id="feature" {...stylex.props(styles.section)} aria-labelledby="feature-title">
      <div {...stylex.props(styles.head)}>
        <Sticker>{labels.eyebrow}</Sticker>
        <h2 id="feature-title" {...stylex.props(styles.h2)} data-reveal="words">
          {labels.title}
        </h2>
        <p {...stylex.props(styles.sub)} data-reveal="lines" data-move="100%">
          {labels.sub}
        </p>
      </div>
      {labels.items.map((f) => (
        <article key={f.key} data-panel="" {...stylex.props(styles.panel, styles.bg(f.color), f.ink && styles.inkText)} aria-labelledby={`feature-${f.key}`}>
          <p data-word="" {...stylex.props(styles.word)} aria-hidden="true">
            {f.mark}
          </p>
          <div {...stylex.props(styles.top)}>
            <span data-reveal="slide-rotate" data-rotate="-4">
              <Sticker big>{f.label}</Sticker>
            </span>
          </div>
          <div {...stylex.props(styles.middle)}>
            <dl {...stylex.props(styles.facts)}>
              {f.facts.map((fact) => (
                <div key={fact.label} data-reveal="up" data-group={`facts-${f.key}`} data-move="80%" data-rotate="0">
                  <dt {...stylex.props(styles.dt)}>{fact.label}</dt>
                  <dd {...stylex.props(styles.dd)}>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <img data-piece="" src={icon(f.icon)} alt="" {...stylex.props(styles.icon)} />
            <div {...stylex.props(styles.action)}>
              <RoundBtn href={f.href}>{labels.more}</RoundBtn>
            </div>
          </div>
          <div {...stylex.props(styles.bottom)}>
            <h3 id={`feature-${f.key}`} {...stylex.props(styles.title)} data-reveal="words">
              {f.title}
            </h3>
            <p {...stylex.props(styles.desc)} data-reveal="lines" data-move="100%">
              {f.desc}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
