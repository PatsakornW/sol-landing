'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { icon, type IconName } from '../lib/assets';
import { gsap, ScrollTrigger } from '../lib/motion';
import { bp, C } from '../styles/candy.stylex';
import { Sticker } from './Sticker';

/* The app's card: a fixed height, a point below the card to turn about. */
const CARD_H = 232;
const ORIGIN_Y = 1.2;
/* Below this width the two end cards are dropped: seven do not fit a phone. */
const NARROW = 560;

const ping = stylex.keyframes({
  '0%': { boxShadow: '0 0 0 0 rgba(235, 235, 235, 0.7)' },
  '75%': { boxShadow: '0 0 0 5px rgba(235, 235, 235, 0)' },
  '100%': { boxShadow: '0 0 0 5px rgba(235, 235, 235, 0)' },
});

const styles = stylex.create({
  section: { position: 'relative', zIndex: 1, backgroundColor: C.base, color: C.type, overflowX: 'clip' },
  /* Wide screens pin the stage and deal the cards with the scroll; the
     runway is the scroll that does the dealing. Narrow screens scroll on. */
  runway: (n: number) => ({ height: `calc(100vh + ${n * 30}vh)` }),
  stage: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    alignContent: 'start',
    paddingTop: 100,
    paddingBottom: { default: 0, [bp.max991]: 16 },
    paddingInline: C.gutter,
  },
  pinned: { position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' },
  head: { textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 14 },
  h2: { margin: 0, maxWidth: '16ch', fontFamily: font.display, fontWeight: 400, fontSize: 'clamp(40px, 6.5vw, 96px)', lineHeight: 0.95, textTransform: 'uppercase', color: C.type, textWrap: 'balance' },
  sub: { margin: 0, maxWidth: '60ch', fontFamily: font.sans, fontWeight: 500, fontSize: 'clamp(15px, 1.2vw, 18px)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.02em', color: C.typeSoft },
  /* The fan: cards on an arc, each placed by the scroll. */
  fan: { position: 'relative', width: '100%', maxWidth: 1200, marginInline: 'auto', marginTop: 'clamp(28px, 5vh, 56px)', alignSelf: 'center' },
  slot: { position: 'absolute', top: 0, left: 'calc(50% - var(--fan-card-w) / 2)', width: 'var(--fan-card-w)', height: CARD_H, transformOrigin: `50% ${ORIGIN_Y * 100}%`, willChange: 'transform', visibility: 'hidden' },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    height: CARD_H,
    padding: 16,
    overflow: 'hidden',
    borderRadius: 18,
    color: C.type,
    boxShadow: { default: '0 22px 44px -16px rgba(0, 0, 0, 0.7)', ':hover': { default: null, [bp.hover]: '0 0 0 3px rgba(235, 235, 235, 0.9), 0 30px 60px -16px rgba(0, 0, 0, 0.85)' } },
    fontFamily: font.sans,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',
    transformOrigin: `50% ${ORIGIN_Y * 100}%`,
    transform: { default: 'none', ':hover': { default: null, [bp.hover]: 'translateY(-14px) scale(1.05)' } },
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '0.38s',
    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  bg: (c: string) => ({ backgroundColor: c }),
  inkText: { color: C.base },
  cover: { padding: 0 },
  /* Header: thumb + title; it takes the free height so body and footer sit low. */
  cardHead: { display: 'flex', flexGrow: 1, flexShrink: 1, flexBasis: 'auto', alignItems: 'flex-start', gap: 10, minHeight: 0 },
  title: { display: '-webkit-box', minWidth: 0, overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: 17, lineHeight: 1.1, letterSpacing: '0.01em', textWrap: 'balance' },
  title2: { WebkitLineClamp: 2 },
  /* The picture slot: a darker plate in the card's own colour, the 3D piece on it. */
  ph: { position: 'relative', display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 10, backgroundColor: 'rgba(0, 0, 0, 0.28)', boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.12)' },
  thumb: { width: 44, height: 44 },
  thumbIcon: { width: 34, height: 34, filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))' },
  body: { display: 'flex', flexShrink: 0, flexDirection: 'column', gap: 8 },
  chance: { display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0, lineHeight: 1 },
  pct: { flexShrink: 0, fontFamily: font.display, fontWeight: 400, fontSize: 28, letterSpacing: 0 },
  caption: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, overflow: 'hidden', fontSize: 12, letterSpacing: '0.08em', whiteSpace: 'nowrap', textOverflow: 'ellipsis', opacity: 0.8 },
  move: { display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 700 },
  /* Yes and No: the page's pills, a light one and a dark one. */
  pair: { display: 'flex', gap: 8 },
  fbtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' },
  wide: { flexGrow: 1, flexShrink: 1, flexBasis: 0, height: 38 },
  compact: { flexShrink: 0, width: 46, height: 28, fontSize: 12, borderRadius: 8 },
  yes: { backgroundColor: C.type, color: C.blue },
  no: { backgroundColor: C.base, color: C.pinkLight },
  rows: { display: 'flex', flexShrink: 0, flexDirection: 'column', gap: 4 },
  row: { display: 'flex', alignItems: 'center', gap: 8, height: 32, minWidth: 0, fontSize: 13 },
  avatar: { display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.28)', fontFamily: font.display, fontSize: 11, fontWeight: 400 },
  oname: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  opct: { flexShrink: 0, width: 44, fontFamily: font.display, fontWeight: 400, fontSize: 16, textAlign: 'right' },
  result: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 38, paddingInline: 12, borderRadius: 10, backgroundColor: C.type, color: C.base },
  badge: { display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', color: '#FFFFFF', fontSize: 12 },
  pending: { backgroundColor: C.pink },
  won: { backgroundColor: C.blue },
  resultLabel: { overflow: 'hidden', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  foot: { display: 'flex', flexShrink: 0, alignItems: 'center', gap: 8, height: 22, overflow: 'hidden', fontSize: 12, letterSpacing: '0.06em', whiteSpace: 'nowrap', opacity: 0.8 },
  live: { display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, lineHeight: 1 },
  dot: { width: 7, height: 7, borderRadius: '50%', backgroundColor: 'currentColor', animationName: { default: ping, [bp.reduce]: 'none' }, animationDuration: '1.4s', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)', animationIterationCount: 'infinite' },
  /* The headline cover: the picture fills the card, the meter sits top-right. */
  coverBox: { position: 'relative', flexGrow: 1, flexShrink: 1, flexBasis: 'auto', overflow: 'hidden', borderRadius: 'inherit' },
  coverPh: { position: 'absolute', inset: 0, borderRadius: 0, alignItems: 'flex-start', paddingTop: 40, boxShadow: 'none', backgroundColor: 'transparent', backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 7px, rgba(255,255,255,0.06) 7px 8px), radial-gradient(120% 120% at 100% 0%, rgba(255,255,255,0.18), transparent 60%)' },
  coverIcon: { width: 56, height: 56, filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))' },
  scrim: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.25) 40%, transparent 70%)' },
  meter: { position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 60, padding: '6px 8px', borderRadius: 10, backgroundColor: C.type, color: C.base, lineHeight: 1 },
  meterPct: { fontFamily: font.display, fontWeight: 400, fontSize: 22 },
  meterBar: { display: 'flex', width: '100%', height: 4, marginTop: 5, overflow: 'hidden', borderRadius: 2, backgroundColor: C.pink },
  meterFill: (p: number) => ({ width: `${p}%`, height: '100%', backgroundColor: C.blue }),
  masthead: { position: 'absolute', right: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column', gap: 4, padding: 12, color: '#FFFFFF' },
  kicker: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1.2, opacity: 0.85 },
  coverTitle: { display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, margin: 0, fontFamily: font.display, fontWeight: 400, fontSize: 18, lineHeight: 1.1, letterSpacing: '0.01em' },
});

/* Each category's colour on the shelf, and whether its text is dark. */
const TONES = {
  crypto: { c: '#8A2FA6' },
  politics: { c: '#1E69F6' },
  sports: { c: '#143F9E' },
  culture: { c: '#DC74EC', ink: true },
  tech: { c: '#1B1F4A' },
  economy: { c: '#8DB8FF', ink: true },
} as const;

export type Tone = keyof typeof TONES;
export type MarketCard = {
  id: string;
  variant: 'series' | 'cover' | 'binary' | 'multi' | 'awaiting' | 'resolved';
  tone: Tone;
  q: string;
  yes: number;
  vol: string;
  end?: string;
  move?: number;
  icon: IconName;
  /** The cover card's kicker. */
  category?: string;
  outcomes?: { name: string; pct: number }[];
  up?: string;
  down?: string;
};
export type MarketsLabels = { eyebrow: string; title: string; sub: string; yes: string; no: string; chance: string; live: string; vol: string; awaiting: string; cards: MarketCard[] };

/** Where a card rests on the arc: `t` runs -1 (left end) to 1 (right end). */
function arc(t: number, cardW: number, width: number) {
  const spread = Math.min(width / 2 - cardW * 0.42, cardW * 2.55);
  return { x: t * spread, y: t * t * cardW * 0.5, rotate: t * 17 };
}

/**
 * The market cards, dealt onto an arc the way V5's fan opens. On wide screens
 * the stage pins and the scroll deals them, from the middle outward; on
 * narrow screens the page scrolls on and the hand opens once, as it comes
 * into view. Under reduced motion the hand is simply open.
 */
export function Markets({ labels }: { labels: MarketsLabels }) {
  const ref = useRef<HTMLElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 992px) and (prefers-reduced-motion: no-preference)');
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    const el = fanRef.current;
    const ro = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 1200));
    if (el) ro.observe(el);
    return () => {
      mq.removeEventListener('change', on);
      ro.disconnect();
    };
  }, []);

  const cards = width < NARROW ? labels.cards.slice(1, -1) : labels.cards;
  const n = cards.length;
  const mid = (n - 1) / 2;
  const cardW = Math.round(Math.min(288, Math.max(200, width * 0.23)));
  const height = Math.round(CARD_H + cardW * 0.55 + 16);

  useEffect(() => {
    const root = ref.current;
    const fan = fanRef.current;
    if (!root || !fan) return;
    const slots = Array.from(fan.querySelectorAll<HTMLElement>('[data-slot]'));
    const rest = (i: number) => arc((i - mid) / mid, cardW, fan.clientWidth);
    // Dealt from the middle outward, alternating sides.
    const order = slots.map((_, i) => i).toSorted((a, b) => Math.abs(a - mid) - Math.abs(b - mid) || a - b);
    const mm = gsap.matchMedia();
    mm.add(
      { wide: '(min-width: 992px) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 991px) and (prefers-reduced-motion: no-preference)', still: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { wide: isWide, still } = ctx.conditions as { wide: boolean; narrow: boolean; still: boolean };
        gsap.set(slots, { visibility: 'visible' });
        if (still) {
          slots.forEach((slot, i) => gsap.set(slot, rest(i)));
          return;
        }
        if (isWide) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true } });
          order.forEach((i, k) => {
            const slot = slots[i];
            if (!slot) return;
            const sign = i < mid ? -1 : 1;
            tl.fromTo(slot, { x: () => rest(i).x * 0.2, y: k === 0 ? '40vh' : '110vh', rotate: () => rest(i).rotate + sign * 12 }, { x: () => rest(i).x, y: () => rest(i).y, rotate: () => rest(i).rotate, ease: 'none', duration: k === 0 ? 0.5 : 1 }, k * 0.55);
          });
          return;
        }
        // Narrow: the hand opens once as it scrolls into view.
        const tl = gsap.timeline({ scrollTrigger: { trigger: fan, start: 'top 85%', once: true } });
        order.forEach((i, k) => {
          const slot = slots[i];
          if (!slot) return;
          const sign = i < mid ? -1 : 1;
          tl.fromTo(slot, { x: rest(i).x * 0.2, y: '60vh', rotate: rest(i).rotate + sign * 12 }, { x: rest(i).x, y: rest(i).y, rotate: rest(i).rotate, ease: 'back.out(1.2)', duration: 0.9 }, k * 0.12);
        });
      },
      root,
    );
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [cardW, mid, n, wide]);

  return (
    <section ref={ref} id="markets" {...stylex.props(styles.section, wide && styles.runway(n))} aria-labelledby="markets-title">
      <div {...stylex.props(styles.stage, wide && styles.pinned)}>
        <div {...stylex.props(styles.head)}>
          <Sticker>{labels.eyebrow}</Sticker>
          <h2 id="markets-title" {...stylex.props(styles.h2)} data-reveal="words">
            {labels.title}
          </h2>
          <p {...stylex.props(styles.sub)} data-reveal="lines" data-move="100%">
            {labels.sub}
          </p>
        </div>
        <div ref={fanRef} {...stylex.props(styles.fan)} style={{ '--fan-card-w': `${cardW}px`, height } as CSSProperties}>
          {cards.map((c, i) => {
            const tone = TONES[c.tone];
            return (
              <div key={c.id} data-slot="" {...stylex.props(styles.slot)} style={{ zIndex: 20 - Math.round((Math.abs(i - mid) / mid) * 10) }}>
                <article {...stylex.props(styles.card, styles.bg(tone.c), 'ink' in tone && tone.ink && styles.inkText, c.variant === 'cover' && styles.cover)}>
                  <CardBody c={c} labels={labels} />
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Thumb({ c }: { c: MarketCard }) {
  return (
    <span {...stylex.props(styles.ph, styles.thumb)}>
      <img src={icon(c.icon)} alt="" {...stylex.props(styles.thumbIcon)} />
    </span>
  );
}

function Foot({ c, labels }: { c: MarketCard; labels: MarketsLabels }) {
  return (
    <div {...stylex.props(styles.foot)}>
      {c.variant === 'series' ? (
        <>
          <span {...stylex.props(styles.live)}>
            <i {...stylex.props(styles.dot)} aria-hidden="true" />
            {labels.live}
          </span>
          <span aria-hidden="true">·</span>
          <span>SOL</span>
          <span aria-hidden="true">·</span>
        </>
      ) : null}
      <span>
        {c.vol} {labels.vol}
      </span>
      {c.end ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{c.end}</span>
        </>
      ) : null}
    </div>
  );
}

function Chance({ pct, caption, move }: { pct: number; caption: string; move?: number }) {
  return (
    <div {...stylex.props(styles.chance)}>
      <span {...stylex.props(styles.pct)}>{pct}%</span>
      <span {...stylex.props(styles.caption)}>{caption}</span>
      {move ? (
        <span {...stylex.props(styles.move)}>
          {move > 0 ? '▲' : '▼'} {Math.abs(move)}
        </span>
      ) : null}
    </div>
  );
}

function CardBody({ c, labels }: { c: MarketCard; labels: MarketsLabels }) {
  switch (c.variant) {
    case 'cover':
      return (
        <div {...stylex.props(styles.coverBox)}>
          <span {...stylex.props(styles.ph, styles.coverPh)}>
            <img src={icon(c.icon)} alt="" {...stylex.props(styles.coverIcon)} />
          </span>
          <span {...stylex.props(styles.scrim)} aria-hidden="true" />
          <span {...stylex.props(styles.meter)}>
            <b {...stylex.props(styles.meterPct)}>{c.yes}%</b>
            <span {...stylex.props(styles.meterBar)}>
              <i {...stylex.props(styles.meterFill(c.yes))} />
            </span>
          </span>
          <span {...stylex.props(styles.masthead)}>
            <span {...stylex.props(styles.kicker)}>{c.category}</span>
            <span {...stylex.props(styles.coverTitle)}>{c.q}</span>
          </span>
        </div>
      );
    case 'multi':
      return (
        <>
          <div {...stylex.props(styles.cardHead)}>
            <Thumb c={c} />
            <p {...stylex.props(styles.title, styles.title2)}>{c.q}</p>
          </div>
          <div {...stylex.props(styles.rows)}>
            {c.outcomes?.map((o) => (
              <div key={o.name} {...stylex.props(styles.row)}>
                <span {...stylex.props(styles.avatar)}>{o.name.charAt(0)}</span>
                <span {...stylex.props(styles.oname)}>{o.name}</span>
                <span {...stylex.props(styles.opct)}>{o.pct}%</span>
                <span {...stylex.props(styles.fbtn, styles.compact, styles.yes)}>{labels.yes}</span>
                <span {...stylex.props(styles.fbtn, styles.compact, styles.no)}>{labels.no}</span>
              </div>
            ))}
          </div>
          <Foot c={c} labels={labels} />
        </>
      );
    case 'awaiting':
      return (
        <>
          <div {...stylex.props(styles.cardHead)}>
            <Thumb c={c} />
            <p {...stylex.props(styles.title)}>{c.q}</p>
          </div>
          <div {...stylex.props(styles.body)}>
            <Chance pct={c.yes} caption={labels.chance} />
            <div {...stylex.props(styles.result)}>
              <span {...stylex.props(styles.badge, styles.pending)}>⏳</span>
              <span {...stylex.props(styles.resultLabel)}>{labels.awaiting}</span>
            </div>
          </div>
          <Foot c={c} labels={labels} />
        </>
      );
    case 'resolved':
      return (
        <>
          <div {...stylex.props(styles.cardHead)}>
            <Thumb c={c} />
            <p {...stylex.props(styles.title)}>{c.q}</p>
          </div>
          <div {...stylex.props(styles.body)}>
            <div {...stylex.props(styles.result)}>
              <span {...stylex.props(styles.badge, styles.won)}>✓</span>
              <span {...stylex.props(styles.resultLabel)}>{labels.yes}</span>
            </div>
          </div>
          <Foot c={c} labels={labels} />
        </>
      );
    default: {
      const series = c.variant === 'series';
      return (
        <>
          <div {...stylex.props(styles.cardHead)}>
            <Thumb c={c} />
            <p {...stylex.props(styles.title)}>{c.q}</p>
          </div>
          <div {...stylex.props(styles.body)}>
            <Chance pct={c.yes} caption={series ? (c.up ?? '') : labels.chance} move={c.move} />
            <div {...stylex.props(styles.pair)}>
              <span {...stylex.props(styles.fbtn, styles.wide, styles.yes)}>{series ? c.up : labels.yes}</span>
              <span {...stylex.props(styles.fbtn, styles.wide, styles.no)}>{series ? c.down : labels.no}</span>
            </div>
          </div>
          <Foot c={c} labels={labels} />
        </>
      );
    }
  }
}
