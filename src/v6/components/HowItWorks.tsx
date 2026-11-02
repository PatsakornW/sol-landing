'use client';

import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { icon, type IconName } from '../lib/assets';
import { gsap, ScrollTrigger } from '../lib/motion';
import { bp, C } from '../styles/candy.stylex';
import { Btn } from './Buttons';
import { Orb } from './Orb';
import { Sticker } from './Sticker';

const styles = stylex.create({
  /* Clipped sideways: the sticker waits off the right edge before it slides in,
     and a phone would otherwise widen the page to fit it. */
  section: { position: 'relative', zIndex: 1, backgroundColor: C.base, color: C.type, overflowX: 'clip' },
  /* Wide: one screen, the headline left, the shelf sliding on the right.
     Narrow: the headline, then the stack screen below it. */
  pin: {
    display: { default: 'grid', [bp.max991]: 'flex' },
    flexDirection: 'column',
    justifyContent: 'center',
    gridTemplateColumns: 'minmax(300px, 32vw) 1fr',
    height: { default: '100vh', [bp.max991]: 'auto' },
    minHeight: { default: 640, [bp.max991]: '100svh' },
    overflow: { default: 'hidden', [bp.max991]: 'visible' },
  },
  aside: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 18,
    paddingTop: { default: 100, [bp.max991]: 110 },
    paddingBottom: { default: 40, [bp.max991]: 28 },
    paddingInline: C.gutter,
  },
  h2: { margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: { default: 'clamp(48px, 5.6vw, 92px)', [bp.tablet]: 'clamp(64px, 10vw, 96px)' }, lineHeight: 0.92, textTransform: 'uppercase', color: C.type },
  lead: { margin: 0, maxWidth: '40ch', fontFamily: font.sans, fontWeight: 500, fontSize: { default: 'clamp(16px, 1.3vw, 19px)', [bp.tablet]: 22 }, lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.02em' },
  ctaRow: { marginTop: 6 },
  right: { position: 'relative', overflow: 'hidden', minWidth: 0, display: { default: 'block', [bp.max991]: 'none' } },
  track: { display: 'flex', height: '100%', paddingLeft: 'min(36vw, 520px)', willChange: 'transform' },
  /* The mark holds the left of the shelf; the panels slide behind it. */
  stage: { position: 'absolute', zIndex: 2, top: 0, left: 0, width: 'min(36vw, 520px)', display: 'grid', placeItems: 'center', height: '100%', paddingTop: 90, pointerEvents: 'none' },
  orb: { width: '100%', height: 'min(52vh, 480px)', filter: 'drop-shadow(0 30px 40px rgba(28, 24, 48, 0.35))' },
  panel: {
    position: 'relative',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'clamp(300px, 27vw, 420px)',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gap: 12,
    padding: 'clamp(24px, 2.6vw, 40px)',
    paddingTop: 110,
    color: C.type,
    overflow: 'hidden',
  },
  bg: (c: string) => ({ backgroundColor: c }),
  pIcon: { width: 'clamp(90px, 8vw, 130px)', height: 'auto', justifySelf: 'end', filter: 'drop-shadow(0 14px 20px rgba(28, 24, 48, 0.3))' },
  word: { margin: 0, alignSelf: 'start', fontFamily: font.display, fontWeight: 400, fontSize: 'clamp(36px, 3.4vw, 56px)', lineHeight: 0.95, textTransform: 'uppercase' },
  q: { margin: 0, fontFamily: font.sans, fontWeight: 600, fontSize: { default: 'clamp(16px, 1.25vw, 19px)', [bp.tablet]: 21 }, lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.02em', opacity: 0.92 },
  price: { display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  cents: { fontFamily: font.display, fontSize: 'clamp(44px, 4vw, 68px)', lineHeight: 1 },
  implies: { fontFamily: font.sans, fontWeight: 600, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 },
  inkText: { color: C.base },

  /* Narrow: one screen that pins while the panels pile up as cards, one over
     the last, until the hand is complete and the page moves on. */
  stack: {
    display: { default: 'none', [bp.max991]: 'grid' },
    paddingTop: 4,
    paddingBottom: 'clamp(28px, 5vh, 48px)',
    paddingInline: C.gutter,
  },
  stackStill: {},
  deck: { position: 'relative', display: 'grid' },
  deckStill: { display: 'block' },
  /* The cards share one grid cell, so the pile is as tall as its tallest card. */
  pile: { position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)' },
  pileStill: { display: 'grid', gap: 12 },
  card: {
    position: 'relative',
    gridArea: '1 / 1',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateColumns: '1fr auto',
    gap: { default: 10, [bp.tablet]: 16 },
    minHeight: { default: 0, [bp.tablet]: 300 },
    padding: { default: 22, [bp.tablet]: 32 },
    borderRadius: 18,
    color: C.type,
    boxShadow: '0 -8px 30px -10px rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    willChange: 'transform',
  },
  cardStill: { gridArea: 'auto' },
  cIcon: { width: { default: 72, [bp.tablet]: 110 }, height: 'auto', gridRow: '1 / span 2', gridColumn: 2, justifySelf: 'end', filter: 'drop-shadow(0 14px 20px rgba(28, 24, 48, 0.3))' },
  cWord: { margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: { default: 'clamp(30px, 8vw, 44px)', [bp.tablet]: 60 }, lineHeight: 0.95, textTransform: 'uppercase' },
  cBottom: { gridColumn: '1 / span 2', alignSelf: 'end' },
  cCents: { fontFamily: font.display, fontSize: { default: 40, [bp.tablet]: 64 }, lineHeight: 1 },
});

export type HowPanel = { word: string; q: string; yes: number; icon: IconName; color: string; ink?: boolean };
export type HowLabels = { eyebrow: string; headline: string; suffix: string; lead: string; cta: string; yesLabel: string; implies: string; chance: string; panels: HowPanel[] };

const WIDE = '(min-width: 992px)';

/**
 * How it works. Wide screens pin one screen: the rolling headline's subjects
 * as a shelf of colour panels sliding past while the brand mark turns in
 * place and the headline holds on the left. Narrow screens put the headline
 * first, then pin a screen where the same panels arrive as cards, each
 * landing on the pile, until all are dealt and the page moves on. Both
 * shelves are in the document; the stylesheet shows one, so nothing is
 * rebuilt when the window changes.
 */
export function HowItWorks({ labels }: { labels: HowLabels }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [wide, setWide] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => {
      setWide(mq.matches);
      setStill(rm.matches);
    };
    on();
    mq.addEventListener('change', on);
    rm.addEventListener('change', on);
    return () => {
      mq.removeEventListener('change', on);
      rm.removeEventListener('change', on);
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || still) return;
    const ctx = gsap.context(() => {
      if (wide) {
        const pin = root.querySelector<HTMLElement>('[data-pin]');
        const right = root.querySelector<HTMLElement>('[data-right]');
        const track = root.querySelector<HTMLElement>('[data-track]');
        if (!pin || !right || !track) return;
        const distance = () => Math.max(0, track.scrollWidth - right.clientWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 0.8,
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.6}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progress.current = self.progress;
            },
          },
        });
        return;
      }
      const stack = root.querySelector<HTMLElement>('[data-pin]');
      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-card]'));
      if (!stack || cards.length === 0) return;
      // Each card after the first comes up from below and lands a little lower
      // on the pile; the one beneath shrinks back a touch.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stack, pin: true, scrub: 0.6, start: () => (stack.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'), end: () => `+=${Math.round(cards.length * window.innerHeight * 0.32)}`, invalidateOnRefresh: true },
      });
      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.fromTo(card, { y: '110vh' }, { y: i * 10, ease: 'none', duration: 1 }, i - 1);
        tl.to(cards[i - 1] ?? card, { scale: 0.96, ease: 'none', duration: 1 }, i - 1);
      });
    }, root);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [wide, still]);

  const price = (p: HowPanel, cents: stylex.StyleXStyles) => (
    <div {...stylex.props(styles.price)}>
      <span {...stylex.props(cents)}>{p.yes}¢</span>
      <span {...stylex.props(styles.implies)}>
        {labels.yesLabel} · {labels.implies} {p.yes}% {labels.chance}
      </span>
    </div>
  );

  return (
    <section ref={ref} id="how-it-works" {...stylex.props(styles.section)} aria-labelledby="how-title">
      <div data-pin="" {...stylex.props(styles.pin)}>
        <aside {...stylex.props(styles.aside)}>
          <div>
            <Sticker>{labels.eyebrow}</Sticker>
          </div>
          <h2 id="how-title" {...stylex.props(styles.h2)} data-reveal="words">
            {labels.headline}
          </h2>
          <div data-reveal="slide-rotate" data-rotate="-3">
            <Sticker big bg="#DC74EC" fg="#14151D">
              {labels.suffix}
            </Sticker>
          </div>
          <p {...stylex.props(styles.lead)} data-reveal="lines" data-move="100%">
            {labels.lead}
          </p>
          <div {...stylex.props(styles.ctaRow)}>
            <Btn href="#join">{labels.cta}</Btn>
          </div>
        </aside>

        <div data-right="" {...stylex.props(styles.right)}>
          <div {...stylex.props(styles.stage)}>
            <div {...stylex.props(styles.orb)}>{wide ? <Orb progress={progress} spin={1} /> : null}</div>
          </div>
          <div data-track="" {...stylex.props(styles.track)}>
            {labels.panels.map((p) => (
              <div key={p.word} {...stylex.props(styles.panel, styles.bg(p.color), p.ink && styles.inkText)}>
                <img src={icon(p.icon)} alt="" {...stylex.props(styles.pIcon)} />
                <h3 {...stylex.props(styles.word)}>{p.word}</h3>
                <div>
                  <p {...stylex.props(styles.q)}>{p.q}</p>
                  {price(p, styles.cents)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-stack="" {...stylex.props(styles.stack, still && styles.stackStill)}>
          <div {...stylex.props(styles.deck, still && styles.deckStill)}>
            <div {...stylex.props(styles.pile, still && styles.pileStill)}>
            {labels.panels.map((p, i) => {
              const sx = stylex.props(styles.card, styles.bg(p.color), p.ink && styles.inkText, still && styles.cardStill);
              return (
                <div key={p.word} data-card="" {...sx} style={{ ...sx.style, zIndex: i + 1 }}>
                  <img src={icon(p.icon)} alt="" {...stylex.props(styles.cIcon)} />
                  <h3 {...stylex.props(styles.cWord)}>{p.word}</h3>
                  <p {...stylex.props(styles.q)}>{p.q}</p>
                  <div {...stylex.props(styles.cBottom)}>{price(p, styles.cCents)}</div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
